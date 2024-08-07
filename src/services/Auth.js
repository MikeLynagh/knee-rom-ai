// src/services/auth.js
export const Auth = {
    login: (username, password) => {
      const users = JSON.parse(localStorage.getItem('users')) || {};
      if (users[username] && users[username] === password) {
        localStorage.setItem('currentUser', username);
        return true;
      }
      return false;
    },
    signup: (username, password) => {
      const users = JSON.parse(localStorage.getItem('users')) || {};
      if (users[username]) {
        return false; // User already exists
      }
      users[username] = password;
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    },
    logout: () => {
      localStorage.removeItem('currentUser');
    },
    getCurrentUser: () => {
      return localStorage.getItem('currentUser');
    }
  };