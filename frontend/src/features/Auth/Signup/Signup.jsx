import { Link } from 'react-router-dom';
import AuthForm from '../../../components/Auth/AuthForm';
import api from '../../../utils/api';
import { useAuth } from '../../../hooks/useAuth';

const Signup = () => {
  const { login } = useAuth();

  const handleSignup = async (formData) => {
    const response = await api.post('/auth/register', {
      username: formData.username,
      email: formData.email,
      password: formData.password
    });

    login(response.data.user, response.data.token);
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
