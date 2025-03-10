import axios from '../utils/axiosInstance';

const REACT_APP_USER_AUTH_URL = `${process.env.REACT_APP_USER_AUTH_URL}/auth`;

const login = async (email, password) => {
  const response = await axios.post(`${REACT_APP_USER_AUTH_URL}/login`, { email, password });

  if (response.data.access_token) {
    localStorage.setItem('user', JSON.stringify(response.data)); // Save { user, access_token, token_type }
  }
  return response.data;
};

const signup = async (first_name, last_name, email, password) => {
  console.log(`Sending the request to signup to: ${REACT_APP_USER_AUTH_URL}/signup`)
  return await axios.post(`${REACT_APP_USER_AUTH_URL}/signup`, { first_name, last_name, email, password });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = { login, signup, logout, getCurrentUser };

export default authService; // Proper named export
