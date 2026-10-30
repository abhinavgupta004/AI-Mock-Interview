# 🎤 InterviewAI — AI Mock Interview Platform

A full-featured AI-powered mock interview platform built with React and the groq API key.

---

## ✨ Features

- 🔐 **Authentication** — Sign up / Sign in / Guest mode (localStorage)
- 🏠 **Dashboard** — Stats, avg score, best score, recent sessions
- 🎤 **Interview Room** — 8 roles × 5 levels, 5 AI-generated questions per session
- 🎙️ **Voice Input** — Speak your answers (Chrome/Edge)
- 📊 **Detailed Feedback** — Score ring, 4 category bars, strengths & tips
- 📋 **Session History** — All past sessions with full feedback
- 📈 **Analytics** — Score trends, skill breakdown, performance by role

---

## 🚀 How to Run in VS Code

### Step 1 — Install Node.js
Download and install from: https://nodejs.org  
Choose the **LTS version** (e.g. 18.x or 20.x)

Verify installation:
```bash
node -v
npm -v
```

### Step 2 — Open the project in VS Code
1. Download All  files from a folder (e.g. `interviewai`)
2. Open VS Code
3. Go to **File → Open Folder** → select the `interviewai` folder

### Step 3 — Get your Groq API Key
1. Go to https://console.groq.com → **API Keys** → **Create API Key**
2. Copy the key (starts with `gsk_...`)

### Step 4 — Add your API Key (server-side, safe)
Project folder mein `.env` file hai. Usme key paste karo:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
```
`.env` git mein commit nahi hoti (`.gitignore` mein hai). Key browser mein kabhi expose nahi hoti —
saari calls `/api/chat` proxy (`api/chat.js`) se jaati hain.

### Step 5 — Install dependencies
```bash
npm install
```

### Step 6 — Start the app
```bash
npm start
```
App **http://localhost:3000** par khulega. `.env` change karo to `npm start` dobara chalao.

### Deploy on Vercel
1. Repo Vercel se connect karo (Root Directory = jis folder mein `package.json` hai).
2. Settings → Environment Variables → `GROQ_API_KEY` add karo (Production + Preview).
3. Redeploy karo (env var badalne ke baad redeploy zaroori hai).

> Model default: `openai/gpt-oss-120b`. Badalna ho to `GROQ_MODEL` env var set karo.

---

## 📁 Project Structure

```
interviewai/
├── public/
│   └── index.html          # HTML entry point
├── src/
│   ├── components/
│   │   ├── Bubble.jsx       # Chat message bubble
│   │   ├── FeedbackPanel.jsx # Score + feedback display
│   │   ├── ScoreRing.jsx    # Animated SVG score ring
│   │   ├── Sidebar.jsx      # Left navigation sidebar
│   │   ├── Toast.jsx        # Notification toast
│   │   └── Waveform.jsx     # AI speaking animation
│   ├── pages/
│   │   ├── Analytics.jsx    # Analytics & stats page
│   │   ├── Auth.jsx         # Login & signup screen
│   │   ├── Dashboard.jsx    # Home dashboard
│   │   ├── History.jsx      # Session history
│   │   ├── InterviewRoom.jsx # Live interview chat
│   │   └── InterviewSetup.jsx # Role & level selection
│   ├── utils/
│   │   ├── claude.js        # Anthropic API helper
│   │   └── storage.js       # localStorage helper
│   ├── App.jsx              # Root component + routing
│   ├── constants.js         # Roles, levels, API key
│   └── index.js             # React entry point
├── package.json
└── README.md
```

---

## 🛠️ Available Roles

| Role | Focus Areas |
|------|-------------|
| ⚙️ Software Engineer | DSA, System Design, OOP |
| 📊 Data Analyst | SQL, Statistics, Visualization |
| 🗂️ Product Manager | Strategy, Metrics, Roadmap |
| 🤖 ML Engineer | ML, Deep Learning, Python |
| 🔧 DevOps Engineer | CI/CD, Docker, Cloud |
| 🎨 Frontend Dev | React, CSS, Performance |
| 🛠️ Backend Dev | APIs, Databases, Scalability |
| 🌐 Full Stack Dev | React, Node, Architecture |

---

## 🎙️ Voice Input
Voice input uses the browser's Web Speech API.  
**Works in:** Google Chrome, Microsoft Edge  
**Does NOT work in:** Firefox, Safari

---

## 🔒 Data & Privacy
All data (user accounts, session history) is stored **locally in your browser**.  
Nothing is sent to any server except the interview content sent to the Anthropic API.

---

## 🏗️ Build for Production

To create a production build:
```bash
npm run build
```
This creates a `build/` folder you can deploy to Vercel, Netlify, or GitHub Pages.

---



## 📝 Tech Stack

- **React 18** — UI framework
- **Claude Sonnet** (Anthropic) — AI interview questions & feedback
- **Web Speech API** — Voice input
- **localStorage** — Data persistence
- **CSS-in-JS** — Inline styles + global CSS



