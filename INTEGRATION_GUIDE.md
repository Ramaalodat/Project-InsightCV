# InsightCV - Frontend & Backend Integration Guide

## 🎯 Overview

This document provides a complete guide for the integrated InsightCV platform connecting React frontend with Laravel backend.

## 📋 What Has Been Completed

### Backend (Laravel)

#### ✅ Models Created
- `User` - Extended with role, points, avatar, location
- `Candidate` - Employee profiles with skills and experience
- `Company` - Company profiles with details
- `Job` - Job postings with skills and requirements
- `Application` - Job applications tracking
- `CV` - CV uploads with AI analysis results
- `AIInterviewSession` - Interview practice sessions
- `Skill` - Skills database
- `Rating` - User ratings and testimonials

#### ✅ Controllers Created
- `AuthController` - Registration, login, password reset
- `CVController` - CV upload and AI analysis
- `AIInterviewController` - Interview sessions management
- `JobController` - Job CRUD and applications
- `RatingController` - Ratings and testimonials
- `ProfileController` - User profile management
- `CandidateController` - Candidate suggestions for companies

#### ✅ API Routes
All routes configured in `backend/routes/api.php`:
- `/api/register` - User registration
- `/api/login` - User login
- `/api/forgot-password` - Password reset request
- `/api/cv/upload` - Upload and analyze CV
- `/api/interview/start` - Start AI interview
- `/api/jobs` - Job listings and management
- `/api/ratings` - Submit and view ratings
- `/api/profile/{userId}` - Profile management
- `/api/candidates/suggested/{userId}` - Get suggested candidates

#### ✅ Database Migrations
- Complete schema with all tables
- Relationships properly defined
- Ratings table added

### Frontend (React)

#### ✅ Services Created
- `api.js` - Complete API integration layer
- `auth.js` - Authentication utilities (localStorage management)

#### ✅ Components Updated
- `LoginForm` - Connected to backend API with forgot password
- `SignupForm` - Connected to backend API with role selection
- `UploadCVPage` - Integrated with CV upload API
- `AIInterviewPage` - Integrated with interview API

## 🚀 Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install PHP dependencies (if not already done):**
   ```bash
   composer install
   ```

3. **Create .env file:**
   ```bash
   copy .env.example .env
   ```

4. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

5. **Configure database in .env:**
   ```
   DB_CONNECTION=sqlite
   # Or use MySQL:
   # DB_CONNECTION=mysql
   # DB_HOST=127.0.0.1
   # DB_PORT=3306
   # DB_DATABASE=insightcv
   # DB_USERNAME=root
   # DB_PASSWORD=
   ```

6. **Run migrations:**
   ```bash
   php artisan migrate
   ```

7. **Create storage link:**
   ```bash
   php artisan storage:link
   ```

8. **Start Laravel server:**
   ```bash
   php artisan serve
   ```
   Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Update API URL if needed:**
   Edit `frontend/src/services/api.js` and update `API_BASE_URL` if your backend runs on a different port.

4. **Start React development server:**
   ```bash
   npm start
   ```
   Frontend will run on `http://localhost:3000`

## 🔧 Configuration

### CORS Configuration

The backend is configured to accept requests from `http://localhost:3000`. If you need to change this:

Edit `backend/config/cors.php`:
```php
'allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000'],
```

### File Upload Configuration

CV files are stored in `backend/storage/app/public/cvs/`
Avatar images are stored in `backend/storage/app/public/avatars/`

Maximum file sizes:
- CV: 5MB
- Avatar: 2MB

## 📱 Features Implementation Status

### ✅ Completed Features

1. **Authentication System**
   - ✅ Sign up (Company & Employee)
   - ✅ Login with role-based routing
   - ✅ Forgot password functionality
   - ✅ Password reset
   - ✅ User session management (localStorage)

