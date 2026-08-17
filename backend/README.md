# BEU Connect Hub — Production-Ready Backend

> **Tagline**: *“One Hub. Every BEU Student.”*  
> **Secondary Tagline**: *“Connect. Learn. Collaborate. Grow.”*

A scalable, secure, and production-ready REST & Real-time backend for **Bihar Engineering University (BEU)** students to study, connect, collaborate, and grow.

---

## 🌟 Architecture & Key Capabilities

- **Normalized Database**: 38+ entities in PostgreSQL managed via Prisma ORM.
- **Authentication & Sessions**: Secure JWT access tokens with rotating refresh tokens stored in hashed format and HttpOnly cookies.
- **Student Verification**: Multi-stage manual & configurable verification workflow without exposing sensitive BEU registration credentials publicly.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for `STUDENT`, `MODERATOR`, and `ADMIN`.
- **Intelligent Learning Hub**:
  - Academic hierarchy: Branch $\rightarrow$ Semester $\rightarrow$ Subject $\rightarrow$ Unit $\rightarrow$ Topic.
  - **AI Academic Assistant**: Multi-lingual chat in English, Hindi, and Hinglish with prompt guardrails.
  - **PYQ Pattern Analyzer**: Historical probability weightage analysis with mandatory safety disclaimer.
  - **Knowledge Map**: Structured DAG tree connecting subject topics, notes, solved PYQs, and video lectures.
  - **Personal Study Planner**: Generates realistic day-by-day exam revision task boards.
- **Campus Social Network & Collaboration**:
  - Social feeds, comments, likes, and multi-resource bookmarks.
  - Student chapters and interest clubs.
  - Real-time 1-to-1 messaging via Socket.IO with typing indicators, read receipts, and online status.
  - **Project Partner Matching**: Explainable recommendation algorithm matching peers by complementary skill stacks.
  - **Senior-Junior Mentorship**: Verified 4th-year senior mentor profiles and 1-on-1 guidance request system.
  - **Career Hub**: Verified Bihar Innovation grants (₹2.25L), SIH hackathons, and paid internships with source validation.
  - **Official BEU Notice Center**: Categorized circulars (🔴 Exam, 🔵 Result, 🟢 Scholarship, ⚪ General).
- **Security & Privacy**:
  - Passwords hashed with bcrypt (salt rounds: 12).
  - Helmet security headers, CORS origin whitelist, and rate limiting.
  - File upload protection with MIME type verification and memory buffer validation.
  - Centralized error handling and structured logger with PII sanitization.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Runtime** | Node.js (v18+) |
| **Language** | TypeScript (Strict mode) |
| **Framework** | Express.js |
| **Database** | PostgreSQL |
| **ORM** | Prisma ORM |
| **Real-time Gateway** | Socket.IO |
| **Authentication** | JSON Web Tokens (JWT) & bcryptjs |
| **Validation** | Zod |
| **File Storage** | Multer + Cloud Storage Abstraction (Local / S3) |
| **API Documentation** | Swagger UI (OpenAPI 3.0) |
| **Testing** | Jest + Supertest |

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/             # Env, Prisma, Constants, Swagger configs
│   ├── controllers/        # Express route handlers
│   ├── routes/             # API routes definition
│   ├── middleware/         # Auth, RBAC, Zod validation, Error, Rate limiting
│   ├── services/           # Business logic domain services
│   ├── integrations/       # Storage drivers & AI provider adapters
│   ├── validators/         # Zod request validation schemas
│   ├── sockets/            # Socket.IO Real-time server & event handlers
│   ├── utils/              # Tokens, passwords, error classes, response formatters
│   ├── types/              # TypeScript declarations & DTOs
│   ├── app.ts              # Express application configuration
│   └── server.ts           # Server bootstrap & WebSocket gateway
├── prisma/
│   ├── schema.prisma       # Full normalized PostgreSQL database schema
│   └── seed.ts             # Realistic BEU colleges, subjects, and mock data
├── tests/                  # Automated integration test suite
├── .env.example            # Environment variables template
├── package.json
└── tsconfig.json
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)

### 2. Installation
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Configure your PostgreSQL database connection string in `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/beu_connect_hub?schema=public"
JWT_SECRET="your_secure_random_jwt_secret"
JWT_REFRESH_SECRET="your_secure_random_refresh_secret"
```

### 4. Database Setup & Migrations
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed development database
npm run prisma:seed
```

### 5. Running the Application
```bash
# Start in development mode with live reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

---

## 📖 API Documentation (Swagger)

Interactive Swagger OpenAPI 3.0 documentation is available at:
👉 **`http://localhost:5000/api/docs`**

### Summary of Core Endpoints

#### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register student with BEU academic info
- `POST /api/auth/login` — Authenticate and receive access + refresh token
- `POST /api/auth/refresh` — Rotate refresh token and issue new access token
- `POST /api/auth/logout` — Revoke session
- `GET  /api/auth/me` — Get current authenticated student profile

#### Profiles & Social (`/api/users`, `/api/posts`, `/api/communities`)
- `GET  /api/users/:id` — View public student skill passport
- `PATCH /api/users/me` — Update bio, portfolio, and skills
- `POST /api/users/me/avatar` — Upload avatar image
- `POST /api/posts` — Publish campus update
- `GET  /api/posts` — Paginated campus feed
- `POST /api/posts/:id/like` — Toggle like
- `POST /api/posts/:id/comments` — Add comment

#### Academic Hub & AI (`/api/academic`, `/api/pyqs`, `/api/notes`, `/api/ai`)
- `GET  /api/academic/branches` — List engineering branches
- `GET  /api/academic/subjects` — List curriculum subjects
- `GET  /api/pyqs` — Solved previous year question papers
- `GET  /api/notes` — Peer handwritten notes
- `POST /api/ai/chat` — Academic AI tutor in English, Hindi & Hinglish
- `POST /api/ai/analyze-pyq` — Exam pattern analyzer with safety disclaimer
- `GET  /api/knowledge-map/:subjectId` — Hierarchical concept DAG

#### Projects & Mentorship (`/api/projects`, `/api/mentors`)
- `POST /api/projects` — Post capstone/hackathon project
- `GET  /api/projects/:id/matches` — Skill-based teammate recommendation
- `GET  /api/mentors` — Senior mentor directory

#### Information Hub & Admin (`/api/notices`, `/api/admin`)
- `GET  /api/notices` — Official university circulars
- `GET  /api/admin/dashboard` — University analytics (Admin only)
- `POST /api/verification/submit` — Submit BEU student verification

---

## 🧪 Testing

Run the automated test suite:
```bash
npm test
```

Test coverage includes:
- Authentication & JWT token generation
- Password hashing security
- Role-based authorization & permission boundaries
- Academic curriculum retrieval
- AI PYQ pattern analyzer disclaimer verification

---

## 🔒 Security & Privacy Standard

1. **BEU Registration Numbers**: Encrypted and never returned in public user profile payloads.
2. **Password Security**: Salted bcrypt hashing with 12 rounds; plain-text passwords are never stored or logged.
3. **Session Security**: Rotating refresh tokens with database revocation tracking.
4. **Content Moderation**: Strict universal report workflows and admin audit logging.
5. **AI Safety**: Mandatory disclaimer attached to all exam pattern analyses stating historical analysis vs certainty.
