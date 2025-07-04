# 📊 Data Visualization Dashboard

An interactive full-stack data visualization tool built with:

- ⚛️ **Frontend**: Next.js  
- 🚀 **Backend**: FastAPI (Python)  

---

## 🔧 Project Structure

Abijit_barplot/

├── backend/ ← FastAPI server (CSV parsing + Matplotlib)

├── frontend/ ← Next.js app (UI & Plotly rendering)

└── .gitignore


## 🚀 Getting Started

### 🧠 Requirements

- Python 3.9+
- Node.js 16+
- Git

---

### ▶️ Run Backend (FastAPI)

1. Open terminal in `/backend/`
2. Install dependencies:

```bash
pip install -r requirements.txt
```
Start server:
Open terminal in /backend/
bash
```
uvicorn main:app --reload
```
API: http://localhost:8000

Docs: http://localhost:8000/docs


Run Frontend (Next.js)
Open terminal in /frontend/

Install packages:

bash
```
npm install
```
Start dev server:

bash
```
npm run dev
```
Frontend: http://localhost:3000


