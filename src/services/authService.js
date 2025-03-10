import axios from '../utils/axiosInstance';

const USER_AUTH_URL = `${process.env.USER_AUTH_URL}/auth`;

const login = async (email, password) => {
  const response = await axios.post(`${USER_AUTH_URL}/login`, { email, password });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const signup = async (first_name, last_name, email, password) => {
  return await axios.post(`${USER_AUTH_URL}/signup`, { first_name, last_name, email, password });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = { login, signup, logout, getCurrentUser };

export default authService; // Proper named export
