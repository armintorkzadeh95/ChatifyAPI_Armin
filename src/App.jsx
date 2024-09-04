import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './Register.jsx'
import Login from './Login.jsx'
import Chat from './Chat.jsx'
import SideNav from './SideNav.jsx'

function App() {
  return (
    <>
    <Router>
      <SideNav />
      <Routes>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/chat' element={<Chat/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App;
