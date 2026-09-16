# InterviewOS

**InterviewOS** is a full-stack AI-powered interview preparation platform designed to help students and developers practice realistic technical and behavioral interviews, receive personalized AI feedback, and track their performance over time.

> 🚧 InterviewOS is currently under active development.

---

## ✨ Features

* 🔐 **User Authentication**

  * Secure signup and login
  * Password hashing with bcrypt
  * Session-based authentication with Auth.js

* 🎯 **Customized Interviews**

  * Select target role
  * Choose interview type
  * Choose difficulty level
  * Generate personalized interview sessions

* 🤖 **AI-Powered Question Generation**

  * Generates interview questions based on role, type, and difficulty
  * Structured AI responses
  * Powered by Groq

* 💬 **Interactive Interview Sessions**

  * Question-by-question interview experience
  * Answer submission
  * Interview progress tracking

* 📊 **AI-Powered Evaluation**

  * Answer scoring
  * Personalized feedback
  * Strengths and weaknesses
  * Overall interview performance

* 📈 **Performance Dashboard**

  * Total interviews
  * Completed interviews
  * Average score
  * Completion rate
  * Recent interview history

* 👤 **User-Specific Data**

  * Each user sees only their own interviews
  * Interviews are linked to authenticated users
  * Protected server-side actions

* 📄 **Resume Personalization**

  * Planned support for resume-based interview questions

---

## 📸 Screenshots

### 🏠 Dashboard

![InterviewOS Dashboard](./screenshots/dashboard.png)

---

### 🔐 Authentication

#### Login

![InterviewOS Login](./screenshots/login.png)

#### Sign Up

![InterviewOS Signup](./screenshots/signup.png)

---

### 🎯 Create Interview

![Create Interview](./screenshots/create-interview.png)

---

### 🎤 Interview Session

![Interview Session](./screenshots/interview-session.png)

---

### 📊 Interview Results

![Interview Results](./screenshots/interview-results.png)

---

### 📈 Interview History

![Interview History](./screenshots/interview-history.png)

> Screenshots will be updated as new features are added.

---

## 🛠️ Tech Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui

### Backend

* Next.js Server Actions
* Next.js API Routes
* Auth.js
* bcrypt

### Database

* PostgreSQL
* Prisma ORM
* Neon PostgreSQL

### AI

* Groq API
* Structured AI outputs
* LLM-powered question generation and evaluation

### Deployment

* Vercel
* Neon

---

## 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    Next.js App   │
                         │ React + TypeScript│
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
             ┌──────────────┐           ┌──────────────┐
             │    Auth.js   │           │   Groq API   │
             │ Authentication│           │   AI Layer   │
             └──────┬───────┘           └──────┬───────┘
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Prisma ORM       │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Neon PostgreSQL  │
                         └──────────────────┘
```

---

## 🔄 Core User Flow

```text
Sign Up
   ↓
Login
   ↓
Dashboard
   ↓
Create Interview
   ↓
Select Role + Type + Difficulty
   ↓
AI Generates Questions
   ↓
Start Interview
   ↓
Answer Questions
   ↓
Submit Interview
   ↓
AI Evaluates Answers
   ↓
View Results
   ↓
Track Performance
```

---

## 🗄️ Data Model

```text
User
 │
 └── Interview
       │
       ├── InterviewQuestion
       │       │
       │       └── Answer
       │
       └── InterviewResult
```

### Main Models

| Model               | Purpose                                         |
| ------------------- | ----------------------------------------------- |
| `User`              | Stores registered users and authentication data |
| `Interview`         | Stores interview configuration and status       |
| `InterviewQuestion` | Stores AI-generated interview questions         |
| `Answer`            | Stores user responses and evaluation data       |
| `InterviewResult`   | Stores overall interview performance            |

---

## 🔐 Authentication Flow

```text
User
 │
 ├── Sign Up
 │      ↓
 │   Password Hash
 │      ↓
 │   PostgreSQL
 │
 └── Login
        ↓
     Auth.js
        ↓
   JWT Session
        ↓
   session.user.id
        ↓
 User-specific data
