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

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="navbar bg-base-100" 
    style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }}>
      <div className="navbar-start">
        <a className="text-xl px-3 text-white">ChatifyAPI</a>
      </div>
      <div className="navbar-center hidden lg:flex">
      </div>
      <div className="navbar-end px-3">
      <button onClick={handleHome} className="btn btn-warning ml-4">Home</button>
      <button onClick={handleLogout} className="btn btn-warning ml-2 ">Log out</button>
      </div>
    </div>
  );
}

export default SideNav;