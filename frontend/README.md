# Library Management System

AI-powered library management application built with React and Node.js.

## Features

- 📚 Book Management (Create, Read, Update, Delete)
- 🤖 AI Query Assistant (Natural Language Queries)
- 📊 AI Reading Summary
- 👥 User Management & Admin Panel
- 🔐 JWT Authentication
- 📱 Responsive Design

## Tech Stack

**Frontend:**
- React 18 + Vite
- React Router v6
- Axios
- Tailwind CSS

**Backend:**
- Node.js + Express
- PostgreSQL + Sequelize ORM
- JWT Authentication
- Groq AI (Llama 3.3-70B)
- Bcrypt for password hashing

## Live Demo

- **Frontend:** [Coming soon]
- **Backend API:** [Coming soon]

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Groq API Key

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=library_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your-secret-key-min-32-characters
JWT_EXPIRE=30d

GROQ_API_KEY=your-groq-api-key
```

Run: 
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

- **Frontend:** Netlify
- **Backend:** Railway
- **Database:** Railway PostgreSQL

## Author

Ritech Internship Project 2025

