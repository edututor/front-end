import axios from '../utils/axiosInstance';

const API_URL = 'http://127.0.0.1:8080/auth';

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const signup = async (first_name, last_name, email, password) => {
  return await axios.post(`${API_URL}/signup`, { first_name, last_name, email, password });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export default { login, signup, logout, getCurrentUser };
