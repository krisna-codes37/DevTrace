# DevTrace

> **Turn debugging problems into permanent engineering knowledge.**

DevTrace is a developer-focused debugging journal that helps you document, investigate, and learn from software bugs in a structured way.

Instead of solving a bug and forgetting what happened, DevTrace turns the entire debugging process into a traceable engineering record:

**Problem → Hypothesis → Experiment → Evidence → Root Cause → Solution → Lesson Learned**

---

## 🚀 Why DevTrace?

Debugging is often repetitive.

A developer encounters an error, tries multiple fixes, eventually solves it, and moves on. A few weeks later, the same or a similar problem appears again — and the entire investigation has to be repeated.

DevTrace is designed to prevent that.

It gives developers a structured place to record:

- What went wrong
- What they initially believed was causing the problem
- What experiments they performed
- What evidence they collected
- What the actual root cause was
- How they fixed it
- What they learned from the incident

Over time, DevTrace becomes a **personal debugging knowledge base**.

---

## ✨ Core Features

### 🐛 Debugging Sessions

Create a dedicated debugging session for every problem.

Each session can contain:

- Problem description
- Environment and project information
- Severity
- Status
- Tags
- Creation and update timestamps

---

### 💡 Hypotheses

Record possible explanations for the problem before jumping directly to a solution.

For example:

```text
Problem:
API requests are randomly returning 500 errors.

Hypothesis:
The database connection is being dropped during concurrent requests.
```

This makes the debugging process deliberate rather than trial-and-error.

---

### 🧪 Experiments

Test your hypotheses through structured experiments.

Each experiment can record:

- What was tested
- Why it was tested
- Expected result
- Actual result
- Status
- Related hypothesis

Example:

```text
Experiment:
Increase the database connection pool size.

Expected:
500 errors should decrease.

Result:
500 errors disappeared under load.

Conclusion:
Database connection limits were contributing to the problem.
```

---

### 🔎 Evidence

Attach observations and technical evidence to your investigation.

Examples include:

- Error messages
- Logs
- Stack traces
- API responses
- Console output
- Screenshots
- Performance observations
- Links to relevant resources

Evidence helps connect experiments to conclusions.

---

### 🎯 Root Cause

Once the investigation is complete, document the actual root cause.

This separates:

**What appeared to be wrong**

from

**What was actually wrong.**

---

### ✅ Solution

Document the final fix and the changes required to resolve the problem.

This creates a reusable record that can help when similar issues occur again.

---

### 📚 Lessons Learned

Every debugging session ends with the most important part:

**What should you remember next time?**

Capture:

- What you learned
- What you would do differently
- What could prevent the issue in the future
- Any best practices discovered during debugging

---

## 📊 Developer Dashboard

DevTrace will provide a dashboard to help developers understand their debugging activity over time.

The dashboard will provide insights such as:

- Total debugging sessions
- Open vs resolved problems
- Recent debugging activity
- Most common problem categories
- Frequently used technologies
- Debugging trends
- Resolution statistics

The goal is not just to store bugs, but to understand **how you debug**.

---

## 🧠 How DevTrace Works

A typical debugging workflow looks like this:

```text
┌─────────────┐
│   Problem   │
└──────┬──────┘
       ↓
┌─────────────┐
│  Hypothesis │
└──────┬──────┘
       ↓
┌─────────────┐
│ Experiment  │
└──────┬──────┘
       ↓
┌─────────────┐
│   Evidence  │
└──────┬──────┘
       ↓
┌─────────────┐
│  Root Cause │
└──────┬──────┘
       ↓
┌─────────────┐
│   Solution  │
└──────┬──────┘
       ↓
┌─────────────┐
│    Lesson   │
└─────────────┘
```

The objective is to preserve the **reasoning behind the fix**, not just the final answer.

---

# 🏗️ Architecture

DevTrace follows a full-stack MERN architecture.

