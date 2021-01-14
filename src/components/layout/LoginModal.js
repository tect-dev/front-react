import React, { useState, useCallback } from 'react'
import { useHistory } from 'react-router'
import '../../styles/layout/LoginModal.scss'
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, loginSuccessDelayed } from '../../redux/auth';
import { Button } from '../Button'
import firebase from '../../firebase'

export const LoginModal = ({ labelFor }) => {
  const history = useHistory()
  const [userid, setUserid] = useState("")
  const [userpw, setUserpw] = useState("")

  const submitWithEmailPassword = async (e) => {
    // 클라이언트에서 바로 구글 api 서버로 인증 요청 전송
    e.preventDefault()
    console.log(userid)
    console.log(userpw)
    try {
      const authResult = await firebase.auth().signInWithEmailAndPassword(userid, userpw)
      // redux와 연결
      // history.go(0) // 로그인 성공 시 페이지 reload
    } catch (e) {
      alert(e.message)
    }
    setUserid("")
    setUserpw("")
  }
  const submitWithAuthProvider = async (e) => {
    e.preventDefault(e)
    switch(e.target.className) {
      case "authProvider-Google" :
        const googleProvider = new firebase.auth.GoogleAuthProvider()
        const authResult = await firebase.auth().signInWithPopup(googleProvider)
        console.log(authResult)
        break
      case "authProvider-Facebook" :
        // const facebookProvider = new firebase.auth.FacebookAuthProvider()
        break
      case "authProvider-Github" :
        // const githubProvider = new firebase.auth.GithubAuthProvider()
        break
      default:
        alert("error")
    }
  }

  return (
    <>
      <div className="login-modal">
        <div className="login-modal-display">
          <label className="login-modal-close-btn" htmlFor={labelFor}/>
          <div className="login-modal-display-logo">
            Login
          </div>
          <div className="login-modal-display-body">
            <form name="tect-auth"
                  className="login-form"
                  autoComplete="off"
            >
              <input id="login-id-input" className="login-input" 
                    type="email" placeholder="Enter ID" required
                    value={userid}
                    onChange={e => setUserid(e.target.value)} />
              <input id="login-pw-input" className="login-input" 
                    type="password" placeholder="Enter PW" required
                    value={userpw}
                    onChange={e => setUserpw(e.target.value)} />
              <Button className="login-submit"
              htmlType="submit"
              onClick={submitWithEmailPassword}>
              Login
              </Button>
              <div className="auth-help">
                <div className="auth-help-element">
                  <input id="rememberUser" type="radio" name="Remember Me"/>
                  <label htmlFor="rememberUser"> Remember Me</label>
                </div>
                <div className="auth-help-element">
                  Forgot ID/PW?
                </div>
              </div>
              <div className="authProviders-container">
                <button className="authProvider-Google"
                onClick={submitWithAuthProvider}
                >
                  Google
                </button>
                <button className="authProvider-Facebook"
                onClick={submitWithAuthProvider}
                >
                  Facebook
                </button>
                <button className="authProvider-Github"
                onClick={submitWithAuthProvider}
                >
                  Github
                </button>
              </div>
            </form>
          </div>
        </div>
        <label className="login-modal-close-area" htmlFor={labelFor}/>
      </div>
    </>
  )
}