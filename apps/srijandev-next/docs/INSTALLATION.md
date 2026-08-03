# Installation & Setup Guide

## Prerequisites

- **Node.js**: v18.0.0 or higher (v26 tested)
- **Package Manager**: npm or yarn or pnpm

## Environment Variables

Copy `.env.example` to `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/srijandev_next?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Step-by-Step Installation

```bash
# 1. Change directory to srijandev-next
cd apps/srijandev-next

# 2. Install dependencies with peer resolution
npm install --legacy-peer-deps

# 3. Generate Prisma ORM Types
npx prisma generate

# 4. Start Next.js Development Server
npm run dev
```

## Build & Typecheck Verification

```bash
npm run typecheck
npm run build
```