```

Interviews are associated with the authenticated user's ID rather than relying on a global or first-created user.

---

## 📁 Project Structure

```text
interview-os/
│
├── app/
│   ├── actions/
│   │   ├── answer-actions.ts
│   │   ├── ai-actions.ts
│   │   ├── evaluation-actions.ts
│   │   ├── interview-actions.ts
│   │   ├── question-actions.ts
│   │   └── user-actions.ts
│   │
│   ├── components/
│   │   ├── create-interview-form.tsx
│   │   └── ...
│   │
│   ├── interview/
│   │   ├── new/
│   │   └── [id]/
│   │       ├── session/
│   │       └── result/
│   │
│   ├── interviews/
│   │   └── page.tsx
│   │
│   ├── login/
│   ├── signup/
│   │
│   ├── [...nextauth]/
│   │
│   └── page.tsx
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── lib/
│   └── prisma.ts
│
├── auth.ts
├── prisma.config.ts
├── next.config.ts
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd interview-os
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your-neon-database-url"

AUTH_SECRET="your-auth-secret"

GROQ_API_KEY="your-groq-api-key"
```

> Never commit your `.env` file or expose API keys publicly.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🧪 Build

To verify the production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

## ☁️ Deployment

InterviewOS is designed to be deployed using:

```text
Vercel
   │
   ├── Next.js Application
   │
   └── Environment Variables
          │
          ├── DATABASE_URL
          ├── AUTH_SECRET
          └── GROQ_API_KEY

Neon
   │
   └── PostgreSQL Database
```

The application uses Prisma Client generation during the production build.

---

## 🎯 Project Goals

InterviewOS is being built as a production-oriented full-stack engineering project to demonstrate:

* Full-stack application development
* Modern React and Next.js architecture
* Authentication and authorization
* Server-side application logic
* Relational database design
* Prisma ORM
* AI/LLM integration
* Structured AI outputs
* Secure data access
* Cloud deployment
* Production-oriented development practices
* Building a complete user-facing product

---

## 🗺️ Roadmap

### Core Platform

* [x] Next.js project setup
* [x] TypeScript setup
* [x] Tailwind CSS
* [x] PostgreSQL database
* [x] Prisma ORM
* [x] Neon database
* [x] User authentication
* [x] User-specific dashboards
* [x] Interview creation
* [x] AI question generation
* [x] Interactive interview session
* [x] Answer submission
* [x] AI evaluation
* [x] Interview results
* [x] Interview history
* [x] Vercel deployment

### Upcoming

* [ ] Resume upload
* [ ] Resume-based question generation
* [ ] Advanced performance analytics
* [ ] Question categories and filtering
* [ ] Interview difficulty adaptation
* [ ] Improved evaluation system
* [ ] Interview recommendations
* [ ] UI/UX refinement
* [ ] Mobile responsiveness improvements
* [ ] Automated testing
* [ ] Production monitoring

---

## 🔮 Future Vision

InterviewOS aims to become a complete interview preparation workspace where users can:

```text
Upload Resume
      ↓
Analyze Skills
      ↓
Generate Personalized Interview
      ↓
Practice
      ↓
Receive AI Feedback
      ↓
Identify Weak Areas
      ↓
Practice Again
      ↓
Track Improvement
```

The goal is to combine **full-stack engineering, AI-assisted learning, and meaningful performance tracking** into one practical platform.

---

## 👩‍💻 Author

**Soha Ratnam**

B.Tech Computer Science Engineering

Built as a full-stack engineering portfolio project.

---

## 📌 Project Status

**🚧 Active Development**

More features, improvements, and production refinements are being added continuously.

````

### 📸 For the screenshots

Create this folder in your project:

```text
interview-os/
└── screenshots/
    ├── dashboard.png
    ├── login.png
    ├── signup.png
    ├── create-interview.png
    ├── interview-session.png
    ├── interview-results.png
    └── interview-history.png
````

Then you just put your screenshots there with those exact filenames. GitHub will automatically render them in the README.

**One thing I intentionally changed:** the old README said Database, Authentication, Interview Creation, AI, etc. were still `[ ]`. Since you've now implemented those pieces, the new README reflects your **actual current project state** rather than the original plan.
