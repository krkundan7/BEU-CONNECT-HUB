# BEU Connect Hub

> **Tagline**: *“One Hub. Every BEU Student.”*  
> **Mission**: Connect, Learn, Collaborate, and Grow across Bihar Engineering University (BEU).

---

## 📁 Repository Structure

```
beu-connect-ub/
├── frontend/             # React 19 + TypeScript + Vite + Tailwind CSS SPA
│   ├── src/              # Application source (components, pages, context, data)
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies & scripts
│   └── vite.config.ts    # Vite configuration
│
├── backend/              # Node.js + Express + TypeScript + Prisma Backend
│   ├── src/              # API routes, controllers, middleware, services, sockets
│   ├── prisma/           # PostgreSQL schema & migrations
│   ├── package.json      # Backend dependencies & scripts
│   └── tests/            # Integration & unit test suites
│
└── package.json          # Monorepo root runner scripts
```

---

## ⚡ Quick Start

### Frontend
```bash
# Run from root:
npm run dev:frontend

# Or navigate to frontend folder:
cd frontend
npm install
npm run dev
```

### Backend
```bash
# Run from root:
npm run dev:backend

# Or navigate to backend folder:
cd backend
npm install
npm run dev
```
