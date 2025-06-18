# 📊 Data Visualization Dashboard

An interactive full-stack data visualization tool built with:

- ⚛️ **Frontend**: Next.js   
- 🚀 **Backend**: FastAPI (Python)  
- 🗂 Upload CSV files, customize plot titles, axis, colors, and export graphs.

---

## 🔧 Project Structure

my-next-app/
├── backend/ ← FastAPI server (CSV parsing API)
├── frontend/ ← Next.js app (UI & chart rendering)
└── .gitignore


---

## 🚀 Getting Started

### 🧠 Requirements

- Python 3.9+  
- Node.js 16+  
- Git

---

### ▶️ Run Backend (FastAPI)

1. Open terminal in `/backend/`
2. Install dependencies
```bash
uvicorn main:app --reload
```
Server runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

▶️ Run Frontend (Next.js)
Open terminal in /frontend/

Install packages:

```bash
npm install
```
Start dev server:

```bash
npm run dev
```
App runs at: http://localhost:3000

