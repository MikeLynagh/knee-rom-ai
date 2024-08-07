import React, { useEffect, useState } from 'react';
import { progressTracker } from '../services/Storage';
import { auth } from '../services/Auth';

const ProgressTracker = () => {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const username = auth.getCurrentUser();
    if (username) {
      const userProgress = progressTracker.getProgress(username);
      setProgress(userProgress);
    }
  }, []);

  return (
    <div className="progress-tracker">
      <h2>Your Progress</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Max Flexion</th>
            <th>Max Extension</th>
          </tr>
        </thead>
        <tbody>
          {progress.map((entry, index) => (
            <tr key={index}>
              <td>{new Date(entry.date).toLocaleDateString()}</td>
              <td>{entry.maxFlexion}°</td>
              <td>{entry.maxExtension}°</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProgressTracker;