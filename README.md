# Алми Груп ООД — IT Support Platform

Production-quality IT support web application built with Next.js 16, Prisma, and TailwindCSS v4.

## Local Development Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env if needed (defaults work for local SQLite development)
```

### 3. Initialize the local database (SQLite)

```bash
npm run db:setup
# Runs: prisma db push && node prisma/seed.js
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploy to Vercel

### Required Environment Variables

Set these in your Vercel project dashboard under **Settings → Environment Variables**:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string (see below) |
| `JWT_SECRET` | ✅ Yes | Min 32-char random string |
| `NEXT_PUBLIC_SITE_URL` | ✅ Yes | Your production domain |
| `RESEND_API_KEY` | Optional | Email sending via Resend API |
| `EMAIL_FROM` | Optional | Sender email address |
| `ADMIN_NOTIFICATION_EMAIL` | Optional | Admin alert recipient |

### Database for Production

This project uses **SQLite locally** and requires a **hosted PostgreSQL** for Vercel:

1. Create a PostgreSQL database (Vercel Postgres, Neon, Supabase, or PlanetScale)
2. Update `DATABASE_URL` in Vercel environment variables
3. Change `provider = "sqlite"` → `provider = "postgresql"` in `prisma/schema.prisma`
4. Run migrations: `npx prisma migrate deploy` (or `prisma db push` for a first deploy)

### Build Command

The Vercel build command is set automatically from `package.json`:

```
prisma generate && next build
```

> ⚠️ `prisma db push` is intentionally **not** run at build time to prevent accidental schema changes in production. Run migrations manually before deploying.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (generates Prisma client) |
| `npm run db:setup` | Init local SQLite DB and seed demo data |
| `npm run lint` | Run ESLint |
