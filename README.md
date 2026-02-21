# Todo List - Fullstack Example

A simple fullstack Todo app built with:

- Frontend: React + Vite
- Backend: Express + Mongoose
- Database: MongoDB

## Project Structure

```text
TodoList/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── routes/taskRoutes.js
│   │   ├── controllers/taskController.js
│   │   └── models/Task.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## How It Works

1. The frontend sends HTTP requests to `http://localhost:3002/api/tasks`.
2. Express routes map requests to controller functions.
3. Controllers use the `Task` Mongoose model.
4. MongoDB stores and returns task documents.

## Prerequisites

- Node.js 18+
- npm
- MongoDB running on `mongodb://localhost:27017`

## Run Locally

### 1. Start MongoDB

If installed locally:

```bash
mongod
```

Or with Docker:

```bash
docker run -d -p 27017:27017 --name mongo-todo mongo
```

### 2. Start backend (port 3002)

```bash
cd backend
npm install
npm run dev
```

Health check:

```bash
curl http://localhost:3002/health
```

### 3. Start frontend (Vite dev server)

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open the URL shown by Vite (usually `http://localhost:5173`).

## API Endpoints

Base URL: `http://localhost:3002/api/tasks`

- `GET /` - Get all tasks
- `POST /` - Create a task
- `PUT /:id` - Update a task
- `DELETE /:id` - Delete a task

### Example requests

Create a task:

```bash
curl -X POST http://localhost:3002/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My first task"}'
```

List tasks:

```bash
curl http://localhost:3002/api/tasks
```

## Notes

- Backend port is `3002`.
- Frontend calls are configured in `frontend/src/App.jsx`.
- MongoDB database name used by backend is `todo_app`.
