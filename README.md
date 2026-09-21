# Common Ground

[![Deploy Common Ground](https://github.com/TrenerMogau/common-ground-static-site/actions/workflows/deploy.yml/badge.svg)](https://github.com/TrenerMogau/common-ground-static-site/actions/workflows/deploy.yml)
[![Live Site](https://img.shields.io/badge/Live_Site-GitHub_Pages-2ea44f?style=flat&logo=github)](https://trenermogau.github.io/common-ground-static-site/)
[![Project Code](https://img.shields.io/badge/Project_Code-WTC--3JWZDDTJ-c8583e?style=flat)](https://github.com/TrenerMogau/common-ground-static-site)

> A quiet, editorial static website crafted for ideas, reflections, and practical curiosity. Hosted via modern cloud infrastructure with zero runtime bloat.

---

## 📌 Project Overview & Identity

- **🌐 Live Production Website:** [https://trenermogau.github.io/common-ground-static-site/](https://trenermogau.github.io/common-ground-static-site/)
- **📁 GitHub Repository:** [TrenerMogau/common-ground-static-site](https://github.com/TrenerMogau/common-ground-static-site)
- **🔑 Mandatory Project Identifier:** `WTC-3JWZDDTJ`
- **👤 Owner / Creator:** Mogau Mothapo
- **✉️ Contact Email:** [trener.mogau.dev@gmail.com](mailto:trener.mogau.dev@gmail.com)

> [!IMPORTANT]
> The project identifier `WTC-3JWZDDTJ` is a mandatory project code. It is preserved across site metadata, source HTML (`data-project-code`), and documentation across all iterations.

---

## 📖 About The Website

**Common Ground** is designed as a calm, intentional corner of the web for sharing field notes, working principles, and reflective inquiries. Rather than relying on loud animations or heavy client-side frameworks, it emphasizes clarity, readability, and permanence.

### Core Highlights
- **Editorial Aesthetic:** Inspired by print design and quality journals, featuring a warm linen background, crisp dark-slate typography, and terracotta accenting.
- **Fluid & Responsive:** Adapts gracefully from mobile viewports (375px) up to expansive high-resolution displays (1200px+).
- **Accessibility First:** Includes accessible skip-links (`#main-content`), distinct focus indicators (`:focus-visible`), semantic HTML5 landmarks, and `prefers-reduced-motion` compliance.
- **Interactive Notes & Communication:** Clean in-page navigation anchors (`#about`, `#notes`, `#top`) and direct email response triggers with pre-configured subject lines for every note.

---

## 🛠️ Technology Stack & Architecture

Common Ground is built on lightweight web standards paired with enterprise cloud infrastructure:

### 1. Frontend & Design
| Technology | Description |
| :--- | :--- |
| **HTML5** | Semantic, accessible structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) |
| **Vanilla CSS3** | Custom properties (CSS variables), CSS Grid, Flexbox, and fluid `clamp()` responsive typography |
| **Google Fonts** | Premium pairing of **Playfair Display** (editorial headings) and **DM Sans** (body text) |
| **Zero Dependencies** | Pure static files with zero external JS frameworks, ensuring instant load times and 100% reliability |

### 2. Cloud Infrastructure & Hosting
| Service / Tool | Role in Architecture |
| :--- | :--- |
| **GitHub Pages** | Live global HTTPS static website hosting with automated deployment from `main` |
| **Amazon CloudFront** | Global Content Delivery Network (CDN) providing edge caching, HTTPS termination, and security headers |
| **Amazon S3** | Static website storage and private origin bucket |
| **Origin Access Control (OAC)**| SigV4-authenticated access ensuring S3 remains private and requests only come via CloudFront |
| **AWS CloudFormation** | Infrastructure as Code (IaC) defined in `cloudfront.yaml` for repeatable deployments |
| **GitHub Actions** | Automated CI/CD deployment pipeline with pre-deployment integrity validation and edge cache invalidation |
| **PowerShell Scripts** | Automated operator tooling (`deploy.ps1`, `deploy-cdn.ps1`, `cleanup.ps1`) |

---

## 📂 Repository Structure

```text
common-ground-static-site/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline with integrity checks and S3/CloudFront upload
├── index.html                  # Main static HTML document (includes project code WTC-3JWZDDTJ)
├── styles.css                  # Core CSS design system with custom properties and responsive rules
├── cloudfront.yaml             # CloudFormation template: CloudFront, OAC, S3 bucket policy & headers
├── deploy.ps1                  # Automated PowerShell deployment script for S3 static hosting
├── deploy-cdn.ps1              # Automated PowerShell deployment script for CloudFront OAC stack
├── cleanup.ps1                 # Automated PowerShell teardown script for AWS resources
└── README.md                   # Project documentation and iteration history
```

---

## 🗺️ Iteration Roadmap & Progress

- [x] **Iteration 1 — Site Foundation:** Clean HTML5 & CSS3 website, project identity verification (`WTC-3JWZDDTJ`), responsive layouts, and accessibility basics.
- [x] **Iteration 2 — Cloud Deployment:** S3 static website hosting script (`deploy.ps1`), GitHub Actions CI/CD deployment workflow, and live status badge.
- [x] **Iteration 3 — Cloud Security:** CloudFormation template (`cloudfront.yaml`) with Origin Access Control (OAC), private S3 bucket policy, HTTPS enforcement, security headers, and `deploy-cdn.ps1`.
- [x] **Iteration 4 — Evidence, Polish & Resource Cleanup:** Live public deployment, automated cross-device browser testing, AWS resource inventory, and complete resource cleanup script (`cleanup.ps1`).

---

## 🚀 Deployment & Operations

### 1. Local Development
Because Common Ground uses pure static web technologies, no build tools or package managers are required:

```powershell
# Option A: Open directly in your default browser
Start-Process index.html

# Option B: Run via any local static server (e.g. Python)
python -m http.server 8000
```

### 2. Deploy to Amazon S3 (Static Website Hosting)
1. Configure AWS CLI credentials:
   ```powershell
   aws configure
   aws sts get-caller-identity
   ```
2. Run the deployment script with a globally unique bucket name:
   ```powershell
   .\deploy.ps1 -BucketName your-unique-bucket-name -Region us-east-1
   ```
   *The script creates the bucket, sets up website hosting, applies public read access, and uploads the site.*

### 3. Deploy to Amazon CloudFront with OAC (Cloud Security)
To front the website with CloudFront and secure the S3 origin:

```powershell
# Option A: Quick deployment using default CloudFront HTTPS domain
.\deploy-cdn.ps1 -BucketName your-unique-bucket-name

# Option B: Custom domain with Route 53 & ACM certificate
.\deploy-cdn.ps1 -BucketName your-unique-bucket-name -DomainName www.example.com -CertificateArn arn:aws:acm:us-east-1:123456789012:certificate/example
```

### 4. CI/CD Deployment via GitHub Actions
The workflow in `.github/workflows/deploy.yml` triggers on every push to `main`:
- **Pre-deployment Verification:** Automatically validates the presence of `index.html`, `styles.css`, `cloudfront.yaml`, and the required code `WTC-3JWZDDTJ`.
- **Cloud Deployment (Optional):** If the following repository secrets are configured under **Settings > Secrets and variables > Actions**, it will sync to S3 and invalidate CloudFront edge caches:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION`
  - `S3_BUCKET`
  - `CLOUDFRONT_DISTRIBUTION_ID` *(optional)*

---

## 🧪 Verification & Evidence

| Verification Target | Expected Behavior | Live Audit Result |
| :--- | :--- | :--- |
| **Live URL Availability** | Public HTTP 200 response | ✅ [Live Site](https://trenermogau.github.io/common-ground-static-site/) (HTTP 200 OK) |
| **Project Code** | `WTC-3JWZDDTJ` present | ✅ Verified in `index.html` and `README.md` |
| **Owner Identity** | Mogau Mothapo (`trener.mogau.dev@gmail.com`) | ✅ Verified in site copy, meta, and mailto links |
| **CI/CD Status** | Pipeline completion | ✅ Passing (Green status badge) |
| **Anchor Navigation** | `#top`, `#about`, `#notes` smooth scroll | ✅ Verified via live browser session |
| **Accessibility** | Skip to content (`#main-content`) | ✅ Keyboard focusable and functional |
| **Mobile Layout** | Viewports < 760px | ✅ Fluidly collapses to single-column |
| **Security Architecture** | S3 Private + CloudFront OAC | ✅ Direct S3 blocked (403), CloudFront secure (200) |

---

## 🧹 AWS Resource Inventory & Teardown Guide

To prevent ongoing AWS costs after evaluation or testing, all deployed cloud resources can be safely decommissioned:

### Resource Inventory
- **Amazon S3 Bucket:** Private origin storing `index.html` and `styles.css`.
- **Amazon CloudFront Distribution:** Edge caching distribution with SigV4 OAC and HTTPS redirect.
- **AWS CloudFormation Stack:** `common-ground-cdn` managing distribution and bucket policy.

### Automated Teardown
Run the included cleanup script to empty the bucket and delete the CloudFormation stack:

```powershell
.\cleanup.ps1 -BucketName your-unique-bucket-name -Region us-east-1
```

### Manual Teardown via AWS CLI
```powershell
# 1. Delete the CloudFormation stack (removes CloudFront and OAC)
aws cloudformation delete-stack --stack-name common-ground-cdn --region us-east-1
aws cloudformation wait stack-delete-complete --stack-name common-ground-cdn --region us-east-1

# 2. Empty and delete the S3 bucket
aws s3 rm s3://your-unique-bucket-name --recursive
aws s3api delete-bucket --bucket your-unique-bucket-name --region us-east-1
```

---

## 📄 License & Attribution

- **Project Code:** `WTC-3JWZDDTJ`
- **Author:** Mogau Mothapo
- **Year:** 2026
- Built with patience, clear standards, and good questions.
