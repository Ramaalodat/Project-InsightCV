<div align="center">

  <br />

  <img src="https://img.shields.io/badge/InsightCV-AI%20Career%20%26%20Recruitment-6C5CE7?style=for-the-badge&logo=rocket&logoColor=white" alt="InsightCV Header Banner" width="400" />

  <h1>✨ InsightCV — AI-Powered Career & Recruitment Ecosystem</h1>

  <p>
    <b>The next-generation recruitment intelligence platform connecting top talent with industry leaders.</b>
    <br />
    Leveraging advanced AI CV parsing, real-time voice & text mock interviews, automated match scoring, and career path analytics.
  </p>

  <p>
    <a href="#-key-features">Key Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-api-architecture">API Reference</a> •
    <a href="#-screenshots--demo">UI Overview</a> •
    <a href="#-license">License</a>
  </p>

  <!-- Badges -->
  <p>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 18" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-v18.x-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" /></a>
    <a href="https://laravel.com/"><img src="https://img.shields.io/badge/Laravel-12.0-FF2D20?style=flat-square&logo=laravel&logoColor=white" alt="Laravel 12" /></a>
    <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express-REST%20API-000000?style=flat-square&logo=express&logoColor=white" alt="Express" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License MIT" /></a>
    <a href="https://github.com/Ramaalodat/Project-InsightCV/stargazers"><img src="https://img.shields.io/github/stars/Ramaalodat/Project-InsightCV?style=flat-square&color=gold" alt="Stars" /></a>
  </p>

  <br />

</div>

---

## 💡 Overview

> **InsightCV** bridges the gap between candidates searching for their dream careers and companies seeking perfect-fit talent. Powered by AI algorithms, InsightCV provides deep resume diagnostics, interactive voice/text interview coaching, dynamic candidate-job match percentages, and real-time candidate management.

<table align="center" width="100%">
  <tr>
    <td width="50%" valign="top">
      <h3>🎯 For Job Seekers</h3>
      <ul>
        <li>📄 <b>AI CV Scanner:</b> Instant feedback, keyword optimization & scoring.</li>
        <li>🎤 <b>Interactive AI Interviews:</b> Voice & text technical practice with live feedback.</li>
        <li>📈 <b>Skill Gap Analyzer:</b> Personalized learning roadmaps to land targeted positions.</li>
        <li>🏆 <b>Gamified Achievements:</b> Earn badges & track readiness scores over time.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🏢 For Employers & Recruiters</h3>
      <ul>
        <li>🎯 <b>Smart Candidate Matching:</b> AI-calculated match percentage per applicant.</li>
        <li>📝 <b>Job Management Hub:</b> Create, target, and monitor job listings seamlessly.</li>
        <li>🔍 <b>Talent Discovery:</b> Advanced multi-criteria search and filter across candidates.</li>
        <li>📊 <b>Applicant Tracking (ATS):</b> Monitor stage-by-stage candidate progression.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🔥 Key Features

### 🧠 1. Smart Resume Parsing & CV Insights
- Upload CVs (PDF / Word / Plain Text).
- Automated AI extraction of skills, experience, education, and soft skills.
- Actionable suggestions to pass Applicant Tracking Systems (ATS).

### 🎤 2. AI Voice & Text Mock Interviews
- Real-time AI interviewer questions tailored to target job roles.
- Supports speech-to-text voice responses and written submissions.
- Comprehensive performance reports analyzing response clarity, key concepts covered, and areas for improvement.

### ⚡ 3. Automated Match Scoring & Job Discovery
- Proprietary matching engine evaluating candidate skill profiles against job requirements.
- Match scores displayed transparently for both candidates and hiring managers.
- One-click application process with live status tracking.

---

## 🛠 Tech Stack

<table>
  <tr>
    <th align="left">Layer</th>
    <th align="left">Technologies & Libraries</th>
  </tr>
  <tr>
    <td><b>Frontend</b></td>
    <td>
      <code>React 18.2</code> • <code>React Router DOM v6</code> • <code>Framer Motion</code> • <code>Lucide Icons</code> • <code>Axios / Fetch API</code>
    </td>
  </tr>
  <tr>
    <td><b>Backend</b></td>
    <td>
      <code>Node.js Server (`server.js`)</code> • <code>Express / Native HTTP</code> • <code>Laravel 12 (PHP 8.2+)</code> • <code>Eloquent ORM</code>
    </td>
  </tr>
  <tr>
    <td><b>Database & Storage</b></td>
    <td>
      <code>SQLite</code> • <code>MySQL</code> • <code>File System Storage (CV Uploads)</code>
    </td>
  </tr>
  <tr>
    <td><b>Dev Tools</b></td>
    <td>
      <code>Git</code> • <code>npm</code> • <code>Composer</code> • <code>Postman</code>
    </td>
  </tr>
