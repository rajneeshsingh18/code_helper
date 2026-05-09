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
- **Infinite Scroll Problem Archive:** Scalable list handling 3.6k+ problems using cursor-based pagination.
- **Real-time Filtering:** Search and filter by difficulty or topic using Next.js URL state.
- **Topic Sheets:** Curated roadmaps for structured interview preparation.
- **Service Layer Architecture:** Centralized business logic with aggressive caching using `unstable_cache`.

### 🔍 SEO & Visibility
- **Dynamic Sitemap:** Automated generation of `sitemap.xml` for all dynamic challenges and roadmaps.
- **Hierarchical Metadata:** Semantic `<title>` and `description` generation for every problem.
- **Dynamic OpenGraph:** High-fidelity sharing cards generated at the edge for every algorithmic challenge.
- **Structured Data:** JSON-LD injection (SoftwareApplication, ItemList) for rich search results.

### 👤 User Features
- **"Command Center" Dashboard:** A visually striking dashboard with live telemetry-style stats and a chronological **Mission History** timeline.
- **Unified Activity Tracking:** Merged history of solves, attempts, personal notes, and bookmarks.
- **"The Ultimate IDE" Workspace:** A full-screen, premium workspace for deep focus and algorithmic mastery.
- **Progress Tracking:** Automatically track solved, attempted, and bookmarked problems.
- **Personal Notes:** Save private notes and complexity analysis directly within the problem workspace.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS 4 + Shadcn/UI |
| **Database** | Neon DB (Serverless PostgreSQL) |
| **ORM** | Prisma 6 |
| **State** | Zustand (Client) + Server Actions (Server) |
| **Auth** | NextAuth.js v4 (GitHub & Google OAuth) |
| **Editor** | Monaco Editor (@monaco-editor/react) |

---

## 📂 Project Structure

```text
leetcode/
├── prisma/                 # Database schema & migrations
├── scripts/                # Data import and seeding scripts
└── src/
    ├── app/                # Next.js App Router (Pages, API, SEO)
    ├── components/         # Reusable UI & Logic components
    │   ├── layout/         # Navbar, Footer
    │   ├── problems/       # Monaco Editor, Actions, Notes
    │   └── ui/             # Shadcn/UI primitives
    ├── lib/                # Shared utilities (Auth, Prisma)
    ├── server/             
    │   ├── actions/        # Server Actions (Mutations)
    │   └── services/       # Service Layer (Queries & Logic)
    └── store/              # Zustand state management
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- A Neon DB (PostgreSQL) instance

<!-- ### 2. Environment Setup
Create a `.env` file in the root:
```env
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-id"
GOOGLE_CLIENT_SECRET="your-secret"
GITHUB_ID="your-id"
GITHUB_SECRET="your-secret"
``` -->

---

<!-- ## 📈 Development Roadmap
- [x] Consolidate `src/app` architecture
- [x] Integrate Monaco Code Editor
- [x] Implement Server Actions for progress tracking
- [x] Build Dynamic Dashboard (Command Center)
- [x] Implement Service Layer & Caching
- [x] Implement Cursor-Based Pagination & Infinite Scroll
- [x] Global UI Redesign (Cyber-Editorial Aesthetic)
- [x] Scalable SEO Architecture (Dynamic Metadata, Sitemaps, OG)
- [x] Advanced Activity Timeline (Mission History)
- [x] Hardened Auth (Middleware & GitHub OAuth)
- [ ] Add real-time code execution (Judge0 Integration)
- [ ] Implement LeetCode-style "Run Tests" functionality -->

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
