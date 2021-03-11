import MainWrapperDefault from '../wrappers/MainWrapper'
import { Spinner } from '../components/Spinner'
import { Button, DefaultButton } from '../components/Button'
import { TitleInput } from '../components/TitleInput'
import MainLogo from '../assets/MainLogo.png'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { emailLogin, emailSignUp } from '../redux/auth'
import { boxShadow, colorPalette } from '../lib/constants'
import styled from 'styled-components'
import { useHistory } from 'react-router'

export default function LoginPage() {
  const dispatch = useDispatch()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [displayName, setDisplayName] = useState()
  const [introduce, setIntroduce] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const history = useHistory()
  const termsChecked = useRef(false)
  const [showTerms, setShowTerms] = useState(false)
  const [passwordCheck, setPasswordCheck] = useState(false)

  // 6~20자리. 최소 하나이상의 숫자 또는 특수문자를 포함해야함.
  const passwordRegex = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/

  const { loading, error, loginState } = useSelector((state) => {
    return {
      loading: state.auth.loading,
      error: state.auth.error,
      loginState: state.auth.loginState,
    }
  })

  const onChangeEmail = useCallback((e) => {
    setEmail(e.target.value)
  }, [])

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value)

    if (passwordRegex.test(e.target.value)) {
      setPasswordCheck(true)
    } else {
      setPasswordCheck(false)
    }
  }, [])

  const onChangedisplayName = useCallback((e) => {
    setDisplayName(e.target.value)
  }, [])

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
    },
    [dispatch, email, password]
  )

  const onEmailSignUp = useCallback(
    async (e) => {
      e.preventDefault()

      dispatch(emailSignUp(email, password, displayName, introduce))
    },
    [dispatch, email, password, displayName, introduce]
  )

  useEffect(() => {
    if (loginState) {
      history.push('/forest?page=1')
    }
  }, [loginState])

  return (
    <MainWrapperDefault>
      <Container>
        {loading && <Spinner />}
        <img style={{ width: '90%' }} src={MainLogo} />
        <StyledInput
          id="login-id-input"
          className="login-input"
          placeholder="Email..."
          name="email"
          value={email}
          onChange={onChangeEmail}
          required
        />
        <StyledInput
          id="login-pw-input"
          className="login-input"
          type="password"
          placeholder="password..."
          name="password"
          value={password}
          onChange={onChangePassword}
          required
        />
        {isSignUp && !passwordCheck ? (
          <div style={{ fontSize: '12px', color: colorPalette.red4 }}>
            The password must contain a mix of letters, numbers, and/or special
            characters and 6~20 characters.
          </div>
        ) : null}

        {isSignUp ? (
          <>
            <StyledInput
              className="login-input"
              type="text"
              placeholder="Your Nickname"
              name="displayName"
              value={displayName}
              onChange={onChangedisplayName}
              required
            />
            <StyledInput
              className="login-input"
              type="text"
              placeholder="one-line profile"
              required
              name="introduce"
              value={introduce}
              onChange={onChangeIntroduce}
            />
          </>
        ) : (
          ''
        )}
        <ButtonArea>
          {!isSignUp && (
            <>
              <DefaultButton
                id="loginSubmitBtn"
                className="login-submit"
                onClick={onEmailLogin}
              >
                Login
              </DefaultButton>
              <DefaultButton
                className="login-submit"
                onClick={(e) => {
                  e.preventDefault()
                  setIsSignUp(true)
                  return true
                }}
              >
                Sign Up?
              </DefaultButton>
            </>
          )}

          {isSignUp ? (
            <DefaultButton
              className="login-submit"
              onClick={onEmailSignUp}
              disabled={!passwordCheck}
            >
              Sign Up
            </DefaultButton>
          ) : null}
        </ButtonArea>
      </Container>
    </MainWrapperDefault>
  )
}

const Container = styled.div`
  background-color: #ffffff;
  border: 1px solid ${colorPalette.gray3};
  padding: 1rem;
  justify-content: center;
  align-items: center;
  margin-left: 25vw;
  margin-right: 25vw;
  @media (max-width: 768px) {
    margin-left: 10vw;
    margin-right: 10vw;
  }
`
const StyledInput = styled(TitleInput)`
  width: 90%;
  //border: 1px solid ${colorPalette.gray3};
  margin: 1rem;
  padding-top: 10px;
  background-color: ${colorPalette.gray0};
  //box-shadow: ${boxShadow.default};
`
const ButtonArea = styled.div`
  display: flex;
  justify-content: space-around;
`
