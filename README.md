# 🌊 Resonance

> **Employee Wellness Platform** — Daily emotional check-ins, team health dashboards, and AI-powered recommendations.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io/)

---

## ✨ Features

- **🎯 Daily Check-ins** — Employees log mood, energy, and stress in < 30 seconds
- **📊 Personal Dashboard** — Weekly trends, burnout risk meter, streak tracking
- **🔥 Team Heatmaps** — Managers view aggregated team health (privacy-first)
- **⚠️ Smart Alerts** — Burnout detection within 24 hours of risk signals
- **🤖 AI Recommendations** — Custom transformer model for actionable suggestions
- **🔐 Role-Based Access** — Employee, Manager, Admin with JWT authentication

---

## 🏗️ Architecture

```
Resoance/
├── apps/
│   ├── web/          # Next.js 14 (App Router) frontend
│   └── api/          # NestJS + GraphQL backend
├── packages/
│   ├── shared/       # Shared TypeScript types & utilities
│   └── prisma/       # Prisma schema, client, migrations
└── models/           # Custom transformer model (PyTorch)
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 15+
- Python 3.10+ (for model)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/resonance.git
cd resonance

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and NEXTAUTH_SECRET

# Generate Prisma client
pnpm prisma generate --filter=prisma

# Run database migrations
pnpm prisma migrate dev --filter=prisma

# Seed the database with test data
pnpm prisma db seed --filter=prisma

# Start development servers
pnpm dev
```

### Test Credentials

| Role     | Email              | Password    |
|----------|--------------------|-------------|
| Admin    | admin@demo.com     | password123 |
| Manager  | manager@demo.com   | password123 |
| Employee | employee@demo.com  | password123 |

---

## 🧠 AI Model

The recommendation engine uses a custom **Resonance Transformer** built with PyTorch:

- **Multi-head self-attention** for temporal pattern recognition
- **Emotional feature encoder** for mood/energy/stress signals
- **Risk classification head** (thriving, stable, struggling, at-risk)
- **Burnout probability head** (0-1 continuous score)
- **Recommendation head** for intervention suggestions

```bash
# Install Python dependencies
cd models
pip install -r requirements.txt

# Run inference (example)
echo '{"orgId": "org-demo-001", "context": {"avgMood": 3.2, "burnoutIndex": 45}}' | python resonance_transformer.py
```

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm format` | Format code with Prettier |
| `pnpm prisma migrate dev` | Run Prisma migrations |
| `pnpm prisma db seed` | Seed database with test data |

---

## 🔐 Environment Variables

Create a `.env` file in the root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/resonance

# Auth
NEXTAUTH_SECRET=your-strong-secret-here
NEXTAUTH_URL=http://localhost:3000

# Model
LOCAL_MODEL_PATH=./models/resonance_transformer.py
```

---

## 🎨 Design System

The UI follows a **cyber-wellness** theme:

- **Dark mode first** with glassmorphism effects
- **Neon accents** (blue → purple gradient)
- **Framer Motion** micro-animations
- **Inter font** from Google Fonts

---

## 📄 License

MIT © 2026 Resonance Team
