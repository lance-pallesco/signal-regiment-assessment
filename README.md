# Signal Regiment — Personnel Information Management System (PIMS)

A full-stack, enterprise-grade personnel management and analytics platform engineered for the **Signal Regiment, Philippine Army**. Built with a modern **decoupled monorepo architecture** featuring a **React + TypeScript (Vite)** Single Page Application frontend communicating with a **Laravel 11 RESTful API** backend powered by **PostgreSQL**.

---

## 🏛️ System Architecture & Technology Stack

```
signal-regiment-assessment/
├── backend/               # Laravel 11 RESTful API Application
│   ├── app/
│   │   ├── Http/Controllers/    # Auth, Personnel, and Dashboard Controllers
│   │   ├── Http/Requests/       # FormRequest validation with rank enums & unique constraints
│   │   ├── Models/              # Personnel & User Eloquent Models with query scopes
│   │   └── Services/            # Isolated business logic layer (PersonnelService, DashboardService)
│   ├── database/
│   │   ├── factories/           # Model factories for realistic military data generation
│   │   ├── migrations/          # PostgreSQL schema definitions with composite indexing
│   │   └── seeders/             # Database seeders (demo admin + 20 realistic personnel)
│   └── tests/Feature/           # Pest / PHPUnit test suite (24 feature tests, 215 assertions)
│
├── frontend/              # React 19 + TypeScript (Vite) Single Page Application
│   ├── src/
│   │   ├── api/                 # Axios HTTP client with HttpOnly cookie & XSRF interceptors
│   │   ├── components/
│   │   │   ├── dashboard/       # Recharts analytics (Rank distribution, Donut status, Enlistment trend)
│   │   │   ├── layout/          # Topbar navigation shell and responsive mobile drawer
│   │   │   ├── personnel/       # DataTable, Filter toolbar, Detail modal, and Photo upload
│   │   │   └── ui/              # shadcn/ui components (Card, Button, Dialog, Sonner Toaster, Select)
│   │   ├── contexts/            # In-memory AuthContext for XSS-safe session persistence
│   │   ├── hooks/               # Custom hooks (useAuth, usePersonnel, useDashboard)
│   │   ├── pages/               # Views (LoginPage, DashboardPage, PersonnelListPage, Create/Edit)
│   │   ├── routes/              # React Router v7 with ProtectedRoute auth guards
│   │   └── services/            # Frontend API service layer (authService, personnelService, dashboardService)
└── README.md
```

### Technology Breakdown

| Layer | Technology | Key Decisions & Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript (Vite) | Lightning-fast HMR, strict type safety, zero build overhead |
| **Design System** | Tailwind CSS + shadcn/ui | Clean, tactical military UI, accessible Radix UI primitives, no runtime CSS-in-JS |
| **Data Visualization**| Recharts | Responsive SVG charts (Bar, Donut, Area, Grouped) for executive force analytics |
| **Toast Notifications**| Sonner | Clean, minimalist white card toast alerts with status iconography |
| **Backend Framework** | Laravel 11 (PHP 8.4) | Enterprise REST API, Eloquent ORM, robust middleware & validation |
| **Authentication**    | Laravel Sanctum | Pure `HttpOnly` SameSite Cookie SPA authentication (immune to XSS token theft) |
| **Database**          | PostgreSQL 15+ | Relational schema with composite indexes (`['status', 'rank', 'unit']`, `['last_name', 'first_name']`) |
| **Testing**           | Pest PHP & PHPUnit | 24 feature tests covering Auth, CRUD, validation, and analytics |

---

## 🚀 Quick Start & Installation Guide

### Prerequisites

Ensure the following runtimes are installed on your workstation:
- **PHP** `>= 8.3` (with `pdo_pgsql`, `openssl`, `mbstring`, `fileinfo`, `gd` extensions enabled)
- **Composer** `>= 2.7`
- **Node.js** `>= 18.x` & **npm** `>= 9.x`
- **PostgreSQL** `>= 15` running on `localhost:5432`

---

### 1. Database Configuration

Create the PostgreSQL database for the application:
```sql
CREATE DATABASE pims_db;
```

---

### 2. Backend Setup (Laravel API)

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install PHP dependencies via Composer:
   ```bash
   composer install
   ```

3. Ensure `.env` is configured for your PostgreSQL instance:
   ```env
   APP_NAME="Signal Regiment PIMS"
   APP_ENV=local
   APP_KEY=base64:...
   APP_DEBUG=true
   APP_URL=http://localhost:8000
   FRONTEND_URL=http://localhost:5173

   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=pims_db
   DB_USERNAME=postgres
   DB_PASSWORD=password

   SESSION_DRIVER=database
   SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
   ```

4. Generate application key, link storage, and run database migrations with seeds:
   ```bash
   php artisan key:generate
   php artisan storage:link
   php artisan migrate:fresh --seed
   ```

5. Start the backend development server:
   ```bash
   php artisan serve --port=8000
   ```
   > 📡 Backend API will be available at `http://localhost:8000`

