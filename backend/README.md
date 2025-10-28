# Task Board Backend

Node.js + Express backend with MongoDB, JWT authentication, and WebSocket support.

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5001
MONGODB_URI=
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
```

## Running

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks (Requires Authentication)
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## WebSocket Events

- `join-room` - Join user's room
- `task-created` -  task creation
- `task-updated` -  task update
- `task-deleted` -  task deletion
