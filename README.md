# 🚀 CodePrep: Advanced Coding Practice Platform

CodePrep is a high-performance, NeetCode-inspired coding practice platform designed to help developers master technical interviews. Built with **Next.js 15 (App Router)**, **Tailwind CSS 4**, and **Neon DB (PostgreSQL)**.

---

## 🏗 System Architecture & Flow

### 🔄 Problem Solving Workflow
```mermaid
graph TD
    A[User Dashboard] --> B[Topic Sheets / Problem List]
    B --> C{Select Problem}
    C --> D[Monaco Code Editor]
    D --> E[Write Code]
    E --> F[Server Actions: updateProgress]
    F --> G[(Neon DB: PostgreSQL)]
    G --> H[Revalidate Cache]
    H --> A
```

### 📊 Data Import Workflow (Admin)
```mermaid
graph LR
    A[XLSX/CSV File] --> B[Admin Panel]
    B --> C[API: /api/admin/import]
    C --> D[Prisma ORM]
    D --> E[(Neon DB)]
```

---

## 🎯 Key Features

### 💻 Developer Experience
- **Monaco Editor Integration:** A professional-grade coding environment with JavaScript support and theme synchronization.
- **Real-time Filtering:** Search and filter problems by difficulty or topic using Next.js URL state management.
- **Topic Sheets:** Curated collections of problems (Blind 75, Top 150) to provide a structured learning path.

### 👤 User Features
- **Progress Tracking:** Automatically track solved, attempted, and bookmarked problems.
- **Dynamic Dashboard:** Visual statistics including difficulty breakdown and progress bars.
- **Dark Mode:** Fully responsive, neon-themed dark mode using Tailwind CSS 4.

### 🛠 Administrative Tools
- **Bulk Import:** Seamlessly import thousands of problems from LeetCode datasets via XLSX/CSV scripts and UI.
- **Role-based Access:** Dedicated admin panel for data management (Secured via NextAuth).

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS 4 + Shadcn/UI |
| **Database** | Neon DB (Serverless PostgreSQL) |
| **ORM** | Prisma 6 |
| **State** | Zustand (Client) + Server Actions (Server) |
| **Auth** | NextAuth.js v4 |
| **Editor** | Monaco Editor (@monaco-editor/react) |

---

## 📂 Project Structure

```text
leetcode/
├── prisma/                 # Database schema & migrations
├── scripts/                # Data import and seeding scripts
└── src/
    ├── app/                # Next.js App Router (Pages & API)
    ├── components/         # Reusable UI & Logic components
    │   ├── layout/         # Navbar, Footer
    │   ├── problems/       # Monaco Editor, Actions
    │   └── ui/             # Shadcn/UI primitives
    ├── lib/                # Shared utilities (Auth, Prisma)
    ├── server/             # Server-only logic (Actions)
    └── store/              # Zustand state management
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- A Neon DB (PostgreSQL) instance

### 2. Environment Setup
Create a `.env` file in the root:
```env
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-id"
GOOGLE_CLIENT_SECRET="your-secret"
```

### 3. Installation
```bash
npm install
npx prisma generate
npx prisma db push
```

### 4. Import Initial Data
```bash
# Import the first set of problems and sheets
npm run db:seed
```

### 5. Start Development
```bash
npm run dev
```

---

## 📈 Development Roadmap
- [x] Consolidate `src/app` architecture
- [x] Integrate Monaco Code Editor
- [x] Implement Server Actions for progress tracking
- [x] Build Dynamic Dashboard
- [ ] Add real-time code execution (Judge0 Integration)
- [ ] Implement LeetCode-style "Run Tests" functionality
- [ ] Add Social features (Share progress, streaks)

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
