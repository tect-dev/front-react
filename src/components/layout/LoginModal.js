import React, { useCallback, useState, useEffect } from 'react'
import '../../styles/layout/LoginModal.scss'
import { Button } from '../Button'
import { Spinner } from '../Spinner'
import { emailLogin, emailSignUp } from '../../redux/auth'
import { useDispatch } from 'react-redux'
import { onClickTag } from '../../lib/functions'
import { window } from 'd3'
import { useSelector } from 'react-redux'
import { firebaseInstance } from '../../lib/firebase'
import firebase from 'firebase/app'

export const LoginModal = React.memo(({ labelFor }) => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [displayName, setDisplayName] = useState()
  const [introduce, setIntroduce] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState()

  const { loading } = useSelector((state) => {
    return {
      loading: state.auth.loading,
    }
  })

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

  const onChangedisplayName = useCallback(
    (e) => {
      setDisplayName(e.target.value)
    },
    [displayName]
  )

  const onChangeIntroduce = useCallback(
    (e) => {
      setIntroduce(e.target.value)
    },
    [introduce]
  )

  const onEmailLogin = useCallback(
    async (e) => {
      e.preventDefault()
      await dispatch(emailLogin(email, password))
      setEmail('')
      setPassword('')
    },
    [dispatch, email, password]
  )

  const onEmailSignUp = useCallback(
    async (e) => {
      e.preventDefault()
      await dispatch(emailSignUp(email, password, displayName, introduce))
      setEmail('')
      setPassword('')
      setDisplayName('')
      setIntroduce('')
    },
    [dispatch, email, password, displayName, introduce]
  )

  //const onClickSMSVerify = useCallback((phoneNum) => {
  //  const phoneNumber = phoneNum
  //  const appVerifier = window.recaptchaVerifier
  //  firebaseInstance
  //    .auth()
  //    .signInWithPhoneNumber(phoneNumber, appVerifier)
  //    .then((confirmResult) => {
  //      // success
  //      console.log('휴대폰 인증 성공: ', confirmResult)
  //    })
  //    .catch((error) => {
  //      // error
  //      console.log('휴대폰 인증 실패: ', error)
  //    })
  //}, [])

  // useEffect(() => {
  //   window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  //     'recaptcha-container',
  //     {
  //       size: 'invisible',
  //       // other options
  //     }
  //   )
  // }, [])

  return (
    <>
      <div className="login-modal">
        {loading && <Spinner />}
        <div className="login-modal-display">
          <label
            className="login-modal-close-btn"
            htmlFor={labelFor}
            onClick={() => {
              setTimeout(() => {
                setIsSignUp(false)
              }, 500)
            }}
          />

          <div className="login-modal-display-logo">Login</div>
          <div className="login-modal-display-body">
            <form name="devguru-auth" className="login-form" autoComplete="off">
              <input
                id="login-id-input"
                className="login-input"
                type="email"
                placeholder="로그인 이메일을 입력해 주세요."
                name="email"
                value={email}
                onChange={onChangeEmail}
              />
              <input
                id="login-pw-input"
                className="login-input"
                type="password"
                placeholder="로그인 비밀번호를 입력해 주세요."
                name="password"
                value={password}
                onChange={onChangePassword}
              />

              {isSignUp ? (
                <input
                  className="login-input"
                  type="text"
                  placeholder="표시될 닉네임을 입력해주세요."
                  required
                  name="displayName"
                  value={displayName}
                  onChange={onChangedisplayName}
                />
              ) : (
                ''
              )}
              {isSignUp ? (
                <input
                  className="login-input"
                  type="text"
                  placeholder="자기 소개를 입력해주세요."
                  required
                  name="introduce"
                  value={introduce}
                  onChange={onChangeIntroduce}
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
        <label
          className="login-modal-close-area"
          htmlFor={labelFor}
          onClick={() => {
            setTimeout(() => {
              setIsSignUp(false)
            }, 500)
          }}
        />
      </div>
    </>
  )
})
