# Manish Kumar — Dynamic Full-Stack Portfolio

A modern, high-performance developer portfolio built with **FastAPI** (Python 3.12) and **TypeScript (React + Vite)**. Includes an interactive developer CLI terminal, dynamic project filters with research deep-dive modals, live contact submission, embedded PDF resume viewer, and a full-featured **Admin Studio** for live content management.

---

## ⚡ Tech Stack

- **Backend**: Python FastAPI, Pydantic, Uvicorn, Python-Multipart.
- **Frontend**: TypeScript, React 19, Vite, Tailwind CSS v4, Lucide Icons, Canvas-Confetti.
- **Database / Store**: File-based dynamic JSON store with schema validation (`portfolio_data.json`, `messages.json`).

---

## 🚀 Quick Start (Local Development)

### 1. Start the FastAPI Backend
```bash
cd backend
python3 -m pip install -r requirements.txt
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Health Check: `http://127.0.0.1:8000/health`
- Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

### 2. Start the TypeScript Frontend
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://127.0.0.1:5173`

---

## 🛠️ Key Features

### 🌟 1. Public Dynamic Portfolio
- **Hero & Live Stats**: Dynamic metrics for engineered projects, IIT Mandi CGPA, hackathon wins, and Git contributions.
- **About & Pedigree**: Academic background at IIT Mandi and Generative AI experience at Zangoh.
- **Research & Engineered Projects**:
  - Filterable by categories (AI / Medical, Computer Vision, Geospatial, Generative AI).
  - Deep-dive architecture and metric comparison modals (e.g. ViG-UNet, Med-NCA Dice score 0.84 benchmark).
- **Interactive Skills Matrix**: Categorized proficiency sliders and technology tags.
- **Work Experience & Leadership Timeline**: Interactive timeline with tech stack badges.
- **Developer CLI Terminal**: Interactive terminal supporting `help`, `projects`, `skills`, `whoami`, `cat resume`, and `sudo hire`.
- **Live Contact Form**: Client-side validation with real-time FastAPI ingestion, celebration confetti, and database logging.
- **Resume Modal & Direct Download**: In-browser PDF previewer and direct one-click download.

### 🔐 2. Portfolio Admin Studio
- **Access**: Click the **Admin** button in the navbar or press `Ctrl + Shift + A`.
- **Authentication**: Enter security PIN (`admin123` by default).
- **Tabs & Capabilities**:
  1. **Profile & Stats**: Edit full name, role headline, tagline, bio, contact details, and live stats.
  2. **Projects Manager**: Create, edit, tag, or delete projects with live updates.
  3. **Skills Matrix**: Add new skills, adjust proficiency percentage sliders, and manage categories.
  4. **Experience & Education**: Update positions, achievements, and coursework.
  5. **Messages Inbox**: Review and delete contact form inquiries received from clients and recruiters.
  6. **Resume PDF Replacement**: Upload a replacement PDF directly to update the downloadable resume across the site.
