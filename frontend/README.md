# Task Board Frontend

React + Vite frontend with TailwindCSS, featuring real-time updates via Socket.io.

## Installation

```bash
npm install
```

## Environment Variables

The `.env` file is already configured with default values:

```
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

## Running

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

- `features/` - Feature-based components (Auth, Tasks)
- `components/` - Reusable components
- `hooks/` - Custom React hooks (useAuth, useSocket)
- `utils/` - API configuration and utilities

## Features

- JWT authentication with localStorage
- Real-time task synchronization
- Task status management (Todo, In Progress, Done)
- Protected routes
- Responsive design with TailwindCSS