# Common Ground

![Deployment status](https://github.com/TrenerMogau/common-ground-static-site/actions/workflows/deploy.yml/badge.svg)

**🌐 Live Website URL:** [https://trenermogau.github.io/common-ground-static-site/](https://trenermogau.github.io/common-ground-static-site/)

A thoughtful editorial static website hosted with modern cloud infrastructure and accessible worldwide.

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

## GitHub deployment status

The workflow in `.github/workflows/deploy.yml` runs on every push to `main` and can also be started from the Actions tab. Add these repository secrets before using it:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID` *(optional: automatically invalidates edge cache upon deployment)*

The badge above shows whether the latest deployment succeeded or failed. Keep AWS credentials in GitHub repository secrets; never commit them to this project.

## Iteration 3 - Cloud Security with CloudFront & OAC

Iteration 3 transitions the site from direct HTTP S3 hosting to an enterprise-grade secure HTTPS architecture powered by **Amazon CloudFront** and **Origin Access Control (OAC)**:

- **Private S3 Origin:** Direct public access to the S3 bucket is blocked (`AWS::S3::BucketPublicAccessBlock`). Direct requests to S3 return `403 Forbidden`.
- **SigV4 Authentication:** CloudFront signs requests using Origin Access Control (`AWS::CloudFront::OriginAccessControl`), so only CloudFront can read from the bucket.
- **HTTPS Enforcement:** Viewer protocol policy automatically redirects all HTTP requests to HTTPS.
- **Security Headers:** Enforces modern security headers (`Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`, and `Referrer-Policy`).

### Deploying CloudFront

#### Option A: Quick deployment (Default CloudFront HTTPS domain)
If you do not have a custom domain in Route 53, deploy with the default Amazon CloudFront certificate:

```powershell
.\deploy-cdn.ps1 -BucketName your-unique-bucket-name
```

The script outputs the secure HTTPS URL:
```text
https://dXXXXXXXXXXXXX.cloudfront.net
```

#### Option B: Custom domain with Route 53 & ACM

1. **Request an ACM certificate** in `us-east-1`:
```powershell
aws acm request-certificate `
  --domain-name www.example.com `
  --validation-method DNS `
  --region us-east-1
```

2. **Add DNS validation records** to your Route 53 hosted zone.

3. **Deploy the CloudFormation stack** with your custom domain and certificate:
```powershell
.\deploy-cdn.ps1 `
  --BucketName your-unique-bucket-name `
  --DomainName www.example.com `
  --CertificateArn arn:aws:acm:us-east-1:123456789012:certificate/your-cert-id
```

4. **Create a Route 53 alias record** pointing your custom domain to the CloudFront distribution domain name.

### Verifying Cloud Security

- **Direct S3 Endpoint:** `http://your-unique-bucket-name.s3-website-us-east-1.amazonaws.com` -> `403 Forbidden` (Origin is secured and private).
- **CloudFront HTTPS Endpoint:** `https://dXXXXXXXXXXXXX.cloudfront.net` -> `200 OK` (HTTPS encrypted, cached, and authenticated via OAC).
