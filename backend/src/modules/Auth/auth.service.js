import { User } from './auth.model.js';
import { hashPassword, comparePassword, generateToken } from './auth.utils.js';

export const registerUser = async (username, email, password) => {
  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);
  const user = new User({
    username,
    email,
    password: hashedPassword
  });

  await user.save();
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    },
    token
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    },
    token
  };
};
