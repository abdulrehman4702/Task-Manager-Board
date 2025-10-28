import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../../../components/Auth/AuthForm';
import api from '../../../utils/api';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useUIStore } from '../../../stores/useUIStore';

const Login = () => {
  const { login } = useAuthStore();
  const { showErrorAlert } = useUIStore();
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      login(response.data.user, response.data.token);
      navigate('/tasks');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      showErrorAlert(errorMessage);
      throw error;
    }
  };

  const bottomLink = (
    <p className="text-gray-600">
      Don't have an account?{' '}
      <Link to="/signup" className="text-blue-500 hover:underline">
        Sign up
      </Link>
    </p>
  );

  return (
    <AuthForm title="Login" onSubmit={handleLogin} submitText="Login" bottomLink={bottomLink} />
  );
};

export default Login;
