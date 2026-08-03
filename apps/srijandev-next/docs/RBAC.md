# Role-Based Access Control (RBAC) Matrix

## Enterprise Roles & Hierarchy

```text
SUPER_ADMIN (Level 7) → Full Unrestricted Read/Write/Delete/Admin
  ↓
ADMIN (Level 6)       → System Administrator & Schema Sync
  ↓
HR (Level 5)          → Recruitment, Payroll, Leaves & Employee Directory
  ↓
MANAGER (Level 4)     → Department Projects, Team Tasks & CRM Pipelines
  ↓
TEAM_LEAD (Level 3)   → Task Board Assignment & Project Reviews
  ↓
EMPLOYEE (Level 2)    → Shift Attendance, Assigned Tasks & File Upload
  ↓
CLIENT (Level 1)      → Project Milestone View & Invoice Downloads
  ↓
GUEST (Level 0)       → Public Corporate Portal Browsing
```

## Permission Guard Component (`PermissionGuard.tsx`)

Wrap protected views with:

```tsx
<PermissionGuard requiredRole="ADMIN">
  <AdminView />
</PermissionGuard>
```
