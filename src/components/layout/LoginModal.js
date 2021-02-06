import React, { useCallback, useState } from 'react'
import '../../styles/layout/LoginModal.scss'
import { Button } from '../Button'
import { emailLogin, emailSignUp } from '../../redux/auth'
import { useDispatch } from 'react-redux'
import { onClickTag } from '../../lib/functions'
import { window } from 'd3'

export const LoginModal = React.memo(({ labelFor }) => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [nickname, setNickname] = useState()
  const [isSignUp, setIsSignUp] = useState(false)
  const [loginResult, setLoginResult] = useState(null)

  // fancy한 방법인데
  //const onChange = (e) => {
  //  const {
  //    target: { name, value },
  //  } = e
  //  if (name === 'email') {
  //    setEmail(value)
  //  } else if (name === 'password') {
  //    setPassword(value)
  //  }
  //}

  const onChangeEmail = useCallback(
    (e) => {
      setEmail(e.target.value)
    },
    [email]
  )

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value)
    },
    [password]
  )

  const onChangeNickname = useCallback(
    (e) => {
      setNickname(e.target.value)
    },
    [nickname]
  )

  const onEmailLogin = useCallback(
    async (e) => {
      e.preventDefault()
      dispatch(emailLogin(email, password))

      // const fuck = document.getElementById("loginSubmitBtn").focus()
      // console.log(fuck)
      console.log(document.getElementById('loginSubmitBtn').onchange)
      // 버튼은 클릭 해제가 안 됨 ㅋㅋ
      setEmail('')
      setPassword('')
    },
    [dispatch, email, password]
  )

  const onEmailSignUp = useCallback(
    (e) => {
      e.preventDefault()
      dispatch(emailSignUp(email, password, nickname))
    },
    [dispatch, email, password, nickname]
  )

  return (
    <>
      <div className="login-modal">
        <div className="login-modal-display">
          <label className="login-modal-close-btn" htmlFor={labelFor} />

          <div className="login-modal-display-logo">Login</div>
          <div className="login-modal-display-body">
            <form name="devguru-auth" className="login-form" autoComplete="off">
              <input
                id="login-id-input"
                className="login-input"
                type="email"
                placeholder="Enter Login Email"
                name="email"
                value={email}
                onChange={onChangeEmail}
              />
              <input
                id="login-pw-input"
                className="login-input"
                type="password"
                placeholder="Enter Password"
                name="password"
                value={password}
                onChange={onChangePassword}
              />
              {isSignUp ? (
                <input
                  className="login-input"
                  type="text"
                  placeholder="Enter Nickname"
                  required
                  name="nickname"
                  value={nickname}
                  onChange={onChangeNickname}
                />
              ) : (
                ''
              )}

              {isSignUp ? (
                <Button className="login-submit" onClick={onEmailSignUp}>
                  Sign Up
                </Button>
              ) : (
                <>
                  {' '}
                  <Button
                    id="loginSubmitBtn"
                    className="login-submit"
                    onClick={onEmailLogin}
                  >
                    Login
                  </Button>
                  <Button
                    className="login-submit"
                    onClick={() => {
                      setIsSignUp(true)
                    }}
                  >
                    Sign Up?
                  </Button>
                </>
              )}
            </form>
          </div>
        </div>
        <label className="login-modal-close-area" htmlFor={labelFor} />
      </div>
    </>
  )
})
