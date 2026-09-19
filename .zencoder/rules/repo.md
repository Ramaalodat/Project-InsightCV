# Repository Overview

## Project Structure

- **frontend/**: React-based client application responsible for UI/UX and user interactions.
- **backend/**: Laravel-based API server handling authentication, data persistence, and AI-related workflows (via local services or integrated libraries).

## Key Technologies

- **Frontend**: React, JavaScript, CSS modules, Context/Redux (confirm actual state layering), REST API integration.
- **Backend**: PHP 8.x, Laravel 10.x, MySQL/PostgreSQL (confirm configured driver), Laravel Sanctum/Passport for API auth.

## Primary Responsibilities

1. **Authentication & Authorization**
   - Support distinct Company and Employee roles.
   - Provide registration, login, and password recovery.
   - Secure API endpoints using middleware and token-based auth.

2. **AI-Driven Features**
   - CV analysis and interview simulations (chat & voice modes).
   - Store AI outputs, conversation logs, and analytics in database.

3. **Job Marketplace**
   - Companies can post, manage, and review job listings.
   - Employees can browse jobs and submit applications.
   - AI-driven recommendations for matching candidates to jobs.

4. **User Profiles & Feedback**
   - Editable company and employee profiles.
   - Ratings, comments, and testimonials surfaced publicly.

## Development Notes

- Ensure consistent data models between frontend forms and backend endpoints.
- Validate all user input both client-side and server-side.
- Leverage existing components/services; avoid redundant rewrites.
- Align UI with brand palette, animations, and responsive design foundations.

## Testing & QA

- Frontend: use unit/integration tests (Jest/React Testing Library) for critical flows where available.
- Backend: run Laravel feature tests for auth, job posting, AI endpoints, and data persistence.
- Manual QA: verify cross-role access, data sync, and voice/chat simulations.

## Deployment Considerations

- Separate environment configs for local vs production (env files).
- Ensure background jobs/queues configured for AI processing if asynchronous.
- Confirm CORS, HTTPS, and storage (CV uploads, logs) policies before release.