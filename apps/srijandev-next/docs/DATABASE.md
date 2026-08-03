# Database Architecture & Prisma Schema

## Overview
Database schemas are defined in `prisma/schema.prisma` and are compatible with **PostgreSQL** and **Supabase**.

## Model Definitions

- **`User`**: Internal employees and system administrators (`ADMIN`, `MANAGER`, `EMPLOYEE`).
- **`Attendance`**: Daily shift clock-in / clock-out timestamps, location details, and total hours worked.
- **`Task`**: Sprint task items (`TODO`, `IN_PROGRESS`, `REVIEW`, `COMPLETED`), priority levels (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), and category tags.
- **`CRMLead`**: Sales prospects, deal values, and stage progression (`NEW`, `CONTACTED`, `PROPOSAL`, `NEGOTIATION`, `WON`, `LOST`).
- **`Service`**: Live services displayed on Portal 1.
- **`BlogPost`**: Articles and technical publications.

## Migration & Sync Commands

```bash
cd apps/srijandev-next
npx prisma generate
npx prisma db push
```
