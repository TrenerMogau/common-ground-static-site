# Common Ground

![Deployment status](https://github.com/TrenerMogau/common-ground-static-site/actions/workflows/deploy.yml/badge.svg)

**Live Website:** [https://trenermogau.github.io/common-ground-static-site/](https://trenermogau.github.io/common-ground-static-site/)

A quiet, editorial static website intended for AWS S3 static website hosting and Amazon CloudFront delivery.

**Project code:** `WTC-3JWZDDTJ`

**Owner:** Mogau Mothapo  
**Contact:** [trener.mogau.dev@gmail.com](mailto:trener.mogau.dev@gmail.com)

The project code is a required identifier and must remain in the site source and project documentation during every iteration.

Recommended GitHub repository name: `common-ground-static-site`

---

## About The Website

Common Ground is a clean, minimal personal site designed for thoughtful projects, field notes, and practical curiosity. It focuses on clarity, readability, and durability without unnecessary runtime complexity.

### Key Features & Design
- **Editorial Typography:** High-contrast pairing of *Playfair Display* (serif headings) and *DM Sans* (body text).
- **Responsive Layout:** Adapts smoothly across mobile, tablet, and desktop viewports without horizontal scrolling.
- **Accessibility:** Includes an in-page skip link (`#main-content`), distinct focus rings (`:focus-visible`), and semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **Interactive Navigation:** Smooth-scrolling anchors to `#about` and `#notes`, plus pre-configured `mailto:` response triggers for each published note card.

---

## Technology Stack

- **HTML5:** Semantic, accessible markup containing the project code identifier `data-project-code="WTC-3JWZDDTJ"`.
- **CSS3:** Custom properties (CSS variables), Flexbox, CSS Grid, and responsive `clamp()` typography.
- **Google Fonts:** Hosted web fonts (`Playfair Display` and `DM Sans`).
- **Hosting & CDN:**
  - **GitHub Pages:** Live public HTTPS static hosting from the `main` branch.
  - **AWS S3 & CloudFront:** Architecture configured for private static origin hosting with Origin Access Control (OAC) and HTTPS redirection.
- **Infrastructure as Code (IaC):** AWS CloudFormation template (`cloudfront.yaml`).
- **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`) with pre-deployment integrity verification and optional AWS deployment.
- **Automation Scripts:** PowerShell deployment and cleanup tools (`deploy.ps1`, `deploy-cdn.ps1`, `cleanup.ps1`).

---

## Repository Structure

```text
common-ground-static-site/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment and validation workflow
├── index.html                  # Main static HTML document (includes project code WTC-3JWZDDTJ)
├── styles.css                  # Core CSS stylesheet
├── cloudfront.yaml             # CloudFormation template: CloudFront, OAC, private S3 policy
├── deploy.ps1                  # S3 static website hosting deployment script
├── deploy-cdn.ps1              # CloudFront deployment automation script
├── cleanup.ps1                 # AWS resource teardown and cleanup script
└── README.md                   # Project documentation
```

---

## Iteration Roadmap

- **Iteration 1 - Site foundation:** Keep the plain HTML and CSS site, confirm the project identity, owner, contact email, responsive layout, and accessibility basics.
- **Iteration 2 - Cloud deployment:** Configure AWS credentials, create a globally unique S3 bucket, and publish with `deploy.ps1`. Validate the deployed URL and record the result.
- **Iteration 3 - Cloud security:** Request an ACM certificate in `us-east-1`, configure Route 53, and deploy `cloudfront.yaml` so CloudFront provides HTTPS and the S3 origin can be private.
- **Iteration 4 - Evidence and polish:** Capture deployment evidence, test desktop/mobile behavior, check links and email actions, and document the final AWS resources and cleanup steps.

Each iteration must preserve `WTC-3JWZDDTJ` in `index.html` and `README.md`. Do not replace it with a different project code.

---

## Deployment & Operations

### 1. Local Testing
Open `index.html` directly in any web browser, or serve it locally with Python:

```powershell
python -m http.server 8000
```

### 2. Deploy to Amazon S3
1. Configure local AWS CLI credentials:
   ```powershell
   aws configure
   aws sts get-caller-identity
   ```
2. Run the deployment script with a globally unique bucket name:
   ```powershell
   .\deploy.ps1 -BucketName your-unique-bucket-name -Region us-east-1
   ```
   *The script creates the bucket, enables website hosting, applies public read policy, and uploads site files.*

### 3. Deploy to Amazon CloudFront with OAC
To deploy CloudFront in front of the S3 bucket and make the origin private:

```powershell
# Option A: Deploy using the default CloudFront HTTPS domain
.\deploy-cdn.ps1 -BucketName your-unique-bucket-name

# Option B: Deploy with a custom Route 53 domain and ACM certificate
.\deploy-cdn.ps1 -BucketName your-unique-bucket-name -DomainName www.example.com -CertificateArn arn:aws:acm:us-east-1:123456789012:certificate/example
```

### 4. GitHub Actions CI/CD Deployment
The workflow in `.github/workflows/deploy.yml` triggers on push to `main`:
- Automatically verifies site file integrity and project code `WTC-3JWZDDTJ`.
- If repository secrets are configured, it synchronizes assets to S3 and invalidates CloudFront edge caches:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION`
  - `S3_BUCKET`
  - `CLOUDFRONT_DISTRIBUTION_ID` *(optional)*

---

## Verification Evidence (Iteration 4)

| Verification Check | Target | Result |
| :--- | :--- | :--- |
| **Live URL Availability** | Public HTTPS endpoint | [Live Site](https://trenermogau.github.io/common-ground-static-site/) (HTTP 200 OK) |
| **Project Code Integrity** | `WTC-3JWZDDTJ` in `index.html` & `README.md` | Preserved |
| **Owner / Author** | Mogau Mothapo (`trener.mogau.dev@gmail.com`) | Preserved across all files |
| **CI/CD Pipeline** | `.github/workflows/deploy.yml` | Passing (`success`) |
| **In-Page Navigation** | `#top`, `#about`, `#notes` smooth scroll | Verified working |
| **Email Actions** | `mailto:trener.mogau.dev@gmail.com` | Verified working |
| **Responsive Layout** | Mobile (<760px) and Desktop | Verified responsive |
| **Teardown Automation** | `cleanup.ps1` | Verified syntax |

---

## AWS Resource Inventory & Cleanup

When deployed to AWS, the architecture creates:
- **S3 Bucket:** Static website origin storing site files.
- **CloudFront Distribution:** Global CDN with Origin Access Control (OAC).
- **CloudFormation Stack:** `common-ground-cdn` managing the distribution and bucket policy.

### Automated Teardown
To remove all AWS resources and prevent ongoing charges:

```powershell
.\cleanup.ps1 -BucketName your-unique-bucket-name -Region us-east-1
```

### Manual Teardown via AWS CLI
```powershell
# 1. Delete CloudFormation stack
aws cloudformation delete-stack --stack-name common-ground-cdn --region us-east-1
aws cloudformation wait stack-delete-complete --stack-name common-ground-cdn --region us-east-1

# 2. Empty and delete S3 bucket
aws s3 rm s3://your-unique-bucket-name --recursive
aws s3api delete-bucket --bucket your-unique-bucket-name --region us-east-1
```
