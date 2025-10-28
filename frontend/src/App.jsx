import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './features/Auth/Login/Login';
import Signup from './features/Auth/Signup/Signup';
import TaskBoard from './features/Tasks/TaskBoard/TaskBoard';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;