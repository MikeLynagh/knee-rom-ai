import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenu = () => {

  const navigate = useNavigate();

  return (
    <div className="main-menu">
      <h1>Knee Rehabilitation App</h1>
      <button onClick={() => navigate('/knee-angle')}>Analyse Knee Angle</button>
       {/* <button onClick={() => navigate('/squat')}>Analyse Squat</button> */}
     </div>
       );
};

export default MainMenu;