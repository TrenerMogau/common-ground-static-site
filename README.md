# Common Ground

[![Deployment Status](https://github.com/TrenerMogau/common-ground-static-site/actions/workflows/deploy.yml/badge.svg)](https://github.com/TrenerMogau/common-ground-static-site/actions)
![AWS CloudFront](https://img.shields.io/badge/AWS-CloudFront%20OAC-FF9900?logo=amazon-aws&logoColor=white)
![Hosting](https://img.shields.io/badge/Hosting-S3%20%2B%20GitHub%20Pages-232F3E?logo=amazon-s3&logoColor=white)
![Status](https://img.shields.io/badge/Status-Live%20in%20Production-success)

A modern, editorial static publication designed for high performance, accessibility, and secure cloud delivery via Amazon Web Services (AWS) and GitHub Pages.

---

## Live Endpoints

| Platform | Endpoint | Status | Security / CDN |
| :--- | :--- | :--- | :--- |
| **AWS CloudFront (Primary)** | [https://d1o6xr7xtmjhru.cloudfront.net](https://d1o6xr7xtmjhru.cloudfront.net) | `Active` (HTTP 200 OK) | Global Edge CDN, SigV4 OAC, HTTPS |
| **GitHub Pages (Mirror)** | [https://trenermogau.github.io/common-ground-static-site/](https://trenermogau.github.io/common-ground-static-site/) | `Active` (HTTP 200 OK) | Automated GitHub Actions CI/CD |

---

## Project Overview

| Property | Value |
| :--- | :--- |
| **Project Name** | Common Ground Static Site |
| **Project Code** | `WTC-3JWZDDTJ` |
| **Author / Owner** | Mogau Mothapo |
| **Contact Email** | [trener.mogau.dev@gmail.com](mailto:trener.mogau.dev@gmail.com) |
| **Repository** | [TrenerMogau/common-ground-static-site](https://github.com/TrenerMogau/common-ground-static-site) |
| **Cloud Provider** | Amazon Web Services (AWS) |

---

## Architecture & Security Design

The project is hosted using a private origin architecture to ensure maximum security, high global availability, and low latency.

```text
[ User / Browser ]
        │  (HTTPS on port 443)
        ▼
[ AWS CloudFront CDN Edge ] ── (Managed Security Headers Policy)
        │
        │  (SigV4 Origin Access Control - OAC)
        ▼
[ Private AWS S3 Bucket ]
   (Direct Public Access Blocked; Read Allowed Only for CloudFront Distribution)
```

### Key Security Features
* **Origin Access Control (OAC):** Site files reside in a private S3 bucket. Direct public access to the bucket is blocked. Only authenticated CloudFront distribution requests via SigV4 can retrieve objects.
* **Forced HTTPS Redirection:** All HTTP requests are automatically upgraded to secure HTTPS.
* **Security Response Headers:** Standard response headers protect against clickjacking, MIME-sniffing, and cross-site scripting vulnerabilities.
* **Custom Error Handling:** HTTP 403 and 404 conditions seamlessly route to `index.html` to guarantee graceful static navigation.

---

## Design & User Experience

Common Ground is designed around editorial aesthetics and clean typography:

* **Typography Pairing:** Classical serif headings (*Playfair Display*) paired with modern, neutral body typography (*DM Sans*).
* **Color Palette:** Warm editorial aesthetic using custom CSS properties (`--ink`, `--paper`, `--card`, `--accent`).
* **Responsive Layout:** Fluid typography with `clamp()` and responsive CSS Grid / Flexbox layouts tested across mobile, tablet, and desktop displays.
* **Accessibility (a11y):** Includes a hidden `#main-content` skip link for screen readers and keyboard navigators, semantic HTML5 section landmarks, and distinct focus indicators (`:focus-visible`).
* **Interactive Navigation:** Smooth in-page anchor scrolling (`#top`, `#about`, `#notes`) and pre-formatted `mailto:` response triggers for each published note card.

---

## Technology Stack

* **Frontend:** Semantic HTML5, Vanilla CSS3 (Custom properties, CSS Grid, Flexbox).
* **Typography:** Google Fonts (`Playfair Display`, `DM Sans`).
* **Cloud Infrastructure:** Amazon Web Services (S3, CloudFront CDN, CloudFormation).
* **Infrastructure as Code (IaC):** `cloudfront.yaml` CloudFormation template.
* **Automation & Scripting:** PowerShell (`deploy.ps1`, `deploy-cdn.ps1`, `cleanup.ps1`).
* **CI/CD Pipeline:** GitHub Actions (`.github/workflows/deploy.yml`).

---

## Project Structure

```text
common-ground-static-site/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated integrity check & CI/CD deployment pipeline
├── index.html                  # Semantic HTML5 markup containing project code WTC-3JWZDDTJ
├── styles.css                  # Responsive design system & custom properties
├── cloudfront.yaml             # CloudFormation template: CloudFront, OAC, S3 bucket policy
├── deploy.ps1                  # Automated S3 website deployment script
├── deploy-cdn.ps1              # Automated CloudFront OAC deployment script
├── cleanup.ps1                 # Automated AWS resource teardown and cleanup script
└── README.md                   # Project documentation & verification evidence
```

---

## Iteration Milestones & Progress

All project iterations have been completed, tested, and validated:

- [x] **Iteration 1 — Site Foundation:** Designed and developed the static site, confirmed typography and responsive layout, embedded project identifier `WTC-3JWZDDTJ`, and implemented accessibility standards.
- [x] **Iteration 2 — Cloud Deployment & CI/CD:** Built automated deployment scripting, integrated GitHub Actions workflow, established automated pre-deployment verification, and published status badges.
- [x] **Iteration 3 — Cloud Security & CDN:** Built CloudFormation template for CloudFront distribution, configured Origin Access Control (OAC), locked down the S3 origin from public access, and enabled HTTPS redirection.
- [x] **Iteration 4 — Evidence, Production Verification & Polish:** Deployed live to AWS CloudFront (`https://d1o6xr7xtmjhru.cloudfront.net`), verified live HTTP 200 responses, validated responsive design, and established resource cleanup routines.

---

## Deployment & Operations

### 1. Local Development
Open `index.html` in any modern web browser, or run a local Python HTTP server:

```bash
python -m http.server 8000
```

### 2. AWS CloudShell Deployment (Zero-Key Method)
To deploy inside the AWS Management Console without configuring local access keys:

```bash
# 1. Clone repository
git clone https://github.com/TrenerMogau/common-ground-static-site.git
cd common-ground-static-site

# 2. Create S3 bucket and upload files
BUCKET_NAME="common-ground-wtc-$(date +%s)"
aws s3 mb s3://$BUCKET_NAME --region eu-north-1
aws s3 cp index.html s3://$BUCKET_NAME/
aws s3 cp styles.css s3://$BUCKET_NAME/

# 3. Deploy CloudFormation CDN stack
aws cloudformation deploy \
  --template-file cloudfront.yaml \
  --stack-name common-ground-cdn \
  --parameter-overrides BucketName=$BUCKET_NAME \
  --region eu-north-1
```

### 3. Local PowerShell Automated Deployment
When running with an active AWS CLI profile:

```powershell
# Deploy S3 origin and CloudFront CDN distribution
.\deploy-cdn.ps1 -BucketName "your-unique-bucket-name" -Region "eu-north-1"
```

### 4. GitHub Actions CI/CD Pipeline
Every push to `main` triggers `.github/workflows/deploy.yml`, which:
1. Validates HTML and CSS syntax.
2. Asserts that project code `WTC-3JWZDDTJ` is intact.
3. Automatically syncs assets to S3 and invalidates CloudFront edge caches when repository secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET`) are configured.

---

## Verification & Audit Evidence

| Check | Requirement | Result |
| :--- | :--- | :--- |
| **AWS CloudFront Endpoint** | HTTPS CDN delivery | [https://d1o6xr7xtmjhru.cloudfront.net](https://d1o6xr7xtmjhru.cloudfront.net) (`HTTP 200 OK`) |
| **GitHub Pages Endpoint** | Public static mirror | [https://trenermogau.github.io/common-ground-static-site/](https://trenermogau.github.io/common-ground-static-site/) (`HTTP 200 OK`) |
| **Project Code Integrity** | `WTC-3JWZDDTJ` present in HTML/Docs | Verified & Intact |
| **Author / Contact** | Mogau Mothapo (`trener.mogau.dev@gmail.com`) | Verified across all project files |
| **CI/CD Build** | GitHub Actions Workflow | Passing (`success`) |
| **Origin Security** | Private S3 with SigV4 OAC | Verified (Direct S3 public access blocked) |
| **Smooth Navigation** | `#top`, `#about`, `#notes` anchors | Verified working |
| **Email Action Triggers** | `mailto:` links with subject parameters | Verified working |
| **Responsive Viewports** | Mobile (375px), Tablet (768px), Desktop (1200px+) | Verified zero horizontal overflow |
| **Console Diagnostics** | Browser DevTools Console | 0 Errors / Clean |

---

## AWS Resource Teardown

To tear down all deployed cloud infrastructure and prevent ongoing consumption of AWS credits:

### Automated Teardown via Script
```powershell
.\cleanup.ps1 -BucketName "your-unique-bucket-name" -Region "eu-north-1"
```

### Manual Teardown via AWS CLI / CloudShell
```bash
# 1. Delete CloudFormation stack (removes CloudFront distribution and policies)
aws cloudformation delete-stack --stack-name common-ground-cdn --region eu-north-1

# 2. Empty and delete the S3 bucket
aws s3 rm s3://your-unique-bucket-name --recursive
aws s3api delete-bucket --bucket your-unique-bucket-name --region eu-north-1
```

---

## License & Credits

Designed and maintained by **Mogau Mothapo** (2026).  
*Common Ground — Ideas worth making room for.*
