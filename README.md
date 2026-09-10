# InterviewOS

InterviewOS is a full-stack AI-powered interview preparation platform that helps students and developers practice realistic technical and behavioral interviews, receive personalized feedback, and track their progress over time.

## 🚀 Features

* 🔐 User authentication
* 🎯 Customized interview creation
* 🤖 AI-generated interview questions
* 💬 Interactive interview experience
* 📊 AI-powered answer evaluation
* 📈 Interview performance analytics
* 📝 Interview history and progress tracking
* 📄 Resume-based personalized questions

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

### Backend

* Next.js API Routes
* Server Actions
* REST APIs

### Database

* PostgreSQL
* Prisma ORM

### AI

* LLM API
* Structured AI outputs

### Cloud

* Vercel
* Cloud object storage

## 🏗️ Architecture

```text
User
  │
  ▼
Next.js Application
  │
  ├───────────────┐
  ▼               ▼
PostgreSQL       AI API
  │
  ▼
Interview Data

  │
  ▼
Cloud Storage
(Resume Files)
```

## 🔄 Core User Flow

```text
Sign Up
   ↓
Dashboard
   ↓
Create Interview
   ↓
Configure Role, Topics & Difficulty
   ↓
Generate Questions
   ↓
Start Interview
   ↓
Submit Answers
   ↓
AI Evaluation
   ↓
View Results
   ↓
Track Progress
```

## 🗄️ Core Data Models

```text
User
 │
 ├── Resume
 │
 └── Interview
       │
       └── InterviewQuestion
              │
              └── Answer
                     │
                     └── Evaluation
```

## 🎯 Project Goals

InterviewOS is being built as a production-oriented full-stack application to demonstrate:

* Full-stack development
* Backend and API design
* Relational database design
* Authentication and authorization
* AI integration
* Cloud deployment
* Data validation and security
* Product development

## 📌 Project Status

🚧 **In Development**

### Current Progress

* [x] Next.js project setup
* [x] TypeScript setup
* [x] Tailwind CSS setup
* [ ] Database setup
* [ ] Prisma setup
* [ ] Authentication
* [ ] Interview creation
* [ ] AI question generation
* [ ] Interview room
* [ ] AI evaluation
* [ ] Results dashboard
* [ ] Analytics
* [ ] Resume personalization
* [ ] Production deployment

## 👩‍💻 Author

Built as a full-stack engineering portfolio project.
