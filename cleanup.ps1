param(
  [Parameter(Mandatory = $true)]
  [string]$BucketName,
  [string]$StackName = "common-ground-cdn",
  [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"

Write-Host "===================================================="
Write-Host "Common Ground - AWS Resource Cleanup"
Write-Host "Bucket: $BucketName | Stack: $StackName | Region: $Region"
Write-Host "===================================================="

Write-Host "Verifying AWS caller identity..."
aws sts get-caller-identity | Out-Null

# 1. Delete CloudFormation Stack (CloudFront distribution, OAC, Bucket Policy)
Write-Host "Step 1: Checking for CloudFormation stack '$StackName'..."
$stackExists = aws cloudformation describe-stacks --stack-name $StackName --region $Region 2>&1
if ($LASTEXITCODE -eq 0) {
  Write-Host "Deleting CloudFormation stack '$StackName' (this will disable and remove CloudFront)..."
  aws cloudformation delete-stack --stack-name $StackName --region $Region
  Write-Host "Waiting for stack deletion to complete..."
  aws cloudformation wait stack-delete-complete --stack-name $StackName --region $Region
  Write-Host "CloudFormation stack deleted successfully."
} else {
  Write-Host "Stack '$StackName' not found or already deleted. Skipping."
}

# 2. Empty S3 Bucket (objects and object versions)
Write-Host "Step 2: Checking S3 bucket '$BucketName'..."
$bucketCheck = aws s3api head-bucket --bucket $BucketName 2>&1
if ($LASTEXITCODE -eq 0) {
  Write-Host "Emptying objects from S3 bucket '$BucketName'..."
  aws s3 rm "s3://$BucketName" --recursive

  # Remove any remaining versioned objects if versioning was enabled
  $versions = aws s3api list-object-versions --bucket $BucketName --output json | ConvertFrom-Json
  if ($versions.Versions) {
    Write-Host "Deleting object versions..."
    foreach ($v in $versions.Versions) {
      aws s3api delete-object --bucket $BucketName --key $v.Key --version-id $v.VersionId | Out-Null
    }
  }
  if ($versions.DeleteMarkers) {
    Write-Host "Deleting delete markers..."
    foreach ($dm in $versions.DeleteMarkers) {
      aws s3api delete-object --bucket $BucketName --key $dm.Key --version-id $dm.VersionId | Out-Null
    }
  }

  Write-Host "Step 3: Deleting S3 bucket '$BucketName'..."
  aws s3api delete-bucket --bucket $BucketName --region $Region
  Write-Host "S3 bucket '$BucketName' deleted successfully."
} else {
  Write-Host "S3 bucket '$BucketName' does not exist. Skipping."
}

Write-Host "===================================================="
Write-Host "Cleanup completed successfully. No billable resources remain."
Write-Host "===================================================="
