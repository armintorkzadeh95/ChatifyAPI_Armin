import React from 'react';
import { useNavigate } from 'react-router-dom';

function SideNav() {
  const navigate = useNavigate();

  // Funktion för att logga ut
  const handleLogout = () => {
    localStorage.clear();
    alert('Du har loggats ut.');
    navigate('/login');
  };

  return (
    <div className="sidenav">
      <button onClick={handleLogout}>Logga ut</button>
    </div>
  );
};

export default SideNav;