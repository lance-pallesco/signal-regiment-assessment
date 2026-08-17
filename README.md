# Client Project Tracker

A full-stack **Client Project Tracker** built for digital agencies to manage client projects, monitor project progress, and manage priorities.

This project uses **Next.js (App Router)**, **Prisma 7** with **PostgreSQL**, **Zod**, **Shadcn UI**, and **Tailwind CSS**.

---

## Technical Stack

- **Framework**: Next.js 16 (App Router, Turbopack) & React 19
- **Database & ORM**: PostgreSQL, Prisma 7 (`@prisma/client`, `@prisma/adapter-pg`, `pg`)
- **Validation**: Zod (v4)
- **Styling**: Tailwind CSS v4, Shadcn UI, Google Font (Manrope)
- **Notifications**: Sonner
- **Icons**: Lucide React

---

## Key Features

- **Dashboard Metrics**: Overview cards displaying real-time metrics for total projects, in-progress, planning, on-hold, and completed projects.
- **Search, Filter & Sorting**:
  - Case-insensitive search by client name, project name, or description.
  - Status filter (*Planning*, *In Progress*, *On Hold*, *Completed*).
  - Priority filter (*Low*, *Medium*, *High*).
  - Multi-field sorting (ID, Client Name, Project Name, Start Date, Due Date) in ascending or descending order.
- **RESTful API**: Clean API routes with response status codes, decoupled business logic, and URL rewrite support for `/projects` and `/projects/:id`.
- **Form Modals & Validation**:
  - Accessible Shadcn UI Dialog modals for creating, editing, and deleting projects.
  - Client-side and server-side Zod validation with inline error messaging.
  - Validation rule enforcing `dueDate >= startDate`.
- **Database Seeding**: Script populating 12 sample projects from `test_data.json` into PostgreSQL with sequence resetting.

---

## Project Architecture & Clean Code

The codebase follows a decoupled multi-tier architecture adhering to best practices:

```
├── app/
│   ├── api/
│   │   └── projects/         # REST API route handlers (GET, POST, PUT, DELETE)
│   ├── globals.css           # Design tokens & Tailwind setup
│   ├── layout.tsx            # Root layout with Manrope font & Toast provider
│   └── page.tsx              # Main Dashboard UI page
├── components/
│   ├── projects/             # Feature components (Filters, Table, Metrics, Modals)
│   └── ui/                   # Reusable Shadcn UI primitives (Button, Dialog, Badge, Input, etc.)
├── lib/
│   ├── services/             # Decoupled ProjectService business logic layer
│   ├── validations/          # Zod schema definitions and types
│   ├── prisma.ts             # Singleton Prisma Client with PostgreSQL driver adapter
│   └── utils.ts              # Utility class merging functions
├── prisma/
│   ├── schema.prisma         # Prisma 7 database schema
│   └── seed.ts               # Database seed script
├── prisma.config.ts          # Prisma 7 configuration file
└── test_data.json            # Initial sample dataset
```

---

## Prerequisites

Before running the project, ensure you have the following installed on your machine:

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Running locally or on a accessible remote host on port `5432`

---

## Installation & Setup

### 1. Clone the Repository & Navigate to Workspace
```bash
git clone <repository-url>
cd assessment
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root directory:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/client_tracker?schema=public"
```

> **Note**: Update the username, password, host, port, and database name in `DATABASE_URL` to match your local PostgreSQL setup if needed.

### 4. Push Database Schema
Synchronize the Prisma schema with your PostgreSQL database:

```bash
npx prisma db push
```

### 5. Seed the Database
Populate the database with the initial 12 sample client projects:

```bash
npm run db:seed
```
*(Or run `npx prisma db seed`)*

---

## Running the Application

### Development Mode
Start the Next.js development server with hot-reloading:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Run
To test the optimized production build:

```bash
npm run build
npm start
```

---

## API Reference

The application exposes a full REST API for client projects under `/api/projects` (also accessible via `/projects` rewrite):

| Method | Endpoint | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | List all projects | `search`, `status`, `priority`, `sortBy`, `sortOrder` |
| `GET` | `/api/projects/:id` | Get single project by ID | None |
| `POST` | `/api/projects` | Create a new project | JSON body with project fields |
| `PUT` | `/api/projects/:id` | Update an existing project | JSON body with project fields |
| `DELETE` | `/api/projects/:id` | Delete a project by ID | None |

### Sample Request Payload (POST / PUT)

```json
{
  "clientName": "Acme Corporation",
  "projectName": "Corporate Website Redesign",
  "description": "Redesign and modernize the company corporate website.",
  "status": "In Progress",
  "priority": "High",
  "startDate": "2026-06-01",
  "dueDate": "2026-07-15"
}
```

---

## Validation Rules

- **Client Name**: Required (non-empty string).
- **Project Name**: Required (non-empty string).
- **Status**: Must be one of `Planning`, `In Progress`, `On Hold`, `Completed`.
- **Priority**: Must be one of `Low`, `Medium`, `High`.
- **Due Date**: Cannot be earlier than `startDate`.

---

## AI Tooling Disclosure

As per the technical assessment guidelines, **Google Antigravity AI** was used during development for project scaffolding, TypeScript validation, and automated code review.