```text
┌──────────────────────────┐
│        React Client      │
│      Vite + Tailwind     │
└────────────┬─────────────┘
             │
             │ REST API
             ↓
┌──────────────────────────┐
│      Node + Express      │
│       REST Backend       │
└────────────┬─────────────┘
             │
             │ Mongoose
             ↓
┌──────────────────────────┐
│         MongoDB          │
│       Application DB     │
└──────────────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- React Router
- Axios
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- Lucide React
- Recharts

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Zod
- Helmet
- CORS
- express-rate-limit

## Development Tools

- JavaScript
- npm Workspaces
- Git
- GitHub
- VS Code

---

# 📁 Project Structure

```text
DevTrace/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   └── app.js
│   │
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   ├── database.md
│   └── api.md
│
├── package.json
├── .gitignore
└── README.md
```

---

# 🔐 Authentication

DevTrace will use JWT-based authentication.

Users will be able to:

- Register
- Login
- Logout
- Access protected resources
- Maintain their own debugging sessions

Passwords will never be stored as plain text.

They will be securely hashed using **bcryptjs**.

Protected API routes will require valid authentication.

---

# 🗃️ Data Model

The initial product will revolve around the following entities:

```text
User
 │
 └── Debugging Sessions
        │
        ├── Hypotheses
        │
        ├── Experiments
        │
        ├── Evidence
        │
        ├── Root Cause
        │
        ├── Solution
        │
        └── Lessons Learned
```

Each debugging session represents one complete investigation.

---

# 🎨 Design Philosophy

DevTrace is designed specifically for developers.

The interface should be:

- Dark
- Minimal
- Modern
- Fast
- Responsive
- Information-dense without feeling cluttered

The UI should prioritize **developer workflows and technical information** rather than looking like a generic CRUD dashboard.

### Design principles

**Clarity over decoration**

Every element should have a purpose.

**Progressive disclosure**

Show important information first and detailed information when needed.

**Strong visual hierarchy**

Problems, hypotheses, experiments, evidence, and conclusions should be visually distinguishable.

**Developer-first UX**

The interface should feel familiar to developers who work with code, logs, terminals, Git, and issue trackers.

---

# 🚧 Current Status

DevTrace is currently under active development.

### Completed

- [x] Initial monorepo structure
- [x] Project architecture documentation
- [x] Initial database planning
- [x] API contract planning

### In Progress

- [ ] React frontend
- [ ] Express backend
- [ ] MongoDB integration
- [ ] Authentication
- [ ] Debugging session CRUD
- [ ] Hypothesis management
- [ ] Experiment management
- [ ] Evidence management
- [ ] Dashboard
- [ ] Responsive UI

---

# 🗺️ Roadmap

### Phase 1 — Foundation

- Project setup
- Frontend architecture
- Backend architecture
- MongoDB connection
- Environment configuration

### Phase 2 — Authentication

- User registration
- Login
- JWT authentication
- Protected routes
- Logout

### Phase 3 — Debugging Workflow

- Create debugging session
- Add hypotheses
- Add experiments
- Add evidence
- Record root cause
- Record solution
- Record lessons learned

### Phase 4 — Dashboard

- Debugging statistics
- Activity timeline
- Session status
- Technology breakdown
- Debugging trends

### Phase 5 — UX & Polish

- Responsive design
- Loading states
- Error states
- Form validation
- Empty states
- Accessibility improvements
- Performance optimization

---

# 🚫 Product Constraints

The initial version intentionally follows a few constraints:

- No AI functionality in the initial release.
- Use a real backend and MongoDB database.
- No fake/mock API data in the production workflow.
- Keep the product focused on debugging rather than becoming a generic project-management tool.
- Prioritize a clean developer experience over unnecessary features.

---

# 💻 Getting Started

## Prerequisites

Make sure you have:

- Node.js 20+
- npm 10+
- MongoDB

Check your versions:

```bash
node --version
npm --version
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/krisna-codes37/DevTrace.git
```

Move into the project:

```bash
cd DevTrace
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create the required environment files according to the project configuration.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Never commit real secrets or environment variables to GitHub.

---

# ▶️ Running the Project

Start the development environment using the project scripts:

```bash
npm run dev
```

The frontend and backend will run according to the configured workspace scripts.

---

# 🧪 Development Philosophy

DevTrace itself follows the same philosophy it promotes.

When implementing a feature or fixing a bug:

```text
Understand
   ↓
Form a hypothesis
   ↓
Run an experiment
   ↓
Collect evidence
   ↓
Identify root cause
   ↓
Implement solution
   ↓
Document the lesson
```

The project is intended to demonstrate not only **what was built**, but also **how engineering problems were investigated and solved**.

---

# 🤝 Contributing

Contributions are welcome.

If you want to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes.
5. Commit your changes.
6. Open a pull request.

Example:

```bash
git checkout -b feature/add-debugging-session
git add .
git commit -m "Add debugging session workflow"
git push origin feature/add-debugging-session
```

---

# 📄 License

This project is currently under development.

License information will be added before the first public release.

---

## DevTrace

**Debug once. Understand forever.**
