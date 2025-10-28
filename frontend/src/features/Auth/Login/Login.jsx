import { Link } from 'react-router-dom';
import AuthForm from '../../../components/Auth/AuthForm';
import api from '../../../utils/api';
import { useAuth } from '../../../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();

  const handleLogin = async (formData) => {
    const response = await api.post('/auth/login', {
      email: formData.email,
      password: formData.password
    });

    login(response.data.user, response.data.token);
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
