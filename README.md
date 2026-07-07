# Hostel Management Agent

## Project Overview

The Hostel Management Agent is an AI-powered web application designed to simplify hostel management. It provides separate portals for students and wardens, allowing students to register, submit complaints, and interact with an AI chatbot, while wardens can manage complaints and update their status.

---

## Features

### Student Module
- Student Registration
- Student Login
- View Dashboard
- Submit Complaints
- Track Complaint Status
- AI Chatbot for Hostel Queries

### Warden Module
- Warden Login
- View Student Complaints
- Update Complaint Status
- Manage Hostel Requests

### AI Chatbot
- Answers hostel-related questions
- Provides instant responses using Google Gemini API

---

## Tech Stack

### Frontend
- React
- TypeScript
- HTML5
- CSS3
- JavaScript
- Vite

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- MongoDB

### AI Integration
- Google Gemini API

### Deployment
- Google Cloud Run

---

## Project Architecture

```
Student/Warden
       │
       ▼
React Frontend
       │
       ▼
Node.js + Express.js Backend
       │
 ┌─────┴─────┐
 ▼           ▼
MongoDB   Gemini API
       │
       ▼
Response to User
```

---

## Folder Structure

```
hostel-management-agent/
│
├── src/                  # React source code
├── assets/               # Images and static files
├── data/                 # Sample data
├── dist/                 # Production build
├── server.ts             # Backend server
├── package.json          # Project dependencies
├── package-lock.json
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── index.html            # Main HTML page
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone <repository-url>
```

### Navigate to the Project

```bash
cd hostel-management-agent
```

### Install Dependencies

```bash
npm install
```

### Create Environment File

Create a `.env` file and add:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## How It Works

1. Student or Warden logs into the system.
2. The React frontend sends requests to the backend.
3. The Node.js + Express.js server processes the requests.
4. MongoDB stores and retrieves user and complaint data.
5. The Gemini API generates AI chatbot responses.
6. Results are displayed on the frontend.

---

## Advantages

- Reduces paperwork
- Digital complaint management
- Separate student and warden portals
- AI-powered hostel assistant
- Secure login system
- Complaint tracking
- Faster communication

---

## Future Enhancements

- Hostel fee payment
- Leave management
- Email notifications
- SMS alerts
- QR-based attendance
- Mobile application

Link : https://hostel-management-agent-7apn.onrender.com
