# 📊 Data Visualization Dashboard

An interactive full-stack data visualization tool built with:

- ⚛️ **Frontend**: Next.js  
- 🚀 **Backend**: FastAPI (Python)  
- 🗂️ Upload CSV files, customize chart types, plot titles, axis, colors, DPI, and export graphs (frontend or backend).

---

## 🔧 Project Structure

Abijit_barplot/
├── backend/ ← FastAPI server (CSV parsing + Matplotlib)
├── frontend/ ← Next.js app (UI & Plotly rendering)
└── .gitignore


---

## ✅ Features

- Upload `.csv` dataset
- Select **multiple X and Y axes**
- Customize:
  - Title
  - X and Y labels
  - Y-axis colors
  - Export format: PNG, JPEG, SVG, WebP
  - DPI for high-quality image export
- Two visualization modes:
  - 🎨 **Frontend Plot** (Plotly.js – interactive)
  - 🖼 **Backend Plot** (Matplotlib – static export)

---

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


