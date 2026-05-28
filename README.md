# 🚀 CareerSync AI — Land Your Dream Job with AI Precision

<div align="center">

![CareerSync AI Banner](https://via.placeholder.com/1200x400/14b46a/ffffff?text=🚀+CareerSync+AI+-+Land+Your+Dream+Job+with+AI+Precision)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.x-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=for-the-badge&logo=mysql)](https://mysql.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-1.5%20Flash-purple?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![JWT](https://img.shields.io/badge/JWT-Auth-red?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**A full-stack AI-powered career optimization platform that analyzes resumes, matches job descriptions, generates cover letters, runs mock interviews, builds career roadmaps, tracks job applications, and provides 24/7 AI career coaching.**

[🌐 Live Demo](#deployment-guide) • [📖 API Docs](#api-endpoints-reference) • [🚀 Quick Start](#-getting-started) • [🐛 Report Bug](#-contact--support)

</div>

---

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [❗ The Problem It Solves](#-the-problem-it-solves)
- [✅ How It Solves It](#-how-it-solves-it)
- [🏗️ System Architecture](#️-system-architecture)
- [🔧 Tech Stack](#-tech-stack)
- [📁 Complete Folder Structure](#-complete-folder-structure)
- [🗄️ Database Design](#️-database-design)
- [🌊 Complete Workflow](#-complete-workflow)
- [🚀 Getting Started](#-getting-started)
- [🌍 Deployment Guide](#-deployment-guide)
- [🔐 Security Implementation](#-security-implementation)
- [📡 API Endpoints Reference](#-api-endpoints-reference)
- [🚧 Future Improvements](#-future-improvements)
- [✅ Dos and Don'ts](#-dos-and-donts)
- [📞 Contact & Support](#-contact--support)

---

## 🎯 Project Overview

**CareerSync AI** is a production-ready full-stack SaaS platform that acts as a personal AI career coach. It combines a modern React frontend with a robust Spring Boot backend, powered by Google Gemini 1.5 Flash AI.

| Feature | Description |
|---|---|
| 📄 Resume Analyzer | Upload PDF → AI extracts skills, scores ATS compatibility (0–100), lists strengths/weaknesses |
| 🎯 JD Matcher | Paste any job description → AI calculates match %, highlights keyword gaps |
| ✍️ Cover Letter AI | Enter company + role + experience → AI writes a tailored professional cover letter |
| ⚡ Skill Gap Analyzer | Set a target role → AI identifies missing skills + learning resources + project ideas |
| 🎤 Mock Interview | Choose category + difficulty → AI generates questions + evaluates your answers |
| 🗺️ Career Roadmap | Input current & target role → AI builds a personalized phase-by-phase career plan |
| 📊 Job Tracker | Full CRUD pipeline to track applications from wishlist to offer |
| 🤖 AI Chatbot | Persistent multi-session career advisor chatbot powered by Gemini |
| 📈 Dashboard | Real-time stats, charts, ATS score ring, quick action cards |

---

## ❗ The Problem It Solves

Every job seeker faces the same painful reality:

- ❌ **Resume guesswork** — No idea if their resume will pass ATS filters
- ❌ **JD blindness** — Can't identify exactly which keywords are missing for a specific role
- ❌ **Cover letter fatigue** — Writing a new cover letter for every job is exhausting
- ❌ **Skill uncertainty** — Don't know what to learn next to reach their target role
- ❌ **Interview anxiety** — No structured way to practice for specific interview types
- ❌ **Application chaos** — Losing track of dozens of applications across spreadsheets
- ❌ **No mentor** — Career advice is expensive or hard to access

This costs job seekers **weeks of wasted time** and **dozens of missed opportunities**.

---

## ✅ How It Solves It

CareerSync AI provides a **complete AI-powered career toolkit** in one platform:

```
UPLOAD  →  ANALYZE  →  OPTIMIZE  →  PRACTICE  →  TRACK  →  LAND THE JOB
```

**Step 1 — UPLOAD** 📤
Upload your PDF resume. Apache PDFBox extracts the full text and stores it for analysis.

**Step 2 — ANALYZE** 🔍
Gemini AI analyzes your resume: calculates ATS score, extracts skills, identifies strengths and weaknesses, and provides actionable suggestions.

**Step 3 — OPTIMIZE** ✨
Match your resume against any job description, identify missing keywords, generate a tailored cover letter, and discover skill gaps with learning resources.

**Step 4 — PRACTICE** 🎤
Run mock interviews across 7 categories (HR, DSA, Backend, Frontend, System Design, Behavioral, Mixed) with AI-generated questions and per-answer feedback and scoring.

**Step 5 — TRACK** 📊
Log every job application, update statuses (Wishlist → Applied → Interview → Offer), and visualize your pipeline with charts.

**Step 6 — LAND THE JOB** 🎯
Use the AI chatbot as your 24/7 career advisor for any question — salary negotiation, career transitions, company research, and more.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                                 │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │              React + Vite Frontend  (localhost:5173)             │ │
│  │                                                                   │ │
│  │  Landing → Login/Register → Dashboard → 8 AI Feature Pages      │ │
│  │                                                                   │ │
│  │  AuthContext (JWT)  │  ThemeContext (Dark/Light)                 │ │
│  │  Axios Interceptors │  React Router Protected Routes             │ │
│  └──────────────────────────────┬────────────────────────────────────┘ │
│                                  │  HTTP REST (/api/*)                 │
│                                  │  Vite Proxy (dev)                  │
│                                  ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │          Spring Boot Backend  (localhost:9090/api)               │ │
│  │                                                                   │ │
│  │  JwtAuthFilter → Controllers → Services → Repositories → MySQL  │ │
│  │                                                                   │ │
│  │  ┌─────────────┐   ┌──────────────┐   ┌─────────────────────┐  │ │
│  │  │ AuthController│  │ResumeController│  │InterviewController  │  │ │
│  │  │ JdController │  │SkillGapCtrl  │  │CareerRoadmapCtrl    │  │ │
│  │  │ ChatController│  │JobTrackerCtrl│  │DashboardController  │  │ │
│  │  └─────────────┘   └──────────────┘   └─────────────────────┘  │ │
│  │                                                                   │ │
│  │              GeminiAiService (AI Layer)                          │ │
│  │              ↕ Calls Google Gemini 1.5 Flash API                 │ │
│  └──────────────────────────────┬────────────────────────────────────┘ │
│                                  │ JPA / Hibernate                     │
│                                  ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │              MySQL 8.0  (careersync_db)                          │ │
│  │  users │ resumes │ job_applications │ skill_analyses             │ │
│  │  career_roadmaps │ interview_sessions │ chat_histories           │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼ External API
                     ┌─────────────────────────────┐
                     │  Google Gemini 1.5 Flash API │
                     │  generativelanguage.googleapis.com │
                     └─────────────────────────────┘
```

---

## 🔧 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.x | UI framework |
| Vite | 5.x | Build tool + dev proxy |
| Tailwind CSS | 3.x | Utility-first styling + dark mode |
| Framer Motion | 11.x | Page and component animations |
| React Router DOM | 6.x | Client-side routing + protected routes |
| Axios | 1.x | HTTP client with JWT interceptors |
| React Hook Form | 7.x | Form state + validation |
| Recharts | 2.x | Dashboard bar/pie charts |
| React Hot Toast | 2.x | Toast notification system |
| Lucide React | 0.383.x | Icon library |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Spring Boot | 3.2.x | REST API framework |
| Spring Security | 6.x | Authentication + authorization |
| Spring Data JPA | 3.x | Database ORM layer |
| Hibernate | 6.x | JPA implementation |
| JJWT | 0.12.5 | JWT token generation + validation |
| Lombok | 1.18.x | Boilerplate reduction |
| Apache PDFBox | 3.0.x | PDF text extraction |
| SpringDoc OpenAPI | 2.5.x | Swagger UI auto-documentation |
| ModelMapper | 3.2.x | DTO ↔ Entity mapping |

### AI & Database
| Technology | Purpose |
|---|---|
| Google Gemini 1.5 Flash | Resume analysis, JD matching, cover letters, interviews, roadmaps, chatbot |
| MySQL 8.0 | Primary relational database |
| HikariCP | Database connection pooling |

### DevOps & Tools
| Tool | Purpose |
|---|---|
| Maven | Backend dependency management + build |
| npm | Frontend package management |
| Vercel | Frontend deployment (CDN + serverless) |
| Render / Railway | Backend deployment |
| PlanetScale / Railway | Managed MySQL database |
| Postman | API testing |
| Swagger UI | Interactive API documentation |

---

## 📁 Complete Folder Structure

```
careersync/
│
├── 📁 careersync-frontend/                  # React + Vite Web Application
│   ├── 📁 public/
│   │   └── favicon.svg
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 layout/
│   │   │   │   ├── AppLayout.jsx            # Authenticated shell (Sidebar + Topbar + Outlet)
│   │   │   │   ├── Sidebar.jsx              # Collapsible nav with all routes
│   │   │   │   └── Topbar.jsx               # Top bar with theme toggle + user avatar
│   │   │   └── 📁 ui/
│   │   │       ├── index.jsx                # Button, Input, Modal, Badge, Card, ScoreRing,
│   │   │       │                            # ProgressBar, EmptyState, SkeletonCard, AiResultBox
│   │   │       └── Spinner.jsx              # Reusable loading spinner
│   │   ├── 📁 context/
│   │   │   ├── AuthContext.jsx              # JWT auth state, login/register/logout
│   │   │   └── ThemeContext.jsx             # Dark/light mode toggle + localStorage persistence
│   │   ├── 📁 hooks/
│   │   │   └── index.js                     # useAsync, useLocalStorage, useDebounce,
│   │   │                                    # useCopyToClipboard, useOutsideClick
│   │   ├── 📁 pages/
│   │   │   ├── Landing.jsx                  # Public landing page with features + CTA
│   │   │   ├── Login.jsx                    # Login with split-panel design
│   │   │   ├── Register.jsx                 # Registration with stats panel
│   │   │   ├── Dashboard.jsx                # Stats cards + bar/pie charts + quick actions
│   │   │   ├── ResumeAnalyzer.jsx           # PDF upload + drag-drop + AI analysis display
│   │   │   ├── JDMatcher.jsx                # JD paste + match % + keyword gap
│   │   │   ├── CoverLetter.jsx              # Form + AI generated letter + copy/download
│   │   │   ├── SkillGap.jsx                 # Target role + missing skills + resources
│   │   │   ├── MockInterview.jsx            # Category select → questions → AI feedback
│   │   │   ├── CareerRoadmap.jsx            # Generate + phase timeline + history tab
│   │   │   ├── JobTracker.jsx               # CRUD list + status filters + modals
│   │   │   ├── Chatbot.jsx                  # Multi-session chat with starter prompts
│   │   │   └── Profile.jsx                  # User settings + role selectors + sign out
│   │   ├── 📁 routes/
│   │   │   └── ProtectedRoute.jsx           # Auth guard → redirect to /login
│   │   ├── 📁 services/
│   │   │   ├── api.js                       # Axios instance + request/response interceptors
│   │   │   └── index.js                     # All API service modules (auth, resume, jd, etc.)
│   │   ├── 📁 utils/
│   │   │   └── helpers.js                   # formatDate, timeAgo, splitLines, validatePDF,
│   │   │                                    # scoreColor, STATUS_COLORS, safeJson
│   │   ├── App.jsx                          # BrowserRouter + all routes + Toaster
│   │   ├── main.jsx                         # React DOM entry point
│   │   └── index.css                        # Tailwind directives + custom component classes
│   ├── .env.example                         # Frontend env vars template
│   ├── .env.local                           # Local env (VITE_API_BASE_URL= empty)
│   ├── .gitignore
│   ├── vercel.json                          # Vercel SPA config + env binding
│   ├── vite.config.js                       # Vite + proxy to localhost:9090
│   ├── tailwind.config.js                   # Custom tokens, dark mode, animations
│   ├── postcss.config.js
│   └── package.json
│
└── 📁 careersync-backend/                   # Spring Boot REST API
    ├── 📁 src/main/java/com/careersync/
    │   ├── CareerSyncApplication.java        # @SpringBootApplication entry point
    │   ├── 📁 ai/
    │   │   └── GeminiAiService.java          # Gemini API caller + prompt builder + JSON parser
    │   ├── 📁 config/
    │   │   ├── AppConfig.java                # ModelMapper, BCryptPasswordEncoder beans
    │   │   ├── SecurityConfig.java           # JWT filter chain, CORS, endpoint permissions
    │   │   └── SwaggerConfig.java            # OpenAPI 3 + Bearer auth scheme
    │   ├── 📁 controller/
    │   │   ├── AuthController.java           # POST /auth/register, login, GET /auth/me
    │   │   ├── ResumeController.java         # POST upload, analyze, GET all/latest/{id}
    │   │   ├── JdMatcherController.java      # POST /jd/match
    │   │   ├── CoverLetterController.java    # POST /cover-letter/generate
    │   │   ├── SkillGapController.java       # POST /skill-gap/analyze, GET all/latest
    │   │   ├── InterviewController.java      # POST generate/feedback, GET all/{id}
    │   │   ├── CareerRoadmapController.java  # POST /roadmap/generate, GET all/latest
    │   │   ├── JobTrackerController.java     # Full CRUD /jobs + GET /jobs/stats
    │   │   ├── ChatbotController.java        # POST /chat/send, GET sessions/{id}
    │   │   └── DashboardController.java      # GET /dashboard/stats
    │   ├── 📁 dto/
    │   │   ├── 📁 request/
    │   │   │   ├── AuthRequest.java          # Register + Login inner classes
    │   │   │   ├── JobApplicationRequest.java# Create + Update inner classes
    │   │   │   └── AiRequest.java            # JdMatch, CoverLetter, SkillGap, MockInterview,
    │   │   │                                 # InterviewFeedback, CareerRoadmap, ChatMessage
    │   │   └── 📁 response/
    │   │       ├── ApiResponse.java          # Standard { success, message, data, timestamp }
    │   │       ├── AuthResponse.java         # Token + UserResponse
    │   │       ├── ResumeResponse.java       # Resume DTO
    │   │       ├── JobApplicationResponse.java
    │   │       └── AiResponse.java           # JdMatchResult, CoverLetterResult, SkillGapResult,
    │   │                                     # InterviewSession, Feedback, CareerRoadmap, Chat, Stats
    │   ├── 📁 entity/
    │   │   ├── User.java                     # id, name, email, password, role, createdAt
    │   │   ├── Resume.java                   # resumeUrl, extractedText, atsScore, skills, status
    │   │   ├── JobApplication.java           # company, role, status (8 states), dates, notes
    │   │   ├── SkillAnalysis.java            # targetRole, missingSkills, recommendations
    │   │   ├── CareerRoadmap.java            # targetRole, milestones, technologies, timeline
    │   │   ├── InterviewSession.java         # category, questions, answers, feedback, score
    │   │   └── ChatHistory.java              # title, messages (JSON), sessionContext
    │   ├── 📁 exception/
    │   │   ├── GlobalExceptionHandler.java   # @RestControllerAdvice — catches all exceptions
    │   │   ├── ResourceNotFoundException.java# 404 responses
    │   │   ├── BadRequestException.java      # 400 responses
    │   │   ├── DuplicateResourceException.java# 409 responses
    │   │   └── AiServiceException.java       # 503 when Gemini fails
    │   ├── 📁 repository/
    │   │   ├── UserRepository.java
    │   │   ├── ResumeRepository.java
    │   │   ├── JobApplicationRepository.java
    │   │   ├── SkillAnalysisRepository.java
    │   │   ├── CareerRoadmapRepository.java
    │   │   ├── InterviewSessionRepository.java
    │   │   └── ChatHistoryRepository.java
    │   ├── 📁 security/
    │   │   ├── 📁 jwt/
    │   │   │   ├── JwtUtils.java             # Generate, validate, extract claims from JWT
    │   │   │   ├── JwtAuthenticationFilter.java # OncePerRequestFilter — sets SecurityContext
    │   │   │   └── JwtAuthEntryPoint.java    # Returns 401 JSON on unauthorized
    │   │   └── 📁 service/
    │   │       └── UserDetailsServiceImpl.java # Loads user by email from DB
    │   ├── 📁 service/
    │   │   ├── AuthService.java + impl/
    │   │   ├── ResumeService.java + impl/
    │   │   ├── JdMatcherService.java + impl/
    │   │   ├── CoverLetterService.java + impl/
    │   │   ├── SkillGapService.java + impl/
    │   │   ├── InterviewService.java + impl/
    │   │   ├── CareerRoadmapService.java + impl/
    │   │   ├── JobTrackerService.java + impl/
    │   │   └── ChatbotService.java + impl/
    │   ├── 📁 mapper/
    │   │   └── EntityMapper.java             # ModelMapper configuration + custom mappings
    │   └── 📁 utils/
    │       ├── FileStorageUtils.java         # UUID filename, type validation, disk save
    │       ├── PdfExtractorUtils.java        # PDFBox text extraction pipeline
    │       └── SecurityUtils.java            # getCurrentUser() from SecurityContext
    ├── 📁 src/main/resources/
    │   ├── application.properties            # DB, JWT, Gemini, CORS, upload config
    │   └── 📁 uploads/                       # Uploaded PDF storage directory
    ├── .env.example                          # Backend env vars template
    ├── .gitignore
    └── pom.xml                               # All Maven dependencies
```

---

## 🗄️ Database Design

### Entity Relationship Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                           USERS                               │
│  id | name | email (UNIQUE) | password (BCrypt) | role       │
│  currentRole | targetRole | yearsExperience | createdAt      │
└──────────────────────┬───────────────────────────────────────┘
                        │ 1
          ┌─────────────┼─────────────────────────┐
          │             │             │            │
          │ N           │ N           │ N          │ N
┌─────────▼──┐  ┌───────▼───┐  ┌────▼──────┐  ┌─▼──────────────┐
│  RESUMES   │  │    JOB    │  │  SKILL    │  │    CAREER      │
│            │  │APPLICATIONS│  │ ANALYSES  │  │   ROADMAPS     │
│ resumeUrl  │  │ company   │  │ targetRole│  │ targetRole     │
│ extractedText│ │ role      │  │ missing   │  │ milestones     │
│ atsScore   │  │ status    │  │ Skills    │  │ technologies   │
│ skills     │  │ appliedDate│  │ recommend-│  │ timeline       │
│ strengths  │  │ notes     │  │ ations    │  │ projects       │
│ weaknesses │  │ jobUrl    │  │ resources │  │ createdAt      │
│ suggestions│  │ salaryRange│  │ createdAt │  └────────────────┘
│ status     │  │ createdAt │  └───────────┘
│ createdAt  │  └───────────┘        │ N
└────────────┘                ┌──────▼──────────┐  ┌──────────────┐
                               │   INTERVIEW     │  │   CHAT       │
                               │   SESSIONS      │  │  HISTORIES   │
                               │ category (7)    │  │ title        │
                               │ difficulty (3)  │  │ messages     │
                               │ questions       │  │ (JSON array) │
                               │ answers         │  │ updatedAt    │
                               │ feedback        │  └──────────────┘
                               │ overallScore    │
                               └─────────────────┘
```

### Application Status State Machine

```
WISHLIST → APPLIED → PHONE_SCREEN → INTERVIEW → OFFER → ACCEPTED
                                               ↘
                              REJECTED ← ─────────────────────────
                              WITHDRAWN ←─────────────────────────
```

### Interview Categories

| Category | Description |
|---|---|
| HR | Behavioral, culture fit, situational questions |
| DSA | Data structures, algorithms, complexity analysis |
| BACKEND | APIs, databases, system internals |
| FRONTEND | React, CSS, browser APIs, performance |
| SYSTEM_DESIGN | Architecture, scalability, distributed systems |
| BEHAVIORAL | STAR method, leadership, conflict resolution |
| MIXED | Random mix across all categories |

---

## 🌊 Complete Workflow

### User Journey

```
1. DISCOVER
   └── Visits landing page at http://localhost:5173
   └── Reads features, stats, and CTA sections

2. REGISTER / LOGIN
   └── Creates account (name, email, password)
   └── JWT token issued → stored in localStorage
   └── Redirected to /dashboard

3. UPLOAD & ANALYZE RESUME
   └── Goes to /resume
   └── Drags and drops PDF or clicks to browse
   └── PDFBox extracts text from PDF
   └── Clicks Analyze → Gemini AI returns:
       • ATS Score (0-100)
       • Detected skills list
       • Strengths + Weaknesses
       • Improvement suggestions

4. MATCH JOB DESCRIPTIONS
   └── Goes to /jd-matcher
   └── Pastes job description
   └── Gemini compares resume text vs JD
   └── Gets match %, matched keywords (green), missing keywords (red)

5. GENERATE COVER LETTERS
   └── Goes to /cover-letter
   └── Enters company, role, experience summary
   └── Gemini writes professional cover letter
   └── Copies to clipboard or downloads as .txt

6. ANALYZE SKILL GAPS
   └── Goes to /skill-gap
   └── Enters target role + current skills
   └── Gets missing skills, recommendations, learning resources, project ideas

7. PRACTICE INTERVIEWS
   └── Goes to /interview
   └── Selects category + difficulty + question count
   └── Gets AI-generated questions
   └── Types answers in expandable cards
   └── Submits → gets per-question scores + overall feedback

8. BUILD CAREER ROADMAP
   └── Goes to /roadmap
   └── Enters current role, target role, experience
   └── Gets phase-by-phase milestone plan with timeline

9. TRACK APPLICATIONS
   └── Goes to /job-tracker
   └── Adds every application (company, role, status, notes, salary)
   └── Updates statuses as pipeline progresses
   └── Views dashboard charts for pipeline overview

10. CHAT WITH AI ADVISOR
    └── Goes to /chatbot
    └── Asks any career question
    └── Multi-session history preserved
    └── AI gives context-aware career guidance
```

### AI Processing Pipeline

```
User Input (text/PDF)
       │
       ▼
Service Layer (build structured prompt)
       │
       ▼
GeminiAiService.generate(prompt)
       │
       ▼ HTTP POST to generativelanguage.googleapis.com
Google Gemini 1.5 Flash API
       │
       ▼ Raw response (may include markdown fences)
stripMarkdownFences(response)
       │
       ▼
JSON.parse → build entity → save to MySQL
       │
       ▼
Return DTO to controller → ApiResponse<T> to frontend
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+
- Gemini API key — [get one free here](https://makersuite.google.com/app/apikey)

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/careersync-ai.git
cd careersync-ai
```

### 2. Set Up the Database

```sql
CREATE DATABASE careersync_db;
```

### 3. Configure Backend

```bash
cd careersync-backend
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=careersync_db
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your-minimum-256-bit-secret-key-change-this
JWT_EXPIRATION=86400000
GEMINI_API_KEY=your-gemini-api-key-here
UPLOAD_DIR=uploads
CORS_ORIGINS=http://localhost:5173
```

### 4. Run the Backend

```bash
cd careersync-backend
./mvnw spring-boot:run
```

✅ Backend starts at **http://localhost:9090/api**
✅ Swagger UI at **http://localhost:9090/api/swagger-ui.html**
✅ Spring auto-creates all 7 MySQL tables on first run

### 5. Configure Frontend

```bash
cd careersync-frontend
cp .env.example .env.local
```

Edit `.env.local` — leave `VITE_API_BASE_URL` **empty** (Vite proxy handles routing):
```env
VITE_API_BASE_URL=
```

### 6. Run the Frontend

```bash
cd careersync-frontend
npm install
npm run dev
```

✅ Frontend starts at **http://localhost:5173**
✅ All `/api/*` requests proxy to `localhost:9090` via Vite dev server

### 7. Verify Everything Works

```bash
# Test backend is reachable
curl http://localhost:9090/api/auth/register \
  -X POST -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'

# Expected response:
# { "success": true, "data": { "token": "eyJ..." } }
```

Open **http://localhost:5173** → Register → You're in! 🎉

---

## 🌍 Deployment Guide

### Backend → Render

1. Push to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Build Command: `./mvnw clean package -DskipTests`
4. Start Command: `java -jar target/careersync-backend-1.0.0.jar`
5. Add environment variables:

```env
DB_HOST=your-db-host
DB_PORT=3306
DB_NAME=careersync_db
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-strong-secret-key
JWT_EXPIRATION=86400000
GEMINI_API_KEY=your-gemini-api-key
UPLOAD_DIR=uploads
CORS_ORIGINS=https://your-frontend.vercel.app
```

### Frontend → Vercel

1. Push to GitHub
2. Import repository on [vercel.com](https://vercel.com)
3. Set root directory to `careersync-frontend/`
4. Add environment variable:
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```
5. Deploy ✅

> ⚠️ In production, `VITE_API_BASE_URL` must be the full backend URL since Vite proxy is dev-only.

### Database — Free Options

| Provider | Type | Free Tier |
|---|---|---|
| [PlanetScale](https://planetscale.com) | MySQL | 5 GB storage |
| [Railway](https://railway.app) | MySQL / PostgreSQL | $5 credit/month |
| [Supabase](https://supabase.com) | PostgreSQL | 500 MB |
| [Neon](https://neon.tech) | PostgreSQL | 512 MB |

### Update CORS After Deployment

In `application.properties`:
```properties
app.cors.allowed-origins=https://your-frontend.vercel.app
```

---

## 🔐 Security Implementation

### JWT Authentication Flow

```
1. POST /auth/login → AuthenticationManager.authenticate()
2. BCryptPasswordEncoder.matches() verifies hashed password
3. JwtUtils.generateToken() → signs with HMAC-SHA256
4. Token returned → client stores in localStorage
5. Axios interceptor attaches "Authorization: Bearer <token>" to every request
6. JwtAuthenticationFilter extracts + validates token
7. Sets SecurityContextHolder → downstream code calls SecurityUtils.getCurrentUser()
```

### Security Checklist

| Layer | Protection |
|---|---|
| Passwords | BCrypt with strength 12 — ~250ms hash, brute-force resistant |
| JWT Secret | Externalized to env variable, minimum 256 bits |
| File Uploads | PDF-only validation, 10MB limit, UUID filenames (no path traversal) |
| Endpoints | All except `/auth/**` require valid JWT |
| CORS | Explicit allowlist — no wildcard `*` |
| SQL Injection | Impossible — JPA/Hibernate parameterized queries only |
| XSS | React escapes all JSX output by default |

---

## 📡 API Endpoints Reference

All endpoints return:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { },
  "timestamp": "2026-01-01T10:30:00"
}
```

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login → returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user profile |
| PUT | `/api/auth/profile` | ✅ | Update profile info |
| POST | `/api/resume/upload` | ✅ | Upload PDF resume |
| POST | `/api/resume/{id}/analyze` | ✅ | AI analyze uploaded resume |
| GET | `/api/resume/all` | ✅ | List all user resumes |
| GET | `/api/resume/latest` | ✅ | Get most recent resume |
| DELETE | `/api/resume/{id}` | ✅ | Delete a resume |
| POST | `/api/jd/match` | ✅ | Match resume against JD |
| POST | `/api/cover-letter/generate` | ✅ | Generate cover letter |
| POST | `/api/skill-gap/analyze` | ✅ | Analyze skill gap |
| GET | `/api/skill-gap/all` | ✅ | List all skill analyses |
| POST | `/api/interview/generate` | ✅ | Generate interview questions |
| POST | `/api/interview/feedback` | ✅ | Submit answers → get AI feedback |
| GET | `/api/interview/all` | ✅ | List all interview sessions |
| POST | `/api/roadmap/generate` | ✅ | Generate career roadmap |
| GET | `/api/roadmap/all` | ✅ | List all roadmaps |
| GET | `/api/roadmap/latest` | ✅ | Get most recent roadmap |
| GET | `/api/jobs/all` | ✅ | List all job applications |
| POST | `/api/jobs/create` | ✅ | Add new application |
| PUT | `/api/jobs/{id}` | ✅ | Update application |
| DELETE | `/api/jobs/{id}` | ✅ | Delete application |
| GET | `/api/jobs/stats` | ✅ | Job tracker analytics |
| GET | `/api/dashboard/stats` | ✅ | Dashboard statistics |
| POST | `/api/chat/send` | ✅ | Send message to AI chatbot |
| GET | `/api/chat/sessions` | ✅ | List all chat sessions |
| GET | `/api/chat/session/{id}` | ✅ | Get full session history |
| DELETE | `/api/chat/session/{id}` | ✅ | Delete a chat session |

> 📘 Full interactive documentation: **http://localhost:9090/api/swagger-ui.html**

---

## 🚧 Future Improvements

### High Priority

| Feature | Description | Effort |
|---|---|---|
| 🔗 **LinkedIn Import** | Pull profile data directly instead of manual entry | Medium |
| 📧 **Email Notifications** | Job application deadline reminders, interview prep tips | Medium |
| 🏪 **Resume Templates** | Beautiful ATS-friendly resume builder with export | High |
| 📱 **Mobile App** | React Native version for on-the-go career management | High |

### Medium Priority

| Feature | Description | Effort |
|---|---|---|
| 🔑 **Google OAuth** | One-click sign-in via Google account | Medium |
| 📊 **Advanced Analytics** | Weekly career progress reports + trend charts | Medium |
| 🌍 **Multi-language** | Hindi, Spanish, French support | Medium |
| 🤝 **Interview Scheduler** | Calendar integration for interview tracking | High |
| 🏆 **Leaderboard** | Gamified ATS score improvements | Low |

### Low Priority

| Feature | Description | Effort |
|---|---|---|
| 🎙️ **Voice Interview** | Speak answers, AI transcribes + evaluates | High |
| 📄 **PDF Resume Export** | Export profile as professionally formatted PDF | Medium |
| 🔔 **Job Alerts** | Email notifications for matching job postings | Medium |
| 💳 **Premium Tier** | Unlimited AI analyses, priority processing | High |

---

## ✅ Dos and Don'ts

### ✅ DOs

- **DO** leave `VITE_API_BASE_URL` empty in development — the Vite proxy handles routing
- **DO** change the JWT secret to a strong 256-bit key before deploying to production
- **DO** get your Gemini API key from [makersuite.google.com](https://makersuite.google.com/app/apikey) — it's free
- **DO** use `spring.jpa.hibernate.ddl-auto=update` in development (auto-creates tables)
- **DO** test via Swagger UI (`/api/swagger-ui.html`) before testing the frontend
- **DO** check backend terminal logs when AI features don't return results
- **DO** use HTTPS for both frontend and backend in production
- **DO** set CORS to your exact frontend URL in production, not `*`

### ❌ DON'Ts

- **DON'T** set `VITE_API_BASE_URL=http://localhost:9090` in development — causes CORS errors
- **DON'T** commit `.env` or `.env.local` files to Git
- **DON'T** hardcode the JWT secret or Gemini API key in source code
- **DON'T** use `ddl-auto=create` in production — it drops and recreates all tables
- **DON'T** upload non-PDF files — the backend validates MIME type and rejects them
- **DON'T** skip restarting Vite after changing `vite.config.js` or `.env.local`
- **DON'T** share your Gemini API key — it has usage quotas and billing implications

---

## 📞 Contact & Support

### Developer

**Achyut Tripathi**
- 💼 Full Stack Developer — Java, Spring Boot, React
- 🐙 GitHub: [@achyut](https://github.com/achyut)
- 💼 LinkedIn: [linkedin.com/in/achyut-tripathi](https://linkedin.com/in/achyut-tripathi)

### Troubleshooting Quick Reference

| Error | Cause | Fix |
|---|---|---|
| `ERR_CONNECTION_REFUSED` on port 9090 | Backend not started | Run `./mvnw spring-boot:run` |
| CORS error in browser console | `VITE_API_BASE_URL` set to full URL | Set it to empty in `.env.local` |
| 401 Unauthorized | JWT expired or missing | Log out and log back in |
| 500 on `/auth/register` | MySQL not running or wrong password | Check `.env` DB credentials |
| Resume analysis hangs | Invalid Gemini API key | Check backend logs for `401 from Gemini` |
| Charts empty on dashboard | No job applications added | Add one application in Job Tracker |
| `Cannot read properties of null` | AI returned null fields | Already fixed in `helpers.js` `splitLines()` |

---

## 📄 License

```
MIT License — Copyright (c) 2026 Achyut Tripathi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

---

<div align="center">

**Built with ❤️ by Achyut Tripathi**

*If CareerSync AI helped you land your dream job, give it a ⭐ on GitHub!*

[⬆ Back to Top](#-careersync-ai--land-your-dream-job-with-ai-precision)

</div>
