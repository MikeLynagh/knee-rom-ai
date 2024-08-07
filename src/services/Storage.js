// src/services/storage.js
export const progressTracker = {
  saveProgress: (username, date, maxFlexion, maxExtension) => {
    const progress = JSON.parse(localStorage.getItem('progress')) || {};
    if (!progress[username]) {
      progress[username] = [];
    }
    progress[username].push({ date, maxFlexion, maxExtension });
    localStorage.setItem('progress', JSON.stringify(progress));
  },
  getProgress: (username) => {
    const progress = JSON.parse(localStorage.getItem('progress')) || {};
    return progress[username] || [];
  }
};