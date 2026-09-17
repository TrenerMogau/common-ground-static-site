# Common Ground

A small static website intended for AWS S3 static website hosting.

**Project code:** `WTC-3JWZDDTJ`

**Owner:** Mogau Mothapo  
**Contact:** trener.mogau.dev@gmail.com

The project code is a required identifier and must remain in the site source and project documentation during every iteration.

Recommended GitHub repository name: `common-ground-static-site`

## Iteration roadmap

- **Iteration 1 - Site foundation:** Keep the plain HTML and CSS site, confirm the project identity, owner, contact email, responsive layout, and accessibility basics.
- **Iteration 2 - Cloud deployment:** Configure AWS credentials, create a globally unique S3 bucket, and publish with `deploy.ps1`. Validate the deployed URL and record the result.
- **Iteration 3 - Cloud security:** Request an ACM certificate in `us-east-1`, configure Route 53, and deploy `cloudfront.yaml` so CloudFront provides HTTPS and the S3 origin can be private.
- **Iteration 4 - Evidence and polish:** Capture deployment evidence, test desktop/mobile behavior, check links and email actions, and document the final AWS resources and cleanup steps.

Each iteration must preserve `WTC-3JWZDDTJ` in `index.html` and `README.md`. Do not replace it with a different project code.

## Deploy to S3

1. Refresh or configure AWS credentials locally. The current AWS CLI session returned `InvalidClientTokenId`, so deployment cannot run until that is fixed.

```powershell
aws configure
aws sts get-caller-identity
```

2. Choose a globally unique bucket name and run:

```powershell
.\deploy.ps1 -BucketName your-unique-bucket-name -Region us-east-1
```

The script creates the bucket, enables S3 website hosting, applies a public read policy, and uploads the site files.

The resulting URL is:

```text
http://your-unique-bucket-name.s3-website-us-east-1.amazonaws.com
```

## Optional HTTPS with CloudFront

For a real public site, request an ACM certificate in `us-east-1`, validate it with DNS, and create a Route 53 record for your domain. Then deploy the included CloudFormation template:

```powershell
aws cloudformation deploy `
	--stack-name common-ground-cdn `
	--template-file cloudfront.yaml `
	--parameter-overrides BucketName=your-unique-bucket-name DomainName=www.example.com CertificateArn=arn:aws:acm:us-east-1:123456789012:certificate/example `
	--capabilities CAPABILITY_IAM
```

Point the domain's Route 53 alias record at the CloudFront distribution shown in the stack outputs. CloudFront then provides HTTPS, caching, and a private S3 origin.

## Cost and security note

S3 website hosting is inexpensive for a small site, but its direct website endpoint is HTTP and requires public object access. For a real public site, the best next iteration is CloudFront in front of the bucket for HTTPS, caching, and a custom domain. That adds a little setup but keeps the S3 bucket private.
