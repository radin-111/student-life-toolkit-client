# 🌐 Live Site – Student Dashboard & AI Learning Platform

**Live Site:** [https://happylearn-607c7.web.app/](https://happylearn-607c7.web.app/)

A modern **student productivity and AI learning platform**. Manage classes, tasks, and budget while leveraging AI-powered tools to summarize text, generate Q&A, and interact via a chatbot. Fully responsive, secure, and interactive.

---

## 🛠 Features

### Dashboard & Statistics

- Overview cards: **Total Budget Entries**, **Classes**, **Tasks**, **Income vs Expense**
- **Pie Chart:** Income vs Expense
- **Bar Chart:** Expense by category
- **Class list:** All classes for the logged-in student

### Study Planner

- CRUD operations for tasks: `todo`, `inprogress`, `done`
- Weekly progress overview
- Track deadlines, priorities, and durations

### Budget Tracker

- Add, update, delete **budget entries**
- Categorize as **Income** or **Expense**
- Visualize totals and category-wise breakdown
- Helps students **track their finances** efficiently

### Classes Management

- Add, edit, delete classes
- View class title, subject, and time
- User-specific data

---

## 🤖 AI TOOLS

A set of **AI-powered learning utilities** to help students study efficiently:

### Chatbot

- Interact with an AI assistant for learning queries in real-time.

### Summarizer

- Condense long notes or text into concise summaries for quick review.

### Q&A Generator & Exam Simulation

- Generate practice questions, answers, and randomized exams from text or PDFs.

_All AI tools are powered via Deepseek and Qwen APIs and fully integrated into the dashboard._

---

## ⚡ Tech Stack

- **Frontend:** React, Tailwind CSS, TanStack Query, Axios, Recharts, React Icons
- **Backend:** Node.js, Express.js, MongoDB, Firebase Admin SDK
- **AI:** OpenAI / LLM integration for chatbot, summarizer, and Q&A generator
- **Tools:** dotenv, CORS, JWT authentication, Firebase Auth
