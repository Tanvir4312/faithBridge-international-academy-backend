# FaithBridge International Academy - Backend API

[![Express.js](https://img.shields.io/badge/Express.js-5.0-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.6-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.5-blue?style=for-the-badge)](https://www.better-auth.com/)

A robust, scalable, and secure backend infrastructure for the **FaithBridge International Academy** school management platform. This API orchestrates all institutional operations, from student admissions and academic tracking to secure financial transactions and multi-role user management.

---


## 🚀 Core Features

### 🔐 Unified Authentication & RBAC
- **Better Auth Integration**: Secure session management with multi-device support.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for `SUPER_ADMIN`, `ADMIN`, `TEACHER`, `STUDENT`, and `APPLICANT`.
- **Advanced Security**: Password hashing with Bcrypt, JWT-based refresh tokens, and email verification OTP flow.

### 🏛️ Academic Management
- **Hierarchical Structure**: Management of Academic Levels, Classes, and Sections.
- **Dynamic Curriculum**: Subject creation and intelligent relational mapping to teachers.
- **Faculty Management**: Automated class teacher assignments and subject-teacher links.

### 🎓 Admission & Student Lifecycle
- **Admission Configurator**: Control over admission windows, requirements, and status tracking.
- **Application Workflow**: digital admission forms for prospective students with status updates.
- **Student Profiles**: Comprehensive student records including academic and payment history.

### 💳 Financial Ecosystem
- **Stripe Integration**: Secure payment gateway for admission fees and tuition.
- **Transaction Engine**: Real-time payment verification via Stripe Webhooks.
- **Financial Reporting**: Tracking institutional revenue and payment statuses.

### 📢 Communication & Assets
- **Enterprise Notice Board**: System-wide announcements with category filtering.
- **Email Service**: SMTP-integrated notifications for onboarding, password resets, and OTPs.
- **Media Management**: Cloudinary-powered asset hosting for institutional documentation and imagery.

---

## 🛠️ Technologies Used

### Backend Core
- **Node.js & TypeScript**: Type-safe development with modern ES modules.
- **Express.js (v5)**: High-performance web framework.
- **Prisma ORM**: Modern database access for PostgreSQL.
- **PostgreSQL**: Relational database hosted on Neon.tech.

### Specialized Services
- **Better Auth**: Modern authentication framework.
- **Stripe SDK**: Payment processing and webhooks.
- **Cloudinary**: Cloud-based asset management and image optimization.
- **Nodemailer**: SMTP email delivery with EJS templating.

### Utilities
- **Zod**: Schema-based validation for request bodies and environment variables.
- **Bcrypt & JWT**: Secure password handling and tokenization.
- **Node-Cron**: Automated background tasks and scheduling.
- **PDFKit**: Server-side PDF generation for reports and receipts.

---

## 📦 Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **pnpm** (preferred) or npm/yarn
- A running **PostgreSQL** database instance (Neon.tech recommended)

### 🔧 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Tanvir4312/faithBridge-international-academy-backend.git
   cd faithBridge-international-academy-backend
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory and populate it with the following keys:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL="your_postgresql_connection_string"

   # Authentication (Better Auth)
   BETTER_AUTH_SECRET=your_better_auth_secret
   BETTER_AUTH_URL=http://localhost:5000

   # JWT Tokens
   ACCES_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRESIN=1d
   REFRESH_TOKEN_EXPIRESIN=7d

   # Email Service (SMTP)
   EMAIL_SENDER_SMTP_USER=your_email@gmail.com
   EMAIL_SENDER_SMTP_PASS=your_app_password
   EMAIL_SENDER_SMTP_HOST=smtp.gmail.com
   EMAIL_SENDER_SMTP_PORT=465

   # Payment Gateway (Stripe)
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_KEY=your_stripe_webhook_key

   # Cloud Storage (Cloudinary)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Initial Super Admin
   SUPER_ADMIN_EMAIL=superadmin@gmail.com
   SUPER_ADMIN_PASS=password1234
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed Initial Data**
   ```bash
   pnpm seed:admin
   ```

6. **Start Development Server**
   ```bash
   pnpm dev
   ```
   🚀 API will be available at `http://localhost:5000/api/v1`.

---

## 🏗️ Production Deployment
The project is configured for deployment on **Vercel** using `@vercel/node`. Ensure all environment variables are added to your Vercel project settings.

```bash
pnpm build
```

---
© 2026 FaithBridge International Academy. Built for Educational Excellence.
