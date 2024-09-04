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
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl">ChatifyAPI</a>
      </div>
      <div className="navbar-center hidden lg:flex">
      </div>
      <div className="navbar-end">
        <button onClick={handleLogout} className="btn btn-warning ml-2">Logga ut</button>
      </div>
    </div>
  );
}

export default SideNav;