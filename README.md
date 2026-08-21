# Signal Regiment — Personnel Information Management System (PIMS)

A full-stack, enterprise-grade personnel management and analytics platform engineered for the **Signal Regiment, Philippine Army**. Built with a modern **decoupled monorepo architecture** featuring a **React + TypeScript (Vite)** Single Page Application frontend communicating with a **Laravel 11 RESTful API** backend powered by **PostgreSQL**.

---

## System Architecture & Technology Stack

```
signal-regiment-assessment/
├── backend/               # Laravel 11 RESTful API Application
│   ├── app/
│   │   ├── Http/Controllers/    # Auth, Personnel, Dashboard, and Rank Controllers
│   │   ├── Http/Requests/       # FormRequest validation with dynamic database rules & unique checks
│   │   ├── Models/              # Personnel, Rank, and User Eloquent Models with query scopes
│   │   └── Services/            # Isolated business logic layer (PersonnelService, DashboardService, AuthService)
│   ├── database/
│   │   ├── factories/           # Model factories with dynamic Rank model queries
│   │   ├── migrations/          # PostgreSQL schema definitions (personnel, ranks, users, tokens)
│   │   └── seeders/             # Database seeders (Admin, 16 Military Ranks, 20 Realistic Personnel)
│   └── tests/Feature/           # Pest / PHPUnit test suite (27 feature tests, 303 assertions)
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
│   │   ├── hooks/               # Custom hooks (useAuth, usePersonnel, useDashboard, useRanks)
│   │   ├── pages/               # Views (LoginPage, DashboardPage, PersonnelListPage, Create/Edit)
│   │   ├── routes/              # React Router v7 with ProtectedRoute auth guards
│   │   └── services/            # Frontend API services (authService, personnelService, rankService, dashboardService)
│   └── types/                   # Unified TypeScript definitions and interfaces
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
| **Testing**           | Pest PHP & PHPUnit | 27 feature tests covering Auth, CRUD, validation, ranks, and analytics |

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
   > Backend API will be available at `http://localhost:8000`

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
   > Frontend Application will be accessible at `http://localhost:5173`

---

## 🔐 Evaluator Demo Credentials

The database seeders provision a default System Administrator account for immediate evaluation:

| Role | Email Address | Password | Description |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@admin.com` | `password` | Full administrative access to personnel records and analytics |

---

## 🎖️ Key Features & Recent Architecture Highlights

### 1. Database-Seeded Military Ranks
- All 16 official Philippine Army Signal ranks (`PVT` to `MG`) are stored in the database (`ranks` table) with military hierarchical seniority (`order: 1` to `16`) and branch categories (`Enlisted`, `Non-Commissioned Officer`, `Commissioned Officer`, `General Officer`).
- Dropdowns and filters in the frontend dynamically consume `GET /api/ranks` via the `useRanks()` hook without hardcoded arrays.
- Validation dynamically validates rank codes via `exists:ranks,code`.

### 2. Automated Military Serial Number Generator
- Pattern: **`SIG-YYYY-XXXX`** (e.g. `SIG-2026-0001`, `SIG-2026-0021`).
- Generated automatically on the backend upon enlistment to guarantee chronological consistency and uniqueness.
- Form inputs for serial numbers are omitted from the create/edit UI for a clean user experience.

### 3. Datepicker Future Date Constraints
- Both **Date of Birth** and **Date of Enlistment** calendar pickers enforce `max={today}`, preventing future dates from being selected.

### 4. Pure HttpOnly Cookie SPA Authentication
- Authentication uses encrypted `HttpOnly` SameSite session cookies via Laravel Sanctum (`withCredentials: true`), completely removing token storage from `localStorage` to eliminate XSS risks.

### 5. Clean & Minimalist UI Design
- Pure white card toast feedback with color-coded status iconography.
- Subtle neutral slate rounded-square avatar initials (`rounded-xl` / `rounded-2xl`) for personnel without uploaded portraits.
- Clean icon-free military dossier modal layout with structured typography.

---

## REST API Endpoint Reference

All endpoints (except login and CSRF initialization) require Sanctum authentication:

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/sanctum/csrf-cookie` | Initialize CSRF protection cookie | No |
| `POST` | `/api/auth/login` | Authenticate user credentials & start session | No |
| `POST` | `/api/auth/logout` | Terminate session & clear cookies | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `GET` | `/api/ranks` | List all military ranks ordered by hierarchical seniority | Yes |
| `GET` | `/api/personnel/next-serial` | Expose next auto-generated military serial number | Yes |
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
- **`PersonnelValidationTest.php`**: Validates unique serial number rules, required field constraints, dynamic rank database checks, birthday boundaries, and photo mime/size checks.
- **`DashboardTest.php`**: Validates metric aggregations and chart dataset structures.
- **`RankTest.php`**: Validates `GET /api/ranks` seniority ordering and authentication guard.

```
Tests:    27 passed (303 assertions)
Duration: 1.15s
Status:   100% Passed
```

### Running Frontend Production Build Validation
```bash
cd frontend
npm run build
```
