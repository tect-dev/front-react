import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/auth';
import '../styles/Navbar.css';
import { FaTimes, FaBars } from 'react-icons/fa';
import { Button } from './Button';

export default function Navbar() {
  // useSelector: 리덕스 스토어의 상태를 조회하는 hooks.
  // state 의 값은 리덕스 스토에다가 getState() 를 호출했을때 나오는 값과 같음.
  const { loginState, userInfo } = useSelector((state) => {
    return { loginState: state.auth.loginState, userInfo: state.auth.user };
  });

  // useDispatch : 리덕스 스토어의 dispatch 를 함수에서 쓸 수 있게 해주는 hooks.
  const dispatch = useDispatch();

  // useCallback : 함수의 불필요한 리렌더링을 막기 위한 hooks.
  // react 는 컴포넌트가 리렌더링되면 함수도 새로 생기는데, 반복적으로 사용하는 함수를 리렌더링 하지 않고 재사용하기 위함.
  const onLogin = useCallback(() => {
    dispatch(loginSuccess());
  }, [dispatch]);

  const [menuClick, setMenuClick] = useState(false);

  const handleMenuClick = () => setMenuClick(!menuClick);
  const closeMobileMenu = () => setMenuClick(false);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="navbar-logo">
            Tect.dev
          </Link>
          <div className="menu-icon" onClick={handleMenuClick}>
            {menuClick ? <FaTimes /> : <FaBars />}
          </div>
          <ul className={menuClick ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item">
              <Link to="/about" className="nav-links" onClick={closeMobileMenu}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/question"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                QnA
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/article"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Article
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/freeboard"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Freeboard
              </Link>
            </li>
            <li className="nav-item" id="input-container">
              <div className="input-container">
                <input />
              </div>
            </li>
            <li className="nav-item">
              {loginState ? (
                <Link
                  to="/mypage"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  MyPage
                </Link>
              ) : (
                <div className="nav-btns">
                  <Button buttonStyle="btn--outline">Login</Button>
                </div>
              )}
            </li>
            <li className="nav-item">
              <button onClick={onLogin}>임시 로그인 테스트용 버튼</button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
