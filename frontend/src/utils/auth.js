// Authentication utility functions

const USER_KEY = 'insightcv_user';

export const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  return getUser() !== null;
};

export const getUserRole = () => {
  const user = getUser();
  return user ? user.role : null;
};

export const isCompany = () => {
  return getUserRole() === 'company';
};

export const isCandidate = () => {
  return getUserRole() === 'candidate';
};

export default {
  saveUser,
  getUser,
  removeUser,
  isAuthenticated,
  getUserRole,
  isCompany,
  isCandidate,
};
