import React from 'react';
import { Link } from 'react-router-dom';
export default function Navbar(){ return (
  <header className='container navbar'>
    <div className='brand'><Link to='/' style={{color:'inherit',textDecoration:'none'}}>Cinemate</Link></div>
    <nav className='nav-links'>
      <Link to='/'>Home</Link>
      <Link to='/movies'>Movies</Link>
    </nav>
  </header>
)}
