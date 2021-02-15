import React, { useState, useCallback } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import '../../styles/layout/Header.scss'
import {
  FaTimes,
  FaBars,
  FaSearch,
  FaUserAlt,
  FaQuestion,
} from 'react-icons/fa'
import { LoginModal } from './LoginModal'
import styled from 'styled-components'

export default function Navbar() {
  const router = useHistory()
  const searchQuestions = (e) => {
    if (e.code === 'Enter' && searchValue !== '') {
      // 시큐어 코딩 필요
      router.push({
        pathname: `/searched/${searchValue}/1`,
        // 기존 쿼리 방식 삭제
        // search: `?query=${searchValue}`,
      })
    }
  }
  const userInfo = JSON.parse(localStorage.getItem('user'))

  const { userID, userNickname, loginState, userPlace } = useSelector(
    (state) => {
      return {
        userID: state.auth.userID,
        userNickname: state.auth.userNickname,
        loginState: state.auth.loginState,
        userPlace: state.auth.userPlace,
      }
    }
  )

  // useCallback : 함수의 불필요한 리렌더링을 막기 위한 hooks.
  // react 는 컴포넌트가 리렌더링되면 함수도 새로 생기는데, 반복적으로 사용하는 함수를 리렌더링 하지 않고 재사용하기 위함.

  const [menuClick, setMenuClick] = useState(false)
  const [searchClick, setSearchClick] = useState(false)

  const handleMenuClick = () => setMenuClick(!menuClick)
  const closeMobileMenu = () => setMenuClick(false)

  const [searchValue, setSearchValue] = useState('')

  const popupMobileSearch = (e) => {
    setSearchClick(!searchClick)
  }

  return (
    <header className="header">
      <MobileSearchContainer style={searchClick ? null : { display: 'none' }}>
        <MobileSearch />
        <FaTimes
          onClick={popupMobileSearch}
          style={{ width: '20%', fontSize: '36px' }}
        />
      </MobileSearchContainer>
      <div
        className="header-container"
        style={searchClick ? { display: 'none' } : null}
      >
        <div className="logo-container">
          <NavLink to="/" className="logo">
            Tect.dev
          </NavLink>
        </div>

        <nav className="navbar">
          <ul
            className={
              menuClick ? 'navbar-container clicked' : 'navbar-container'
            }
          >
            <li className="navbar-item">
              <NavLink
                to={{ pathname: `/board/${userPlace}` }}
                className="navbar-item-link"
                style={{ paddingBottom: '5px' }}
              >
                게시판
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink
                to={{ pathname: '/question/list/1' }}
                className="navbar-item-link"
                style={{ paddingBottom: '5px' }}
              >
                Q {`\&`} A
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink
                to={{ pathname: '/forest' }}
                className="navbar-item-link"
                style={{ paddingBottom: '5px' }}
              >
                숲
              </NavLink>
            </li>

            <SearchContainer popup={false}>
              <div
                className="visibleOnPc"
                style={searchClick ? { display: 'block' } : null}
              >
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
                  style={{ display: 'block' }}
                />
              </div>
              <div className="visibleOnMobile" onClick={popupMobileSearch}>
                <FaSearch />
              </div>
            </SearchContainer>
            <div className="auth-container">
              {loginState ? (
                <div className="mypage-container">
                  <NavLink to={`/user/${userID}`} className="navbar-item-link">
                    <div className="visibleOnPc">
                      <FaUserAlt />
                    </div>
                    <div className="visibleOnMobile">
                      <FaUserAlt />
                    </div>
                  </NavLink>
                </div>
              ) : (
                <div className="login-container">
                  <input
                    className="login-modal-input"
                    type="checkbox"
                    id="login-popup"
                  />
                  <label htmlFor="login-popup">
                    <FaUserAlt />
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

const SearchContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  color: #666;

  &-input {
    padding: 8px 0 8px 4px;
    font-size: 16px;
    width: 80%;
    border-radius: 5px;
    outline: none;
  }
`

const MobileSearchContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`

const MobileSearch = styled.input`
  padding: 8px 0 8px 4px;
  font-size: 16px;
  width: 80%;
  height: 20px;
  border-radius: 5px;
  outline: none;
`