2. **CV Analysis**
   - ✅ File upload (PDF, DOC, DOCX)
   - ✅ AI-powered analysis (simulated)
   - ✅ Strengths & weaknesses detection
   - ✅ Missing skills identification
   - ✅ Improvement suggestions
   - ✅ Company matching
   - ✅ Results stored in database
   - ✅ View previous analyses

3. **AI Interview Simulation**
   - ✅ Chat mode
   - ✅ Voice mode (UI ready)
   - ✅ 10-question interview
   - ✅ Real-time feedback
   - ✅ Performance scoring
   - ✅ Points system
   - ✅ Session history

4. **Job Management**
   - ✅ Post jobs (companies)
   - ✅ View job listings (employees)
   - ✅ Job search and filters
   - ✅ Apply to jobs
   - ✅ Track applications
   - ✅ View applicants (companies)

5. **Profile System**
   - ✅ Candidate profiles
   - ✅ Company profiles
   - ✅ Avatar upload
   - ✅ Skills management
   - ✅ Profile completion tracking

6. **Rating System**
   - ✅ Submit ratings
   - ✅ View approved ratings
   - ✅ Admin approval system

7. **Candidate Matching**
   - ✅ AI-based matching algorithm
   - ✅ Match percentage calculation
   - ✅ Skill-based suggestions
   - ✅ Filter by match score

### 🔄 Remaining Tasks

#### High Priority

1. **Complete Frontend Integration**
   - Update `JobListingsPage` to fetch from API
   - Update `PostJobPage` to submit to API
   - Update `ProfilePage` to fetch/update via API
   - Update `MyJobsPage` to fetch company jobs
   - Update `SuggestedEmployeesPage` to fetch suggestions
   - Update `RatingPage` to submit ratings
   - Update `CompanyHomePage` to show real statistics
   - Update `EmployeeHomePage` to show real statistics

2. **Voice Interview Implementation**
   - Integrate Web Speech API for voice recognition
   - Add text-to-speech for AI responses
   - Implement real-time voice processing
   - Add voice quality analysis

3. **Enhanced AI Features**
   - Integrate actual AI/ML service (optional)
   - Improve CV parsing
   - Better skill extraction
   - More accurate matching algorithm

4. **Statistics & Analytics**
   - Real-time dashboard updates
   - Activity tracking
   - Performance metrics
   - Usage analytics

#### Medium Priority

5. **Notifications System**
   - Email notifications
   - In-app notifications
   - Application status updates
   - New job alerts

6. **Search & Filters**
   - Advanced job search
   - Candidate search for companies
   - Filter by multiple criteria
   - Save search preferences

7. **File Management**
   - Download CVs
   - Multiple CV versions
   - Document preview
   - File compression

#### Low Priority

8. **Additional Features**
   - Chat between company and candidate
   - Video interview scheduling
   - Calendar integration
   - Export reports
   - Multi-language support

## 🔐 Security Considerations

1. **Authentication**
   - Currently using simple token-less authentication
   - Consider implementing Laravel Sanctum for API tokens
   - Add CSRF protection for sensitive operations

2. **File Upload**
   - Validate file types and sizes
   - Scan for malware
   - Limit upload frequency

3. **Data Validation**
   - All inputs validated on backend
   - Sanitize user-generated content
   - Prevent SQL injection

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
Use Postman or similar tool to test endpoints:
- Import collection from `backend/routes/api.php`
- Test all CRUD operations
- Verify error handling

## 📊 Database Schema

### Key Tables
- `users` - User accounts
- `candidates` - Employee profiles
- `companies` - Company profiles
- `jobs` - Job postings
- `applications` - Job applications
- `cvs` - CV uploads and analysis
- `ai_interview_sessions` - Interview practice
- `skills` - Skills database
- `candidate_skills` - User skills (pivot)
- `job_skills` - Job requirements (pivot)
- `ratings` - User testimonials

## 🎨 Frontend Structure

