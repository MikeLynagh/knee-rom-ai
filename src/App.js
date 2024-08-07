import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import MainMenu from './components/MainMenu/MainMenu';
import KneeAngleAnalysis from './components/KneeAngleAnalysis/KneeAngleAnalysis';
// import ProgressTracker from './components/ProgressTracker';
import { Auth } from './services/Auth';

const App = () => {
  const [user, setUser] = useState(Auth.getCurrentUser());

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <MainMenu />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/knee-angle" 
            element={
              <PrivateRoute>
                <KneeAngleAnalysis />
              </PrivateRoute>
            } 
          />
          {/* <Route 
            path="/progress" 
            element={
              <PrivateRoute>
                <ProgressTracker />
              </PrivateRoute>
            } 
          /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
