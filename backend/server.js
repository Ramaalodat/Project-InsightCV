import http from 'http';

const PORT = 8000;

// In-memory mock database
const db = {
  users: [
    {
      id: 1,
      name: 'Rama Alodat',
      email: 'ramafer05@gmail.com',
      role: 'candidate',
      created_at: new Date().toISOString()
    }
  ],
  candidates: [
    {
      id: 1,
      user_id: 1,
      name: 'Rama Alodat',
      title: 'Full Stack Developer',
      skills: ['React', 'Node.js', 'JavaScript', 'CSS'],
      experience: '3 years',
      bio: 'Enthusiastic web developer building modern applications.'
    }
  ],
  companies: [],
  jobs: [
    {
      id: 1,
      title: 'Frontend Developer (React)',
      company: 'Tech Solutions Inc.',
      location: 'Amman, Jordan (Hybrid)',
      type: 'Full-time',
      salary: '$1,500 - $2,200',
      description: 'Looking for a skilled React developer to join our team.',
      requirements: ['React', 'JavaScript', 'CSS', 'REST APIs'],
      created_at: new Date().toISOString()
    }
  ],
  cvs: [],
  interviews: [],
  ratings: []
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    let parsedBody = {};
    if (body) {
      try {
        parsedBody = JSON.parse(body);
      } catch (e) {
        // Form Data or raw text
      }
    }

    const url = req.url;
    console.log(`[Backend API] ${req.method} ${url}`);

    const sendJSON = (statusCode, data) => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    };

    // Auth Routes
    if (url === '/api/register' && req.method === 'POST') {
      const newUser = {
        id: db.users.length + 1,
        name: parsedBody.name || 'Rama Alodat',
        email: parsedBody.email || 'ramafer05@gmail.com',
        role: parsedBody.role || 'candidate',
        created_at: new Date().toISOString()
      };
      db.users.push(newUser);

      return sendJSON(200, {
        message: 'Registration successful!',
        user: newUser,
        token: 'mock-jwt-token-12345'
      });
    }

    if (url === '/api/login' && req.method === 'POST') {
      const user = db.users.find(u => u.email === parsedBody.email) || db.users[0];
      return sendJSON(200, {
        message: 'Login successful!',
        user: user,
        token: 'mock-jwt-token-12345'
      });
    }

    if (url === '/api/forgot-password' || url === '/api/reset-password' || url === '/api/logout') {
      return sendJSON(200, { message: 'Operation successful' });
    }

    if (url.startsWith('/api/profile/') && req.method === 'GET') {
      const userId = parseInt(url.split('/').pop()) || 1;
      const user = db.users.find(u => u.id === userId) || db.users[0];
      return sendJSON(200, {
        user: user,
        candidate: db.candidates[0],
        statistics: { cvs_count: 1, interviews_count: 2, applications_count: 3 }
      });
    }

    if (url.startsWith('/api/profile/candidate/') && req.method === 'PUT') {
      return sendJSON(200, { message: 'Profile updated successfully' });
    }

    if (url === '/api/jobs' && req.method === 'GET') {
      return sendJSON(200, db.jobs);
    }

    if (url === '/api/jobs' && req.method === 'POST') {
      const newJob = {
        id: db.jobs.length + 1,
        ...parsedBody,
        created_at: new Date().toISOString()
      };
      db.jobs.push(newJob);
      return sendJSON(200, { message: 'Job created successfully', job: newJob });
    }

    if (url.startsWith('/api/candidates/suggested/') && req.method === 'GET') {
      return sendJSON(200, db.candidates);
    }

    if (url === '/api/cv/upload' && req.method === 'POST') {
      return sendJSON(200, {
        message: 'CV uploaded successfully',
        cv: {
          id: 1,
          filename: 'cv.pdf',
          score: 88,
          skills: ['React', 'JavaScript', 'CSS', 'Communication', 'Problem Solving'],
          summary: 'Strong frontend profile with impressive experience.'
        }
      });
    }

    if (url === '/api/interview/start' && req.method === 'POST') {
      return sendJSON(200, {
        session_id: 'session-101',
        first_question: 'Welcome to your AI Interview! Can you describe your experience with web development?'
      });
    }

    if (url.includes('/interview/') && url.includes('/answer') && req.method === 'POST') {
      return sendJSON(200, {
        next_question: 'Great answer! How do you handle complex bugs or project challenges?',
        score: 85
      });
    }

    if (url.includes('/interview/') && url.includes('/complete') && req.method === 'POST') {
      return sendJSON(200, {
        message: 'Interview completed!',
        overall_score: 90,
        feedback: 'Excellent technical clarity and communication.'
      });
    }

    if (url === '/api/ratings' && req.method === 'GET') {
      return sendJSON(200, db.ratings);
    }

    if (url === '/api/ratings' && req.method === 'POST') {
      db.ratings.push(parsedBody);
      return sendJSON(200, { message: 'Rating submitted successfully' });
    }

    if (url.startsWith('/api/notifications')) {
      return sendJSON(200, []);
    }

    // Default Fallback
    return sendJSON(200, { message: 'Success', data: [] });
  });
});

server.listen(PORT, () => {
  console.log(`InsightCV Backend Server running on http://localhost:${PORT}`);
});
