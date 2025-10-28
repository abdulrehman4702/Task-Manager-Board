import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../../../components/Auth/AuthForm';
import api from '../../../utils/api';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useUIStore } from '../../../stores/useUIStore';

const Signup = () => {
  const { login } = useAuthStore();
  const { showErrorAlert } = useUIStore();
  const navigate = useNavigate();

  const handleSignup = async (formData) => {
    try {
      const response = await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      login(response.data.user, response.data.token);
      navigate('/tasks');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Signup failed. Please try again.';
      showErrorAlert(errorMessage);
      throw error;
    }
  };

  const bottomLink = (
    <p className="text-gray-600">
      Already have an account?{' '}
      <Link to="/login" className="text-blue-500 hover:underline">
        Login
      </Link>
    </p>
  );

  return (
    <AuthForm title="Sign Up" onSubmit={handleSignup} submitText="Sign Up" bottomLink={bottomLink} />
  );
};

export default Signup;
