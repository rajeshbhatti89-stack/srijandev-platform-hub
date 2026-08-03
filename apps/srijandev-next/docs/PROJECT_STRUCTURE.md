# Complete Project Structure (`apps/srijandev-next`)

```text
apps/
  srijandev-next/
    ├── .github/
    │   └── workflows/
    │       └── ci.yml               # GitHub Actions CI/CD Pipeline
    ├── docs/
    │   ├── README.md                # Project Overview & Quickstart
    │   ├── ARCHITECTURE.md          # System Architecture & Flow
    │   ├── INSTALLATION.md          # Local Setup & Commands
    │   ├── COMPONENTS.md            # Catalog of Shared UI Components
    │   ├── API.md                   # API Endpoints & Payloads
    │   ├── DEPLOYMENT.md            # Vercel & Docker Deployment
    │   ├── DATABASE.md              # Prisma Schema & Database Models
    │   ├── AUTHENTICATION.md        # Auth Provider & Multi-Session
    │   ├── RBAC.md                  # Role Hierarchy & Permission Matrix
    │   └── PROJECT_STRUCTURE.md     # Full File Tree Documentation
    ├── prisma/
    │   └── schema.prisma            # Extended Enterprise Prisma Schema
    ├── public/
    │   ├── sitemap.xml              # SEO Sitemap
    │   ├── robots.txt               # Web Crawlers Policy
    │   └── manifest.json            # PWA Web Manifest
    ├── src/
    │   ├── app/
    │   │   ├── api/                 # Next.js API Routes (/auth, /employees, /portal, /contact, /projects, /health)
    │   │   ├── layout.tsx           # Global Root Layout
    │   │   ├── page.tsx             # Main Portal Controller
    │   │   └── not-found.tsx        # 404 Page
    │   ├── components/
    │   │   ├── common/              # Shared UI (PortalSwitcher, CommandPalette, AuthModal, PermissionGuard, CorporateNavbar, PlatformSidebar, Footer)
    │   │   ├── corporate/           # Corporate Portal (Hero, Services, Portfolio, Pricing, Blog, Careers, Contact, CompanyStory, TechStack, Legal)
    │   │   └── platform/            # Business SaaS Platform (Dashboard, Projects, Employees, Attendance, Leaves, Tasks, EnterpriseCRM, Finance, InternalChat, FileManager, OrgChart, Recruitment, Assets, Performance, KnowledgeBase, Analytics, Admin, NotificationDrawer)
    │   ├── features/
    │   │   ├── portal/PortalContext.tsx
    │   │   └── auth/AuthContext.tsx
    │   ├── lib/
    │   │   ├── mockData.ts          # Phase 1 Dataset
    │   │   └── mockDataPhase2.ts    # Phase 2 Dataset
    │   ├── styles/globals.css
    │   └── types/
    │       ├── portal.ts
    │       ├── corporate.ts
    │       ├── platform.ts
    │       └── phase2.ts
    ├── Dockerfile                   # Docker Build
    ├── docker-compose.yml           # Container Orchestration with PostgreSQL
    ├── next.config.mjs              # Next.js Config
    ├── package.json                 # Dependencies
    ├── postcss.config.mjs           # PostCSS Config
    ├── tailwind.config.ts           # Tailwind Styling System
    └── tsconfig.json                # Strict TypeScript Config
```
