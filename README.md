# Resonance — AI Resume Analyzer & Interview Prep

A full-stack app that analyzes a resume with a Generative AI + RAG pipeline and
returns an ATS score, skills, strengths, weaknesses, skill gaps against a target
role, tailored interview questions, and on-demand model answers per question.

## Features

- **Progressive streaming analysis** — results appear section by section as each
  parallel LLM call completes (no waiting for the full response)
- **ATS score** — 0-100 estimate of how well the resume would survive an
  applicant tracking system
- **Skills extraction** — every technology and competency found on the resume
- **Strengths & weaknesses** — honest, specific feedback
- **Skill gap analysis** — RAG-grounded comparison against real role expectations
- **Interview questions** — 8 tailored questions (technical / behavioral /
  system-design), generated on demand
- **Per-question model answers** — click any question to generate a contextual
  model answer; answers are cached in state and persisted to MongoDB
- **Analysis history** — all past analyses saved, viewable and deletable from
  the dashboard sidebar
- **Google OAuth** — sign in with Google; backend issues its own JWT

## Tech stack

**Frontend:** React (Vite), Tailwind CSS, Framer Motion, React Router v6,
`@react-oauth/google`, Recharts, Axios

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT,
Google OAuth (`google-auth-library`), Multer + `pdf-parse` / `mammoth`

**AI layer:** LangChain, Google Gemini (`gemini-2.5-flash` for chat,
`gemini-embedding-001` for embeddings) or OpenAI (swap via `.env`),
LangChain `MemoryVectorStore` for RAG over a role-knowledge base

## How the analysis pipeline works

```
Frontend (Vite/React)
   │  1. upload resume + target role (multipart/form-data, JWT in header)
   ▼
Express backend
   │  2. extract text (pdf-parse / mammoth)
   ▼
analysisGraph.js — parallel LLM calls over SSE
   │  a. retrieve   → similarity search over role-knowledge vector store (RAG)
   │  b. 4 parallel LLM calls (summary, skills, strengths+weaknesses, skillGaps)
   │     each emits an SSE event as soon as it finishes
   ▼
Frontend receives SSE stream → renders each section as it arrives
   ▼
MongoDB (Analysis collection) ← full result persisted after all sections done
   ▼
On demand:
   │  • "Generate questions" button  → POST /api/resume/:id/questions
   │  • Click a question             → POST /api/resume/:id/answer
   │    (answer cached in state + persisted to MongoDB)
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/google` | Verify Google ID token, issue JWT |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/resume/analyze` | SSE stream — analyze resume |
| GET | `/api/resume/history` | List user's past analyses |
| GET | `/api/resume/:id` | Get single analysis |
| DELETE | `/api/resume/:id` | Delete analysis |
| POST | `/api/resume/:id/questions` | Generate 8 interview questions |
| POST | `/api/resume/:id/answer` | Generate model answer for one question |

## Project structure

```
resume-analyzer-ai/
├── backend/
│   ├── config/
│   │   ├── db.js               # Mongoose connection
│   │   └── googleClient.js     # Google ID token verifier
│   ├── controllers/
│   │   ├── authController.js   # googleLogin, getMe
│   │   └── resumeController.js # analyzeResume (SSE), generateQuestions,
│   │                           #   generateAnswer, deleteAnalysis, getHistory
│   ├── middleware/
│   │   ├── auth.js             # JWT protect guard
│   │   └── upload.js           # multer (PDF/DOCX, 5 MB)
│   ├── models/
│   │   ├── User.js             # googleId, name, email, avatar
│   │   └── Analysis.js         # fileName, targetRole, resumeText, result
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── resumeRoutes.js
│   ├── services/
│   │   ├── analysisGraph.js    # parallel LLM calls + SSE streaming
│   │   ├── modelProvider.js    # cached Gemini / OpenAI instances
│   │   ├── resumeParser.js     # pdf-parse + mammoth
│   │   ├── knowledgeBase.js    # role-expectations corpus
│   │   └── vectorStore.js      # MemoryVectorStore + retrieval
│   ├── utils/
│   │   └── prompts.js          # all system + user prompts
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Hero.jsx
        │   ├── Features.jsx
        │   ├── HowItWorks.jsx
        │   ├── Footer.jsx
        │   ├── UploadCard.jsx
        │   ├── ResultsDashboard.jsx  # streaming sections + answer accordion
        │   ├── HistoryStrip.jsx      # collapsible sidebar history list
        │   ├── LoadingScanner.jsx
        │   ├── ProtectedRoute.jsx
        │   └── DocumentScanArt.jsx
        ├── context/
        │   └── AuthContext.jsx   # Google login + JWT state
        ├── pages/
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   └── Dashboard.jsx     # 2-column layout (sidebar + results panel)
        └── utils/
            └── api.js            # axios instance with JWT interceptor
```

## Setup

### 1. Google OAuth credentials

Create an OAuth 2.0 Client ID at the
[Google Cloud Console](https://console.cloud.google.com/apis/credentials)
(Application type: Web application).

- **Authorized JavaScript origins:** `http://localhost:5173`
- **Authorized redirect URIs:** `http://localhost:5173`

### 2. Backend

```bash
cd backend
npm install
npm run dev        
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev        
```


## Notes for interviewers / reviewers

- **Auth:** frontend gets a Google ID token via `@react-oauth/google`, backend
  verifies it server-side with `google-auth-library`, then issues its own
  short-lived JWT — the frontend never trusts the Google token alone.

- **Streaming:** `/api/resume/analyze` uses Server-Sent Events (SSE). The
  backend fires 4 LLM calls in parallel via `Promise.all`; each emits its own
  SSE event the moment it resolves. The frontend reads the `ReadableStream`
  directly with `fetch` + `getReader()` and updates React state incrementally.

- **RAG:** `knowledgeBase.js` + `vectorStore.js` embed a curated
  role-expectations corpus into a LangChain `MemoryVectorStore`. Swap in
  Chroma/Pinecone by changing one file — callers are unaffected.

- **On-demand answers:** clicking a question calls `POST /api/resume/:id/answer`
  which runs a focused LLM call with the question + resume context. The answer
  is persisted to MongoDB so it survives page reloads and appears when loading
  from history.

- **Model provider:** Gemini vs OpenAI is chosen entirely via `AI_PROVIDER` in
  `.env`. Model instances are cached (singleton) to avoid re-initialisation on
  every request — see `modelProvider.js`.

- **Dashboard layout:** two-column on desktop (sticky upload sidebar + scrollable
  results panel), single-column stack on mobile.
