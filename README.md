# Signal Regiment Personnel Information Management System (PIMS)
### Technical Assessment Submission

A secure, centralized **Personnel Information Management System (PIMS)** engineered for the **Signal Regiment, Philippine Army**. Designed to streamline service records management, track unit and battalion deployments, automate serial number assignments, and provide real-time regimental strength analytics.

---

## 🏛️ System Overview

The **Signal Regiment PIMS** provides a streamlined command and administrative platform to manage commissioned officers, enlisted troops, and civilian technical specialists across all signal battalions and specialized units.
---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Browser)"]
        UI_Login["Login Page (/)"]
        UI_Dashboard["Command Dashboard (/dashboard)"]
        UI_Personnel["Personnel Management (/personnel)"]
        UI_Modals["Dossier View / Enlist / Edit Modals"]
    end

    subgraph Middleware ["Security & Routing"]
        Edge_MW["Next.js Edge Middleware\n(Session Validation & Redirection)"]
    end

    subgraph API ["Next.js App Router API Routes"]
        Auth_API["/api/auth/*\n(Login, Logout, Me)"]
        Personnel_API["/api/personnel/*\n(List, Create, Update, Delete)"]
        Metrics_API["/api/personnel/metrics\n(Aggregation Analytics)"]
        Upload_API["/api/personnel/upload\n(Photo Storage)"]
    end

    subgraph Business ["Service & Validation Layer"]
        Auth_Service["Auth Helpers (JWT & Bcrypt)"]
        Personnel_Service["PersonnelService (Queries & Auto-SN)"]
        Zod_Validation["Zod Schemas & Military Enums"]
    end

    subgraph Storage ["Data & File Storage"]
        Prisma_ORM["Prisma ORM Client\n(@prisma/adapter-pg)"]
        Postgres_DB[("PostgreSQL Database\n(Tables: users, personnel)")]
        Local_Uploads["Local Storage\n(/public/uploads/personnel/)"]
    end

    UI_Login --> Edge_MW
    UI_Dashboard --> Edge_MW
    UI_Personnel --> Edge_MW
    UI_Modals --> Edge_MW

    Edge_MW --> API

    Auth_API --> Auth_Service
    Personnel_API --> Personnel_Service
    Personnel_API --> Zod_Validation
    Metrics_API --> Personnel_Service
    Upload_API --> Local_Uploads

    Personnel_Service --> Prisma_ORM
    Auth_Service --> Prisma_ORM
    Prisma_ORM --> Postgres_DB
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework & Runtime** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack), React 19, TypeScript |
| **Styling & UI Components** | [Tailwind CSS v4](https://tailwindcss.com/), Radix UI / Shadcn primitives, Lucide React Icons |
| **Data Visualizations** | [Recharts](https://recharts.org/) (Bar Charts, Donut Charts) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/), [Prisma ORM 7](https://www.prisma.io/) with `@prisma/adapter-pg` |
| **Authentication & Security** | [Jose](https://github.com/panva/jose) (JWT), [BcryptJS](https://github.com/dcodeIO/bcrypt.js) |
| **Data Validation** | [Zod](https://zod.dev/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |

---

## 📁 Project Structure

```
signal-regiment-assessment/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts        # Login endpoint with signed JWT session cookie
│   │   │   ├── logout/route.ts       # Logout & session clearing
│   │   │   └── me/route.ts           # Session profile verification
│   │   └── personnel/
│   │       ├── route.ts              # GET (paginated/filtered) & POST (create)
│   │       ├── [id]/route.ts         # GET (by id), PUT (update), DELETE
│   │       ├── metrics/route.ts      # Dashboard aggregation statistics
│   │       └── upload/route.ts       # Photo upload handler
│   ├── dashboard/page.tsx            # Protected Command Dashboard with Recharts
│   ├── personnel/page.tsx            # Protected Personnel CRUD Directory
│   ├── globals.css                   # Tailwind CSS v4 & theme variables
│   └── page.tsx                      # Root Entrypoint / Login Page
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx             # Signal Regiment styled authentication card
│   ├── dashboard/
│   │   ├── DashboardMetrics.tsx      # KPI strength statistic cards
│   │   └── PersonnelCharts.tsx       # Recharts visualizations (Rank, Status, Unit)
│   ├── layout/
│   │   └── AppNavbar.tsx             # Navigation header, user indicator, and logout
│   ├── personnel/
│   │   ├── DeletePersonnelModal.tsx  # Confirmation modal for record deletion
│   │   ├── PersonnelDetailModal.tsx  # Interactive soldier dossier view
│   │   ├── PersonnelFilters.tsx      # Real-time search and multi-dropdown filters
│   │   ├── PersonnelFormModal.tsx    # Enlistment & update form modal with photo upload
│   │   └── PersonnelTable.tsx        # Paginated table with avatars and actions
│   └── ui/                           # Reusable UI primitives (Button, Dialog, Input, etc.)
├── lib/
│   ├── auth.ts                       # JWT token signing/verification & password hashing
│   ├── prisma.ts                     # Prisma client initialization with pg pool adapter
│   └── validations/
│       └── personnel.ts              # Zod validation schema & military constants
├── prisma/
│   ├── schema.prisma                 # Database schema definitions (User, Personnel)
│   └── seed.ts                       # Seed script for admin and 22 personnel records
├── public/
│   └── uploads/personnel/            # Storage directory for uploaded photos
├── middleware.ts                     # Next.js Edge Middleware route protection
└── package.json                      # Scripts and project dependencies
```

---

## ⚙️ Installation & Setup Guide

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm** or **pnpm**
- **PostgreSQL Database** running locally or on a remote instance

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/lance-pallesco/signal-regiment-assessment.git
cd signal-regiment-assessment
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create or verify the `.env` file in the project root:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/personnel_info?schema=public"
JWT_SECRET="signal_regiment_jwt_secret_key_2026_super_secure"
```

> **Note**: Update the PostgreSQL credentials in `DATABASE_URL` (`username`, `password`, `port`, `database_name`) to match your local PostgreSQL environment.

### Step 4: Synchronize Database Schema
Push the Prisma schema to your PostgreSQL database:
```bash
npx prisma db push
```

### Step 5: Seed Initial Data
Seed the default administrator account and 22 realistic Signal Regiment personnel records:
```bash
npm run db:seed
```

### Step 6: Start the Development Server
```bash
npm run dev
```

The application will be running at **`http://localhost:3000`**.

---

## 🔐 Default Evaluator Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **System Administrator** | `admin` | `signal2026!` |

---

## 🗄️ Database Data Models

### `User` Model
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `Int` | Primary Key (Auto-increment) |
| `username` | `String` | Unique username for login |
| `email` | `String` | Unique official email |
| `password` | `String` | Bcrypt-hashed password |
| `name` | `String` | Administrator display name |
| `role` | `String` | Access role (`ADMIN`) |
| `createdAt` / `updatedAt` | `DateTime` | Timestamps |

### `Personnel` Model
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `Int` | Primary Key (Auto-increment) |
| `fullName` | `String` | Soldier full name |
| `serialNumber` | `String` | Unique sequential identifier (`SR-YYYY-XXXX`) |
| `rank` | `String` | Military Rank (PVT to BGEN) |
| `rankCategory` | `String` | `Officer` or `Enlisted Personnel` |
| `birthday` | `DateTime` | Date of birth |
| `gender` | `String` | `Male` or `Female` |
| `civilStatus` | `String` | `Single`, `Married`, `Widowed`, `Separated` |
| `phone` | `String` | Contact phone number |
| `email` | `String` | Official military email |
| `address` | `String` | Residential / barracks address |
| `unit` | `String` | Battalion or specialized unit assignment |
| `position` | `String` | Duty designation / role |
| `dateOfEnlistment` | `DateTime` | Date enlisted in military service |
| `status` | `String` | `Active`, `Reserve`, `Retired` |
| `photo` | `String?` | Relative public path to uploaded photo |

---

## 🚀 Available Scripts

- **`npm run dev`**: Starts the Next.js development server.
- **`npm run build`**: Compiles the optimized production build.
- **`npm start`**: Runs the built Next.js application in production mode.
- **`npm run db:seed`**: Re-populates the database with default admin and initial personnel data.
- **`npm run lint`**: Runs ESLint checks.

---

## 🛡️ Trade Test Verification Checklist

- [x] **Authentication**: Secure login page at `/`, protected dashboard at `/dashboard`, protected personnel CRUD at `/personnel`.
- [x] **Session Persistence**: HTTP-only JWT cookies with automatic redirect for unauthenticated access.
- [x] **Create Personnel**: 13 military fields validated via Zod with photo upload support.
- [x] **Read Personnel**: Paginated table (10/15/25 rows) with photo/initials fallback.
- [x] **Update Personnel**: Edit modal with immutable Serial Number and instant table refresh.
- [x] **Delete Personnel**: Clean confirmation modal with real-time record removal.
- [x] **Real-time Search**: Search by Name or Serial Number.
- [x] **Multi-Dropdown Filters**: Filter by Unit/Battalion, Military Rank, and Duty Status.
- [x] **Command Dashboard**: Live KPI cards and Recharts visualizations.