```
frontend/src/
├── components/
│   ├── LoginForm.js (✅ Updated)
│   ├── SignupForm.js (✅ Updated)
│   ├── Navbar.js
│   ├── EmployeeNavbar.jsx
│   └── companyHome/
│       └── NavbarCompany.jsx
├── pages/
│   ├── UploadCVPage.jsx (✅ Updated)
│   ├── AIInterviewPage.jsx (✅ Updated)
│   ├── JobListingsPage.jsx (⏳ Needs update)
│   ├── PostJobPage.jsx (⏳ Needs update)
│   ├── ProfilePage.jsx (⏳ Needs update)
│   ├── MyJobsPage.jsx (⏳ Needs update)
│   ├── SuggestedEmployeesPage.jsx (⏳ Needs update)
│   └── RatingPage.jsx (⏳ Needs update)
├── services/
│   └── api.js (✅ Created)
└── utils/
    └── auth.js (✅ Created)
```

## 🐛 Known Issues & Solutions

### Issue 1: CORS Errors
**Solution:** Ensure `backend/config/cors.php` includes your frontend URL

### Issue 2: File Upload Fails
**Solution:** Run `php artisan storage:link` and check permissions

### Issue 3: Database Connection Error
**Solution:** Verify `.env` database configuration

### Issue 4: API Returns 404
**Solution:** Ensure Laravel server is running on port 8000

## 📝 API Documentation

### Authentication Endpoints

#### POST /api/register
Register new user (company or candidate)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "candidate",
  "company_name": "Company Name" // Required if role is "company"
}
```

#### POST /api/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/forgot-password
Request password reset
```json
{
  "email": "john@example.com"
}
```

### CV Endpoints

#### POST /api/cv/upload
Upload and analyze CV (multipart/form-data)
```
cv_file: File
job_title: String
user_id: Integer
```

#### GET /api/cv/user/{userId}
Get all CVs for a user

### Interview Endpoints

#### POST /api/interview/start
Start new interview session
```json
{
  "user_id": 1,
  "mode": "chat" // or "voice"
}
```

#### POST /api/interview/{sessionId}/answer
Submit answer to question
```json
{
  "question": "Tell me about yourself",
  "answer": "I am a software developer..."
}
```

### Job Endpoints

#### GET /api/jobs
Get all active jobs (with optional filters)

#### POST /api/jobs
Create new job posting
```json
{
  "user_id": 1,
  "title": "Senior Developer",
  "location": "New York",
  "type": "full-time",
  "experience_level": "senior",
  "description": "Job description...",
  "requirements": "Requirements...",
  "salary_min": 100000,
  "salary_max": 150000,
  "skills": ["React", "Node.js"]
}
```

#### POST /api/jobs/apply
Apply to a job
```json
{
  "job_id": 1,
  "user_id": 2,
  "cover_letter": "I am interested..."
}
```

### Profile Endpoints

#### GET /api/profile/{userId}
Get user profile

#### PUT /api/profile/candidate/{userId}
Update candidate profile

#### PUT /api/profile/company/{userId}
Update company profile

#### GET /api/profile/{userId}/statistics
Get user statistics

### Rating Endpoints

#### POST /api/ratings
Submit rating
```json
{
  "user_id": 1,
  "rating": 5,
  "comment": "Great platform!"
}
```

#### GET /api/ratings
Get approved ratings

## 🎯 Next Steps

1. **Complete remaining frontend integrations** (see Remaining Tasks above)
2. **Test all features end-to-end**
3. **Implement voice interview functionality**
4. **Add real-time notifications**
5. **Enhance AI analysis with actual ML models**
6. **Deploy to production**

## 💡 Tips for Development

1. **Keep both servers running** during development
2. **Check browser console** for API errors
3. **Use Laravel logs** for backend debugging: `backend/storage/logs/laravel.log`
4. **Clear browser localStorage** if authentication issues occur
5. **Run migrations** after any database schema changes

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review API documentation
3. Check Laravel and React documentation
4. Test API endpoints with Postman

---

**Status:** Backend fully integrated, Frontend partially integrated
**Last Updated:** October 21, 2025
**Version:** 1.0.0