</table>

---

## 📁 Repository Architecture

```gdb
InsightCV/
 ├── 📂 backend/                  # API Core & Business Logic
 │    ├── 📂 app/                 # Laravel Controllers, Models & Middleware
 │    ├── 📂 config/              # Environment & application configurations
 │    ├── 📂 database/            # Database migrations, seeders & SQLite schemas
 │    ├── 📂 routes/              # API endpoints and route dispatchers
 │    ├── 📄 server.js            # Standalone, lightweight Node.js API server
 │    ├── 📄 package.json         # Node.js backend manifest & dependencies
 │    └── 📄 composer.json        # PHP Laravel manifest & packages
 │
 ├── 📂 frontend/                 # High-Performance React Web App
 │    ├── 📂 public/              # Web assets, icons, and static templates
 │    ├── 📂 src/                 # React UI Source Code
 │    │    ├── 📂 components/      # Reusable UI components & design system
 │    │    ├── 📂 pages/           # Application route pages & views
 │    │    ├── 📂 services/        # API client modules & HTTP handlers
 │    │    └── 📂 utils/           # Formatting helpers & utility functions
 │    └── 📄 package.json         # Frontend web application manifest
 │
 ├── 📄 LICENSE                   # Open-Source MIT License
 └── 📄 README.md                 # Complete System Documentation
```

---

## 🚀 Quick Start

### 📋 Prerequisites

Ensure you have the following installed on your machine:
* **Node.js**: `v18.x` or later ([Download Node.js](https://nodejs.org/))
* **npm**: `v9.x` or later
* **PHP** *(Optional - for Laravel backend)*: `v8.2+`
* **Composer** *(Optional - for PHP packages)*: `v2.x+`

---

### 📥 1. Clone & Setup

```bash
# Clone repository
git clone https://github.com/Ramaalodat/Project-InsightCV.git

# Navigate to project directory
cd Project-InsightCV
```

---

### ⚙️ 2. Start Backend Service

#### Option A: Lightweight Node.js Server *(Recommended for quick testing)*

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start Node API Server (Runs on http://localhost:8000)
node server.js
```

#### Option B: Full Laravel Backend

```bash
cd backend

# Install PHP dependencies
composer install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database Setup & Migrations
php artisan migrate

# Start Laravel Server (Runs on http://localhost:8000)
php artisan serve
```

---

### 💻 3. Start Frontend Web Client

In a **new terminal window**:

```bash
# Navigate to frontend folder from root
cd frontend

# Install Node dependencies
npm install

# Launch React Development Server (Runs on http://localhost:3000)
npm start
```

🎉 **InsightCV is now running!** Open your browser and navigate to `http://localhost:3000`.

---

## 🔌 API Reference & Endpoints

| HTTP Verb | Endpoint | Authentication | Description |
| :---: | :--- | :---: | :--- |
| `POST` | `/api/register` | None | Register a new user (`candidate` or `company`) |
| `POST` | `/api/login` | None | Authenticate user & issue access session token |
| `GET` | `/api/jobs` | Public | Retrieve active job listings |
| `POST` | `/api/jobs` | Employer | Publish a new job vacancy listing |
| `POST` | `/api/upload-cv` | Candidate | Upload CV document for AI processing & analysis |
| `GET` | `/api/candidates` | Employer | Fetch candidate list & calculate matching fit |
| `POST` | `/api/interview/start` | Candidate | Initialize interactive AI mock interview |
| `POST` | `/api/ratings` | Authenticated | Submit platform feedback and rating score |

---

## 🎨 Design & User Experience Highlights

- 💎 **Modern Dark & Light Themes**: Beautiful glassmorphism aesthetic with responsive layouts.
- ⚡ **Micro-Interactions**: Powered by Framer Motion for ultra-smooth UI transitions.
- 📱 **Mobile First**: Fully responsive across mobile, tablet, and desktop viewports.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve InsightCV:

1. Fork the Project (`https://github.com/Ramaalodat/Project-InsightCV/fork`)
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for complete details.

---

<div align="center">

  <sub>Built with ❤️ by <b>Rama Alodat</b> and the InsightCV Engineering Team.</sub>

  <br /><br />

  <a href="#-insightcv--ai-powered-career--recruitment-ecosystem">⬆ Back to Top</a>

</div>