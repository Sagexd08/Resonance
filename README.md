# Resonance - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- pnpm installed (`npm install -g pnpm`)

---

## 📦 Installation

### 1. Install Dependencies
```bash
# From project root
pnpm install
```

### 2. Set Up Environment Variables

Create `.env` files in the following locations:

#### `apps/web/.env.local`
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/resonance"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# API (if using separate GraphQL API)
NEXT_PUBLIC_API_URL="http://localhost:4000/graphql"
```

#### `apps/api/.env` (if using NestJS backend)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/resonance"
JWT_SECRET="your-jwt-secret-key"
PORT=4000
```

### 3. Generate Prisma Client
```bash
# Generate for web app
cd packages/prisma
pnpm prisma generate

# Generate for API (if using)
cd ../../apps/api
pnpm prisma generate
```

### 4. Run Database Migrations
```bash
cd packages/prisma
pnpm prisma migrate dev --name init
```

### 5. Seed the Database (Optional)
```bash
cd packages/prisma
pnpm prisma db seed
```

This creates test users:
- **Admin:** admin@demo.com / password123
- **Manager:** manager@demo.com / password123
- **Employee:** employee@demo.com / password123

---

## 🏃 Running the Application

### Development Mode

#### Option 1: Web App Only (Recommended for testing)
```bash
cd apps/web
pnpm run dev
```

Visit: http://localhost:3000

#### Option 2: Full Stack (Web + API)
```bash
# Terminal 1 - API
cd apps/api
pnpm run dev

# Terminal 2 - Web
cd apps/web
pnpm run dev
```

### Production Build
```bash
cd apps/web
pnpm run build
pnpm run start
```

---

## 🧪 Testing the Application

### 1. Landing Page
Visit: http://localhost:3000
- Should see the marketing landing page
- Click "Get Started" or "Login"

### 2. Authentication
- **Sign Up:** Create a new account
- **Login:** Use demo credentials or your new account

### 3. Daily Check-In
Visit: http://localhost:3000/check-in
- Select your mood (Energized, Happy, Neutral, or Drained)
- Optionally add a note
- Submit

### 4. Dashboard
Visit: http://localhost:3000/dashboard
- View your burnout risk score
- See personal metrics (mood, energy, stress)
- If you're a manager, see team metrics

### 5. Analytics
Visit: http://localhost:3000/analytics
- View mood trends over time
- See burnout risk timeline
- Analyze insights

---

## 🗄️ Database Management

### View Database in Prisma Studio
```bash
cd packages/prisma
pnpm prisma studio
```

Opens a GUI at http://localhost:5555

### Reset Database (Caution!)
```bash
cd packages/prisma
pnpm prisma migrate reset
```

### Create New Migration
```bash
cd packages/prisma
pnpm prisma migrate dev --name your_migration_name
```

---

## 🐛 Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
cd packages/prisma
pnpm prisma generate
```

### "Database connection failed"
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in `.env.local`
3. Verify database exists: `createdb resonance`

### "NextAuth error"
1. Ensure NEXTAUTH_SECRET is set in `.env.local`
2. Ensure NEXTAUTH_URL matches your dev server

### TypeScript Errors
1. Reload VS Code window: `Ctrl+Shift+P` → "Reload Window"
2. Restart TS Server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
3. See [HANDLING_WARNINGS.md](./HANDLING_WARNINGS.md)

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
pnpm install
pnpm run build
```

---

## 📁 Project Structure

```
Resonance/
├── apps/
│   ├── web/              # Next.js frontend
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   └── .env.local    # Environment variables
│   └── api/              # NestJS backend (optional)
├── packages/
│   └── prisma/           # Shared Prisma schema
│       ├── schema.prisma # Database schema
│       └── seed.ts       # Database seeder
└── docs/                 # Documentation
```

---

## 🔑 Default Test Credentials

After running `pnpm prisma db seed`:

| Role     | Email                | Password    |
|----------|---------------------|-------------|
| Admin    | admin@demo.com      | password123 |
| Manager  | manager@demo.com    | password123 |
| Employee | employee@demo.com   | password123 |

---

## 🎯 Next Steps

1. **Customize the schema:** Edit `packages/prisma/schema.prisma`
2. **Add features:** Follow the [Implementation Plan](./IMPLEMENTATION_PLAN.md)
3. **Deploy:** See deployment guides for Vercel, Railway, or your platform
4. **Configure email:** Set up email notifications for alerts
5. **Add analytics:** Integrate with your analytics platform

---

## 📚 Documentation

- [Product Requirements](./RESONANCE_PRD.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [Handling Warnings](./HANDLING_WARNINGS.md)
- [Implementation Plan](./IMPLEMENTATION_PLAN.md)

---

## 🆘 Need Help?

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
3. Check the console for error messages
4. Ensure all environment variables are set

---

## ✨ You're All Set!

Your Resonance application is ready to use. Start by:
1. Running `pnpm run dev` in `apps/web`
2. Visiting http://localhost:3000
3. Creating an account or using demo credentials
4. Completing your first check-in!

Happy coding! 🚀
