import React from 'react'
import '../../styles/layout/LoginModal.scss'
import { Button } from '../Button'

export const LoginModal = ({ labelFor }) => {
  return (
    <>
      <div className="login-modal">
        <div className="login-modal-display">
          <label className="login-modal-close-btn" htmlFor={labelFor}/>
            {/* <div/>
            <div/> */}
          {/* </label> */}
          <div className="login-modal-display-logo">
            Login
          </div>
          <div className="login-modal-display-body">
            <form name="devguru-auth"
                  className="login-form"
                  autoComplete="off"
            >
                  {/* method="POST" action="#"> */}
              <input id="login-id-input" className="login-input" 
                    type="email" placeholder="Enter ID" required/>
              <input id="login-pw-input" className="login-input" 
                    type="password" placeholder="Enter PW" required/>
              <Button className="login-submit"
              htmlType="submit"> Login </Button>
              <div className="auth-help">
                <div className="auth-help-element">
                  <input id="rememberUser" type="radio" name="Remember Me"/>
                  <label htmlFor="rememberUser"> Remember Me</label>
                </div>
                <div className="auth-help-element">
                  Forgot ID/PW?
                </div>
              </div>
              <div className="authProviders">
                <div>
                  Google
                </div>
                <div>
                  Facebook
                </div>
                <div>
                  Github
                </div>
              </div>
            </form>
          </div>
        </div>
        <label className="login-modal-close-area" htmlFor={labelFor}/>
      </div>
    </>
  )
}