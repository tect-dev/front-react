import React, { useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import '../../styles/layout/Header.scss'
import { FaTimes, FaBars } from 'react-icons/fa'
import { LoginModal } from './LoginModal'

export default function Header() {
  // useSelector: 리덕스 스토어의 상태를 조회하는 hooks.
  // state 의 값은 리덕스 스토에다가 getState() 를 호출했을때 나오는 값과 같음.
  const { loginState, userID, userNickname } = useSelector((state) => {
    return {
      loginState: state.auth.loginState,
      userID: state.auth.userID,
      userNickname: state.auth.userNickname,
    }
  })

  // useDispatch : 리덕스 스토어의 dispatch 를 함수에서 쓸 수 있게 해주는 hooks.
  const dispatch = useDispatch()

  // useCallback : 함수의 불필요한 리렌더링을 막기 위한 hooks.
  // react 는 컴포넌트가 리렌더링되면 함수도 새로 생기는데, 반복적으로 사용하는 함수를 리렌더링 하지 않고 재사용하기 위함.

  const [menuClick, setMenuClick] = useState(false)

  const handleMenuClick = () => setMenuClick(!menuClick)
  const closeMobileMenu = () => setMenuClick(false)

  const [isAuth, setIsAuth] = useState(true)

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <NavLink to="/" className="logo">
            Tect.dev
          </NavLink>
        </div>
        <div className="menu-icon" onClick={handleMenuClick}>
          {menuClick ? <FaTimes /> : <FaBars />}
        </div>
        <nav className="navbar">
          <ul
            className={
              menuClick ? 'navbar-container clicked' : 'navbar-container'
            }
          >
            <li className="navbar-item">
              <NavLink to="/question" className="navbar-item-link">
                Q {`\&`} A
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink to="/article" className="navbar-item-link">
                Article
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink to="/freeboard" className="navbar-item-link">
                Freeboard
              </NavLink>
            </li>
            <div className="header-search">
              <input className="header-search-input" placeholder="Search..." />
            </div>
            <div className="auth-container">
              {loginState ? (
                <div className="mypage-container">
                  <NavLink to={`/user/${userID}`} className="navbar-item-link">
                    MyPage
                  </NavLink>
                </div>
              ) : (
                <div className="login-container">
                  <input
                    className="login-modal-input"
                    type="checkbox"
                    id="login-popup"
                  />
                  <label htmlFor="login-popup" className="login-modal-btn">
                    Login
                  </label>
                  <LoginModal labelFor="login-popup" />
                </div>
              )}
            </div>
          </ul>
        </nav>
      </div>
    </header>
    // <>
    //   <nav className="navbar">
    //     <div className="nav-container">
    //       <Link to="/" className="navbar-logo">
    //         Tect.dev
    //       </Link>
    //       <div className="menu-icon" onClick={handleMenuClick}>
    //         {menuClick ? <FaTimes /> : <FaBars />}
    //       </div>
    //       <ul className={menuClick ? 'nav-menu active' : 'nav-menu'}>
    //         <li className="nav-item">
    //           <Link
    //             to="/question"
    //             className="nav-links"
    //             onClick={closeMobileMenu}
    //           >
    //             QnA
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/article"
    //             className="nav-links"
    //             onClick={closeMobileMenu}
    //           >
    //             Article
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <Link
    //             to="/freeboard"
    //             className="nav-links"
    //             onClick={closeMobileMenu}
    //           >
    //             Freeboard
    //           </Link>
    //         </li>
    //         <li className="nav-item" id="input-container">
    //           <div className="input-container">
    //             <input />
    //           </div>
    //         </li>
    //         <li className="nav-item">
    //           {loginState ? (
    //             <Link
    //               to="/user/userID"
    //               className="nav-links"
    //               onClick={closeMobileMenu}
    //             >
    //               MyPage
    //             </Link>
    //           ) : (
    //             <div className="nav-btns">
    //               <Button buttonStyle="btn--outline">Login</Button>
    //             </div>
    //           )}
    //         </li>
    //         <li className="nav-item">
    //           <button onClick={onLogin}>임시 로그인 테스트용 버튼</button>
    //         </li>
    //       </ul>
    //     </div>
    //   </nav>
    // </>
  )
}
