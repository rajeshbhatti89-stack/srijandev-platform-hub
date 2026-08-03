# Technical Architecture & State Flow

## System Architecture Diagram

```mermaid
graph TD
  User([User / Browser]) --> Switcher[Animated Portal Switcher]
  
  subgraph Portal Context Engine
    Switcher --> |Alt+S or Click| State[React Context + LocalStorage]
  end

  State --> |activePortal: corporate| CorporateRoute[Portal 1: Corporate Website]
  State --> |activePortal: platform| PlatformRoute[Portal 2: Business SaaS Platform]

  subgraph Corporate Portal
    CorporateRoute --> Hero[Animated Hero & KPI Counters]
    CorporateRoute --> Services[Services & Tech Stack]
    CorporateRoute --> Portfolio[Portfolio & Category Filters]
    CorporateRoute --> Pricing[Tiered Pricing & Billing Switcher]
    CorporateRoute --> Blog[Engineering Blog & Publications]
    CorporateRoute --> Contact[Lead Form & API Contact Route]
  end

  subgraph Business Platform (SaaS Ops)
    PlatformRoute --> ExecutiveDash[Executive Dashboard & Recharts]
    PlatformRoute --> Directory[Employee Directory & Filters]
    PlatformRoute --> ShiftClock[Attendance Tracker & Simulator]
    PlatformRoute --> KanbanBoard[Task & Project Kanban]
    PlatformRoute --> CRMPipeline[CRM Lead Pipeline]
    PlatformRoute --> DocVault[Document Vault]
  end

  subgraph Backend Infrastructure
    Contact --> NextAPI[/api/contact]
    Directory --> NextAPI2[/api/employees]
    NextAPI2 --> PrismaORM[Prisma ORM Client]
    PrismaORM --> PostgresDB[(PostgreSQL / Supabase)]
  end
```

---

## State Persistence Strategy

1. **Active Portal State**: Managed via `PortalContext.tsx`. Selection is persisted to `localStorage` under key `srijandev_active_portal`.
2. **Theme State**: Dark mode glassmorphism token rules injected via `globals.css` and `tailwind.config.ts`.
3. **Keyboard Listener**: Global keyboard shortcut listener triggers instantaneous portal switching on `Alt+S`.
