# Component Library Documentation

## Shared & Common Components

### 1. `PortalSwitcher.tsx`
- **Location**: `src/components/common/PortalSwitcher.tsx`
- **Description**: Segmented floating control with Framer Motion spring tab indicator. Switches state between Corporate Portal and Business SaaS Platform with LocalStorage memory key `srijandev_active_portal` and keyboard listener (`Alt+S`).

### 2. `CommandPalette.tsx`
- **Location**: `src/components/common/CommandPalette.tsx`
- **Description**: Modal dialog triggered via `Ctrl+K` or top search bar. Instant fuzzy search across portals, workforce views, employees, leads, and admin settings.

### 3. `CorporateNavbar.tsx` & `Footer.tsx`
- **Description**: Mega menu dropdown, brand logo badge, mobile navigation drawer, and contact links.

## Corporate Portal Components
- `Hero.tsx`: Particle/mesh background, animated text, KPI counters.
- `ServicesSection.tsx`: Core offerings with tech stack badges and pricing.
- `PortfolioSection.tsx`: Filterable project showcase (`All`, `Web`, `AI`, `Cloud`, `ERP`).
- `PricingSection.tsx`: Monthly/Annual billing switcher with 20% discount badge.
- `BlogSection.tsx`: Articles with reading times and author avatars.
- `CareersSection.tsx`: Job openings with application drawer modal.
- `ContactSection.tsx`: Proposal request form with validation state.

## Business Platform SaaS Components
- `DashboardView.tsx`: Executive analytics, KPI widgets, and Recharts area chart.
- `EmployeeView.tsx`: Searchable workforce table with department filters and status badges.
- `AttendanceView.tsx`: Interactive shift clock-in/clock-out simulator.
- `TaskBoardView.tsx`: Interactive Kanban board across To Do, In Progress, Review, and Completed columns.
- `CRMView.tsx`: Deal pipeline stages with total value calculations.
- `DocumentView.tsx`: File vault manager with download links.
- `AnalyticsView.tsx`: Operational velocity bar charts.
- `AdminView.tsx`: User permission governance, RBAC matrix, and database engine status.
