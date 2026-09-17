param(
  [Parameter(Mandatory = $true)]
  [string]$BucketName,
  [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"

aws sts get-caller-identity | Out-Null

$bucketArgs = @("s3api", "create-bucket", "--bucket", $BucketName, "--region", $Region)
if ($Region -ne "us-east-1") {
  $bucketArgs += @("--create-bucket-configuration", "LocationConstraint=$Region")
}
aws @bucketArgs

aws s3api put-public-access-block `
  --bucket $BucketName `
  --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false

aws s3api put-bucket-website `
  --bucket $BucketName `
  --website-configuration '{"IndexDocument":{"Suffix":"index.html"},"ErrorDocument":{"Key":"index.html"}}'

$policy = @"
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::$BucketName/*"
  }]
}
"@

$policy | Set-Content -Path "$env:TEMP\s3-website-policy.json" -Encoding ascii
aws s3api put-bucket-policy --bucket $BucketName --policy file://$env:TEMP\s3-website-policy.json
aws s3 sync . "s3://$BucketName" --exclude "deploy.ps1" --exclude "README.md" --delete

Write-Host "Published: http://$BucketName.s3-website-$Region.amazonaws.com"
