# 🚀 InsightCV - AI-Powered Career Platform

<div align="center">

![InsightCV](https://img.shields.io/badge/InsightCV-AI%20Career%20Platform-FFD700?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Laravel](https://img.shields.io/badge/Laravel-12.0-FF2D20?style=for-the-badge&logo=laravel)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)

**Connecting Talent with Opportunity Through AI**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 About

InsightCV is a modern, full-stack AI-powered platform that bridges the gap between companies and job seekers. The platform offers intelligent CV analysis, AI-driven interview practice, and smart matching algorithms to help both sides find their perfect match.

### ✨ Key Highlights

- 🤖 **AI-Powered Analysis** - Intelligent CV review and skill gap identification
- 🎤 **Interview Simulation** - Practice with AI in chat or voice mode
- 🎯 **Smart Matching** - Algorithm-based company-candidate matching
- 💼 **Complete Job Management** - Post, manage, and track job listings
- 📊 **Progress Tracking** - Points system and performance analytics
- 🎨 **Beautiful UI** - Modern design with smooth animations
- 🔐 **Secure Authentication** - Role-based access control
- 💾 **Database Integration** - All data persisted and retrievable

---

## 🎯 Features

### For Companies 🏢
- ✅ Post and manage job listings
- ✅ View AI-matched candidates with match percentages
- ✅ Filter candidates by skills and experience
- ✅ Download candidate CVs
- ✅ Edit company profile and branding
- ✅ Track applicants and job statistics
- ✅ View candidate applications
- ✅ Rate and review the platform

### For Job Seekers 👤
- ✅ Upload CV for AI-powered analysis
- ✅ Get personalized skill recommendations
- ✅ Practice interviews with AI (Chat & Voice modes)
- ✅ Receive detailed performance feedback
- ✅ Search and apply for jobs
- ✅ Track progress with points system
- ✅ Manage profile and skills
- ✅ View previous AI session results
- ✅ Rate and review the platform

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **PHP** (v8.2 or higher)
- **Composer**
- **MySQL** or **SQLite**

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd insightcv
```

#### 2. Backend Setup (Laravel)

```bash
# Navigate to backend
cd backend

# Install dependencies
composer install

# Create environment file
copy .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
# For SQLite (default):
DB_CONNECTION=sqlite

# For MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=insightcv
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations
php artisan migrate

# Create storage link
php artisan storage:link

# Start Laravel server
php artisan serve
```

Backend will run on `http://localhost:8000`

#### 3. Frontend Setup (React)

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

### Testing the Application

**Company Account:**
- Sign up with role "Company"
- Access company dashboard
- Post jobs and view suggested candidates

**Employee Account:**
- Sign up with role "Candidate"
- Access employee dashboard
- Upload CV and practice interviews

---

## 📁 Project Structure

```
insightcv/
├── backend/                    # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/   # API Controllers
│   │   └── Models/            # Eloquent Models
│   ├── config/                # Configuration files
│   ├── database/
│   │   └── migrations/        # Database migrations
│   ├── routes/
│   │   └── api.php           # API routes
│   └── storage/              # File storage
│
├── frontend/                  # React Frontend
│   ├── public/               # Static assets
│   └── src/
│       ├── components/       # Reusable components
│       ├── pages/           # Page components
│       ├── services/        # API services
│       └── utils/           # Utility functions
│
├── INTEGRATION_GUIDE.md      # Detailed integration guide
└── README.md                 # This file
```

---

## 🛠 Tech Stack

### Backend
- **Laravel 12** - PHP framework
- **MySQL/SQLite** - Database
- **Eloquent ORM** - Database abstraction
- **Laravel Migrations** - Schema management

### Frontend
- **React 18.2** - UI library
- **React Router DOM 6.8** - Routing
- **Framer Motion 10.16** - Animations
- **Lucide React** - Icons
- **Fetch API** - HTTP requests

### Development
- **Composer** - PHP dependency manager
- **npm** - JavaScript package manager
- **Vite** - Build tool
- **ESLint** - Code quality

---

## 📚 Documentation

Comprehensive documentation is available:

- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Complete integration guide
- **[frontend/README.md](./frontend/README.md)** - Frontend documentation
- **[backend/README.md](./backend/README.md)** - Backend documentation

---

## 🗺 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password

### CV Management
- `POST /api/cv/upload` - Upload and analyze CV
- `GET /api/cv/user/{userId}` - Get user's CVs
- `GET /api/cv/{id}` - Get specific CV

### AI Interview
- `POST /api/interview/start` - Start interview session
- `POST /api/interview/{sessionId}/answer` - Submit answer
- `GET /api/interview/user/{userId}` - Get user's sessions

### Jobs
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs/{id}` - Get job details
- `POST /api/jobs/apply` - Apply to job
- `GET /api/jobs/company/{userId}` - Get company's jobs

### Profile
- `GET /api/profile/{userId}` - Get profile
- `PUT /api/profile/candidate/{userId}` - Update candidate profile
- `PUT /api/profile/company/{userId}` - Update company profile
- `GET /api/profile/{userId}/statistics` - Get statistics

### Ratings
- `POST /api/ratings` - Submit rating
- `GET /api/ratings` - Get approved ratings

### Candidates
- `GET /api/candidates/suggested/{userId}` - Get suggested candidates
- `GET /api/candidates/{id}` - Get candidate details

---

## 🎨 Design System

### Color Palette
- **Primary**: Dark backgrounds (#0A0A1F, #1a1a2e, #16213e)
- **Accent**: Gold (#FFD700) and Orange (#FFA500)
- **Text**: White with varying opacity

### Visual Effects
- Glassmorphism with backdrop blur
- Floating orb backgrounds
- Particle animations
- Smooth transitions
- Gradient text effects

---

## 🔐 Security Features

- Password hashing with bcrypt
- Input validation on all endpoints
- File type and size validation
- SQL injection prevention
- XSS protection
- CORS configuration
- Role-based access control

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
php artisan test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
Use Postman or similar tool:
1. Import API collection
2. Test all endpoints
3. Verify responses

---

## 📊 Database Schema

### Core Tables
- **users** - User accounts with roles
- **candidates** - Employee profiles
- **companies** - Company profiles
- **jobs** - Job postings
- **applications** - Job applications
- **cvs** - CV uploads and analysis
- **ai_interview_sessions** - Interview practice
- **skills** - Skills database
- **ratings** - User testimonials

### Relationships
- User → Candidate (1:1)
- User → Company (1:1)
- Company → Jobs (1:N)
- Candidate → CVs (1:N)
- Candidate → Applications (1:N)
- Job → Applications (1:N)
- Candidate ↔ Skills (N:N)
- Job ↔ Skills (N:N)

---

## 🚧 Development Status

### ✅ Completed
- Backend API fully implemented
- Database schema complete
- Authentication system
- CV upload and analysis
- AI interview (chat mode)
- Job posting and listing
- Profile management
- Rating system
- Candidate matching

### 🔄 In Progress
- Frontend-backend integration
- Voice interview mode
- Real-time notifications
- Advanced search filters

### 📋 Planned
- Email notifications
- Video interviews
- Chat messaging
- Analytics dashboard
- Mobile app
- Multi-language support

---

## 🐛 Known Issues

1. **Voice Interview** - UI ready, needs Web Speech API integration
2. **Real-time Updates** - Requires WebSocket implementation
3. **Email Notifications** - Mail configuration needed
4. **File Preview** - PDF viewer integration pending

---

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
APP_NAME=InsightCV
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite
MAIL_MAILER=log
```

#### Frontend (api.js)
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

---

## 📈 Performance

- Fast initial load
- Smooth animations (60fps)
- Optimized API requests
- Efficient database queries
- Lazy loading ready
- Code splitting ready

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📄 License

This project is private and proprietary.

---

## 👥 Support

For questions or issues:
1. Check documentation
2. Review API endpoints
3. Test with Postman
4. Check Laravel logs

---

## 🎉 Acknowledgments

- Laravel Framework
- React Library
- Framer Motion
- Lucide Icons
- All open-source contributors

---

<div align="center">

**Built with ❤️ using React & Laravel**

*Connecting Talent with Opportunity Through AI*

**Version 1.0.0** | **Last Updated: October 21, 2025**

</div>
#   P r o j e c t - I n s i g h t C V  
 #   P r o j e c t - I n s i g h t C V  
 #   P r o j e c t - I n s i g h t C V  
 