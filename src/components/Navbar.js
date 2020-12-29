import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'
import { FaTimes, FaBars } from 'react-icons/fa'
import { Button } from './Button'

export default function Navbar() {
  const user = false;
  const [ menuClick, setMenuClick ] = useState(false)

  const handleMenuClick = () => setMenuClick(!menuClick)
  const closeMobileMenu = () => setMenuClick(false)
  return (
    <>
      <nav className='navbar'>
        <div className='nav-container'>
          <Link to="/" className='navbar-logo'>
            Tect.dev
          </Link>
          <div className='menu-icon' onClick={handleMenuClick}>
            { menuClick ? <FaTimes/> : <FaBars/>}
          </div>
          <ul className={menuClick ?  'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to="/about" className='nav-links' onClick={closeMobileMenu}>
                About
              </Link>
            </li>
            <li className='nav-item'>
              <Link to="/question" className='nav-links' onClick={closeMobileMenu}>
                QnA
              </Link>
            </li>
            <li className='nav-item'>
              <Link to="/article" className='nav-links' onClick={closeMobileMenu}>
                Article
              </Link>
            </li>
            <li className='nav-item'>
              <Link to="/freeboard" className='nav-links' onClick={closeMobileMenu}>
                Freeboard
              </Link>
            </li>
            <li className='nav-item' id='input-container'>
              <div className="input-container">
                <input />
              </div>
            </li>
                <li className='nav-item'>
                  {user ? (
                    <Link to="/mypage" className='nav-links' onClick={closeMobileMenu}>
                      MyPage
                  </Link>
                  ) : (
                    <div className='nav-btns'>
                      <Button buttonStyle="btn--outline">
                        Login
                      </Button>
                    </div>
                  )}
                </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
