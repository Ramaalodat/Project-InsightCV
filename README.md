# 🚀 InsightCV - AI-Powered Career & Recruitment Platform

<div align="center">

![InsightCV Banner](https://img.shields.io/badge/InsightCV-AI%20Career%20Platform-6C5CE7?style=for-the-badge&logo=rocket)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express/Native-339933?style=for-the-badge&logo=nodedotjs)
![Laravel](https://img.shields.io/badge/Laravel-12.0-FF2D20?style=for-the-badge&logo=laravel)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Connecting Top Talent with Leading Companies through Cutting-Edge AI**

[Features](#-key-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start--installation) • [API Architecture](#-api-architecture) • [License](#-license)

</div>

---

## 📖 About InsightCV

**InsightCV** is an intelligent, full-stack career development and recruitment platform engineered to revolutionize job searching and candidate hiring. By combining smart CV parsing, interactive AI mock interviews (via text and voice), skill gap analysis, and real-time candidate-job matching algorithms, InsightCV provides an end-to-end ecosystem for both job seekers and hiring companies.

---

## ✨ Key Features

### 👤 For Job Seekers (Candidates)
- 📄 **Smart CV Analysis**: Upload CVs in PDF or text formats to receive instant AI feedback, keyword extraction, and score optimization.
- 🎤 **AI Mock Interviews (Text & Voice)**: Practice real-world technical and soft skill interview questions with dynamic feedback and voice transcription capability.
- 📊 **Skill Gap & Career Guidance**: Identify missing skills required for target job roles and receive personalized learning recommendations.
- 💼 **Job Discovery & Direct Application**: Browse openings, check AI-calculated candidate-job match scores, and track application status.
- 🏆 **Gamified Progress Tracking**: Earn points, unlock achievement badges, and keep record of interview performance over time.

### 🏢 For Employers & Companies
- 📝 **Job Posting & Management**: Create, edit, and publish job listings with tailored requirements and skill tags.
- 🎯 **AI Candidate Matching**: Automatically calculate match percentages between job requirements and applicant CV profiles.
- 🔍 **Candidate Search & Filter**: Filter candidates by skill sets, experience, and position fit.
- 📥 **Applicant Tracking**: View submitted CVs, monitor interview readiness, and track candidate progression.
- ⭐ **Feedback & Platform Reviews**: Submit reviews and ratings to help continuously improve matching accuracy.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18.2.0
- **Routing**: React Router DOM v6
- **UI & Animations**: Framer Motion, Lucide React Icons
- **HTTP Client**: Native Fetch API / Axios

### Backend
- **Core API Server**: Node.js HTTP Server (`server.js`) with structured RESTful routes
- **Alternative Framework**: Laravel 12 (PHP 8.2+) with Eloquent ORM & Migrations
- **Database**: SQLite / MySQL support
- **State & Storage**: In-memory data store with disk persistence support for uploaded CV files

---

## 📁 Project Structure

```
InsightCV/
├── backend/                  # API Backend Service
│   ├── app/                 # Laravel Controllers, Models, & Middleware
│   ├── config/              # Server configuration
│   ├── database/            # Migrations & Seeds
│   ├── routes/              # Route definitions
│   ├── server.js            # Lightweight Node.js API server
│   ├── package.json         # Node.js backend dependencies
│   └── composer.json        # Laravel PHP dependencies
│
├── frontend/                 # React Frontend Application
│   ├── public/              # Static HTML & assets
│   ├── src/                 # Application Source Code
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application views/routes
│   │   ├── services/        # API communication Layer
│   │   └── utils/           # Helper scripts & formatting
│   └── package.json         # Frontend dependencies & scripts
│
├── LICENSE                   # Open source license details
└── README.md                 # Project documentation
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: `v16.x` or higher
- **npm**: `v8.x` or higher
- **PHP** (Optional, for Laravel backend): `8.2+`
- **Composer** (Optional, for PHP dependencies)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Ramaalodat/Project-InsightCV.git
cd Project-InsightCV
```

---

### Step 2: Start Backend Server

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if needed)
npm install

# Start the Node API server (Runs on http://localhost:8000)
node server.js
```

*For Laravel Backend (Alternative):*
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

---

### Step 3: Start Frontend Application

Open a new terminal window:

```bash
# Navigate to frontend directory from project root
cd frontend

# Install dependencies
npm install

# Launch the React dev server (Runs on http://localhost:3000)
npm start
```

---

## 🔌 API Architecture

The server exposes key REST API endpoints for user authentication, job management, candidate processing, and AI mock interviews:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/register` | Register a new user (`candidate` or `company`) |
| `POST` | `/api/login` | Authenticate user and receive access token |
| `GET` | `/api/jobs` | Retrieve all job listings |
| `POST` | `/api/jobs` | Post a new job (Company account required) |
| `POST` | `/api/upload-cv` | Upload candidate CV document for processing |
| `GET` | `/api/candidates` | Fetch candidate listings for company matching |
| `POST` | `/api/interview/start` | Initialize an AI mock interview session |
| `POST` | `/api/ratings` | Submit user feedback and ratings |

---

## 🛡️ License

Distributed under the **MIT License**. See [`LICENSE`](file:///e:/New%20folder%20%2830%29/Project-InsightCV/LICENSE) for more details.

---

<div align="center">

Crafted with ❤️ by **Rama Alodat** & team for **InsightCV**.

</div>