---

### 3. Frontend Setup (React SPA)

1. In a separate terminal, navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Verify `frontend/.env` points to the Laravel API:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > 🌐 Frontend Application will be accessible at `http://localhost:5173`

---

## 🔐 Evaluator Demo Credentials

The database seeders provision a default System Administrator account for immediate evaluation:

| Role | Email Address | Password | Quick Login Action |
| :--- | :--- | :--- | :--- |
| **Battalion S1 Admin** | `admin@signal.mil` | `password` | Click **"Auto-fill Demo Admin"** badge on Login page |

---

## 📐 Architecture Rationale: Why It Was Built This Way

### 1. Decoupled Monorepo Architecture
- **Separation of Concerns**: The frontend is a dedicated client application consuming JSON endpoints. The backend operates purely as a stateless REST service with standard HTTP status codes.
- **Independent Scalability**: Allows the React frontend to be hosted on edge CDNs (Vercel, Cloudflare Pages) while the Laravel API runs on horizontally autoscaled application servers.

### 2. Pure HttpOnly Cookie SPA Authentication (Sanctum Native)
- **Neutralizing XSS**: Storing sensitive bearer tokens in browser `localStorage` exposes them to Cross-Site Scripting vulnerabilities.
- **Enterprise Cookie Security**: Sanctum sets encrypted, `HttpOnly`, `SameSite=Lax` cookies that JavaScript cannot access or exfiltrate. User session state is preserved in React memory (`AuthContext`) and automatically restored via `GET /api/auth/me`.

### 3. Service Layer & Eloquent Scopes
- **Fat Model, Skinny Controller**: Controllers only handle HTTP request parsing and JSON response formatting.
- **Encapsulated Business Domain**: [`PersonnelService.php`](backend/app/Services/PersonnelService.php) handles photo storage, pagination, filtering, and database mutations. [`DashboardService.php`](backend/app/Services/DashboardService.php) aggregates metrics and chart datasets using Eloquent scopes (`active()`, `byRank()`, `byStatus()`, `byUnit()`).

### 4. Component Design System with shadcn/ui & Tailwind
- **Zero Overhead**: shadcn/ui provides copy-owned Radix UI components with complete accessibility (ARIA compliant, keyboard navigable) and zero runtime CSS overhead.
- **Visual Excellence**: Curated military color palette using deep forest emerald `#064e3b`, crisp white card surfaces, soft borders, and responsive layouts.

---

## 📡 REST API Endpoint Reference

All endpoints (except login and CSRF initialization) require Sanctum authentication:

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/sanctum/csrf-cookie` | Initialize CSRF protection cookie | No |
| `POST` | `/api/auth/login` | Authenticate user credentials & start session | No |
| `POST` | `/api/auth/logout` | Terminate session & clear cookies | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `GET` | `/api/personnel` | Paginated personnel list with search & filters | Yes |
| `POST` | `/api/personnel` | Enlist new personnel with optional photo | Yes |
| `GET` | `/api/personnel/{id}` | Retrieve individual personnel military dossier | Yes |
| `PUT/POST`| `/api/personnel/{id}` | Update existing personnel record | Yes |
| `DELETE` | `/api/personnel/{id}` | Discharge / permanently delete personnel | Yes |
| `GET` | `/api/dashboard/metrics` | Summary counts (Total, Active, Reserve, AWOL, Retired) | Yes |
| `GET` | `/api/dashboard/charts` | Chart datasets (Rank, Status, Trends, Demographics) | Yes |

---

## 🧪 Automated Test Suite

The project includes an automated **Pest / PHPUnit feature test suite** with 100% endpoint coverage:

### Running Backend Feature Tests
```bash
cd backend
php artisan test
```

### Test Suite Summary:
- **`AuthTest.php`**: Validates login lifecycle, invalid credentials handling, session checks, and logout.
- **`PersonnelCrudTest.php`**: Validates pagination, status/rank/unit filtering, full-text search, create with file upload, update, and deletion.
- **`PersonnelValidationTest.php`**: Validates unique serial number rules, required field constraints, rank enum whitelist, birthday boundaries, and photo mime/size checks.
- **`DashboardTest.php`**: Validates metric aggregations and chart dataset structures.

```
Tests:    24 passed (215 assertions)
Duration: 0.90s
Status:   100% Passed
```

### Running Frontend Production Build Validation
```bash
cd frontend
npm run build
```

---

## 🤖 AI Disclosure & Development Attribution

This project was engineered using **pair programming with Antigravity AI** (Google DeepMind Advanced Agentic Coding). 
- **AI Utilization**: Architectural design exploration, test suite scaffolding, initial component boilerplate, and SQL indexing optimization.
- **Developer Review & Quality Control**: All schema decisions, database migrations, Eloquent refactorings, security policies (HttpOnly cookie enforcement, CSRF exemptions), UI aesthetic adjustments, and test assertions were reviewed, tested, and validated by the developer.
