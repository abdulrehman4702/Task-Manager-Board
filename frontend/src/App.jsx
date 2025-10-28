import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { useAuthInit } from './hooks/useAuthInit';
import Login from './features/Auth/Login/Login';
import Signup from './features/Auth/Signup/Signup';
import TaskBoard from './features/Tasks/TaskBoard/TaskBoard';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <TaskBoard />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
}

function App() {
  useAuthInit();
  
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;