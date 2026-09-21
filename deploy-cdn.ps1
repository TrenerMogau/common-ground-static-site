param(
  [Parameter(Mandatory = $true)]
  [string]$BucketName,
  [string]$DomainName = "",
  [string]$CertificateArn = "",
  [string]$StackName = "common-ground-cdn",
  [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"

Write-Host "Verifying AWS credentials..."
aws sts get-caller-identity | Out-Null

$templateFile = Join-Path $PSScriptRoot "cloudfront.yaml"
if (-not (Test-Path $templateFile)) {
  throw "CloudFormation template not found: $templateFile"
}

Write-Host "Deploying CloudFront distribution with Origin Access Control (OAC)..."
$paramOverrides = @("BucketName=$BucketName")
if ($DomainName -ne "") {
  $paramOverrides += "DomainName=$DomainName"
}
if ($CertificateArn -ne "") {
  $paramOverrides += "CertificateArn=$CertificateArn"
}

$deployArgs = @(
  "cloudformation", "deploy",
  "--stack-name", $StackName,
  "--template-file", $templateFile,
  "--capabilities", "CAPABILITY_IAM",
  "--region", $Region,
  "--parameter-overrides"
) + $paramOverrides

aws @deployArgs

Write-Host "Retrieving stack outputs..."
$outputs = aws cloudformation describe-stacks `
  --stack-name $StackName `
  --region $Region `
  --query "Stacks[0].Outputs" `
  --output json | ConvertFrom-Json

$distributionId = ($outputs | Where-Object { $_.OutputKey -eq "DistributionId" }).OutputValue
$websiteUrl = ($outputs | Where-Object { $_.OutputKey -eq "WebsiteUrl" }).OutputValue
$distDomain = ($outputs | Where-Object { $_.OutputKey -eq "DistributionDomainName" }).OutputValue

Write-Host "----------------------------------------------------"
Write-Host "CloudFront Distribution ID: $distributionId"
Write-Host "CloudFront Domain:          $distDomain"
Write-Host "Secure HTTPS Website URL:   $websiteUrl"
Write-Host "Origin Security:            Private S3 with OAC enabled"
Write-Host "----------------------------------------------------"
