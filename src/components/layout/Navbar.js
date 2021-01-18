import React, { useState, useCallback } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import '../../styles/layout/Header.scss'
import { FaTimes, FaBars } from 'react-icons/fa'
import { LoginModal } from './LoginModal'

export default function Navbar() {
  const router = useHistory()
  const searchQuestions = (e) => {
    if (e.code === 'Enter' && searchValue !== '') {
      // 시큐어 코딩 필요
      router.push({
        pathname: '/searched',
        search: `?query=${searchValue}`,
      })
    }
  }
  // useSelector: 리덕스 스토어의 상태를 조회하는 hooks.
  // state 의 값은 리덕스 스토에다가 getState() 를 호출했을때 나오는 값과 같음.
  const { userID, userNickname, loginState } = useSelector((state) => {
    console.log('useSelector:')
    return {
      loginState: state.auth.loginState,
      userID: state.auth.userID,
      userNickname: state.auth.userNickname,
    }
  })

  //const loginState = JSON.parse(
  //  localStorage.getItem(
  //    'FE37F882DCF4A30642E6B59D595F0760B0F1C3FE86F466922270B61E6D09106D'
  //  )
  //)

  // useCallback : 함수의 불필요한 리렌더링을 막기 위한 hooks.
  // react 는 컴포넌트가 리렌더링되면 함수도 새로 생기는데, 반복적으로 사용하는 함수를 리렌더링 하지 않고 재사용하기 위함.

  const [menuClick, setMenuClick] = useState(false)

  const handleMenuClick = () => setMenuClick(!menuClick)
  const closeMobileMenu = () => setMenuClick(false)

  const [searchValue, setSearchValue] = useState('')

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
              <input
                className="header-search-input"
                placeholder="Search..."
                value={searchValue}
                onKeyPress={(e) => {
                  searchQuestions(e)
                }}
                onChange={(e) => {
                  setSearchValue(e.target.value)
                }}
              />
            </div>
            <div className="auth-container">
              {loginState ? (
                <div className="mypage-container">
                  <NavLink
                    to={`/user/${userID}`}
                    className="navbar-item-link"
                    onChange={() => {}}
                  >
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
  )
}
