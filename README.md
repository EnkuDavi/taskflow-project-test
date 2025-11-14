# TaskFlow Project – Take Home Test

This monorepo provides a minimal fullstack setup using:

- **Backend**: Bun + Elysia.js + Prisma + PostgreSQL  
- **Frontend**: React + TypeScript + Vite  
- **Auth**: JWT (1 hour expiry)  
- **Features**: Login, Register, Task CRUD, Pagination, Search

The goal is to keep the architecture clean, modular, and easy to extend.

---

## 📦 Tech Stack

### Backend
- Bun
- Elysia.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Valibot Validation
- @elysiajs/swagger
- @elysiajs/cors

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS (optional)

---

## 🗂 Project Structure

```
taskflow-project-test/
│
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   └── tasks/
│   │   ├── common/
│   │   ├── plugins/
│   │   └── index.ts
│   │
│   ├── prisma/
│   ├── package.json
│   ├── bun.lockb
│   ├── tsconfig.json
│   └── .env.example
│
└── frontend/
    ├── src/
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── .env.example

```


## ⚙️ Backend Setup

```bash
cd backend
bun install
```
Create .env:
```bash
PORT=3000
DATABASE_URL="postgresql://user:pass@localhost:5432/taskflow"
JWT_SECRET="your_secret_key"
```
Prisma setup:
```bash
bunx prisma generate
bunx prisma migrate dev
```
Start server:
```bash
bun dev
```

Backend runs at:
```bash
http://localhost:3000
```

Swagger UI:
```bash
http://localhost:3000/docs
```

## 💻 Frontend Setup
```bash
cd frontend
bun install
```
Create .env:
```bash
VITE_API_URL=http://localhost:3000
```
Start dev server:
```bash
bun dev
```
Frontend runs at:
```
http://localhost:5173
```
🔐 API Overview
Auth
```bash
Method	Endpoint	Description
POST	/auth/register	Register user
POST	/auth/login	Login user
```

Tasks
```bash
Method	Endpoint	Description
GET	/tasks	List tasks (pagination + search)
POST	/tasks	Create task
GET	/tasks/:id	Detail task
PATCH	/tasks/:id	Update task
DELETE	/tasks/:id	Delete task
```
🔎 Pagination & Search
Example query:
```bash
GET /tasks?page=1&limit=10&search=meeting
```
Example response:
```bash
{
  "success": true,
  "message": "Request successful",
  "data": [],
  "meta": {
    "total": 0,
    "currentPage": 1,
    "lastPage": 1,
    "limit": 10
  }
}
```
🧪 React API Client Example
```bash
const API_URL = import.meta.env.VITE_API_URL

export async function api(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token")

  return fetch(API_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {})
    }
  }).then(res => res.json())
}
```
📝 Notes

Backend and frontend are separated but live in the same repository
Pagination and search implemented via a reusable helper
JWT tokens expire in 1 hour

👨‍💻 Author

Eko Purnomo
ekopur05@gmail.com
