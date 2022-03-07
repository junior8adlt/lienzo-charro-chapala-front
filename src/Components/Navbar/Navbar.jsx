import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/logo.png';

import './Navbar.css';
export const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className='nav-wrapper'>
        <Link to='/' className='brand-logo'>
          <img src={logo} alt='Carnaval Logo' />
        </Link>
        <ul className='navbar-items'>
          <li className='navbar-item'>
            <Link to='/'>Transferencias</Link>
          </li>
          <li className='navbar-item'>
            <Link to='/'>Ventas</Link>
          </li>
          <li className='navbar-item'>
            <Link to='/'>Gastos</Link>
          </li>
          <li className='navbar-item'>
            <Link to='/'>Productos</Link>
          </li>
          <li className='navbar-item'>
            <Link to='/'>Barras</Link>
          </li>
          <li className='navbar-item'>
            <Link to='/'>Inventarios</Link>
          </li>
          <li className='navbar-item'>
            <Link to='/'>Reportes</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
