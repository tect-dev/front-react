import { authService, firebaseInstance } from '../lib/firebase'
import axios from 'axios'

// define ACTION type
const LOG_IN_TRY = 'auth/LOG_IN_TRY'
const LOG_IN_SUCCESS = 'auth/LOG_IN_SUCCESS'
const LOG_IN_FAIL = 'auth/LOG_IN_FAIL'

const LOG_OUT_TRY = 'auth/LOG_OUT_TRY'
const LOG_OUT_SUCCESS = 'auth/LOG_OUT_SUCCESS'
const LOG_OUT_FAIL = 'auth/LOG_OUT_FAIL'

const CREATE_USER_TRY = 'auth/CREATE_USER_TRY'
const CREATE_USER_SUCCESS = 'auth/CREATE_USER_SUCCESS'
const CREATE_USER_FAIL = 'auth/CREATE_USER_FAIL'

const CHECK_AUTH = 'auth/CHECK_AUTH'

const initialState = {
  loginState: false,
  userID: '000000000000000000000000',
  userNickname: '익명',
  loading: false,
}

const session_login = () => {
  authService.currentUser
    .getIdToken(/* forceRefresh */ true)
    .then((idToken) => {
      axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/login/sessionLogin`,
        method: 'POST',
        data: {
          firebaseToken: idToken,
          //crsfToken : crsfToekn
        },
        withCredentials: true,
      })
    })
    .catch((e) => {
      console.log('getIdToken 오류', e)
    })
}

const session_signup = (userNickname) => {
  authService.currentUser
    .getIdToken(/* forceRefresh */ true)
    .then((idToken) => {
      axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/login/account`,
        method: 'POST',
        data: {
          firebaseToken: idToken,
          nickname: userNickname,
          point: 1000,
          //crsfToken : crsfToekn
        },
        withCredentials: true,
      })
    })
    .catch((e) => {
      console.log('getIdToken 오류', e)
    })
}

// 액션타입을 redux 파일 안에 정의하고, 정의한 액션타입을 다른 파일에서 사용하기 위해
// 액션 생성함수를 정의하고, 생성함수를 export 할 것이다.
// thunk 사용시에는 액션생성함수 따로 안만듬.

export const checkAuth = (user) => {
  if (user) {
    console.log('유저:', user)
    const userInfo = {
      userID: user.uid,
      userEmail: user.email,
      userNickname: `${user.displayName}`,
    }
    localStorage.setItem('user', JSON.stringify(userInfo))
    return {
      type: CHECK_AUTH,
      loginState: true,
      userNickname: `${user.displayName}`,
      userID: user.uid,
    }
  } else if (localStorage.getItem('user')) {
    const userInfo = JSON.parse(localStorage.getItem('user'))
    console.log('로컬스토리지 이용한 유저정보 갱신:', userInfo)
    return {
      type: CHECK_AUTH,
      loginState: true,
      userID: userInfo.userID,
      userNickname: userInfo.userNickname,
    }
  } else {
    return {
      type: CHECK_AUTH,
      loginState: false,
      userID: '000000000000000000000000',
      userNickname: '익명',
    }
  }
}

export const emailLogin = (email, password) => async (dispatch) => {
  dispatch({ type: LOG_IN_TRY })
  try {
    await authService.signInWithEmailAndPassword(email, password).then(() => {
      session_login()
    })

    dispatch({ type: LOG_IN_SUCCESS })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: LOG_IN_FAIL })
  }
}

export const emailSignUp = (email, password, nickname) => async (dispatch) => {
  dispatch({ type: CREATE_USER_TRY })
  try {
    await authService
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        session_signup(nickname)
      })

    dispatch({ type: CREATE_USER_SUCCESS })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: CREATE_USER_FAIL })
  }
}

export const logout = () => async (dispatch) => {
  dispatch({ type: LOG_OUT_TRY })

  try {
    axios({ url: `${process.env.REACT_APP_BACKEND_URL}/login/sessionLogout`, method: 'GET' })
    authService.signOut()
    localStorage.removeItem('user')
    dispatch({ type: LOG_OUT_SUCCESS })
  } catch (e) {
    dispatch({ type: LOG_OUT_FAIL })
    console.log('error: ', e)
  }
}

export default function auth(state = initialState, action) {
  switch (action.type) {
    case LOG_IN_TRY:
      return {
        ...state,
        loading: true,
      }
    case LOG_IN_SUCCESS:
      return {
        ...state,
        loading: false,

        loginState: true,
      }
    case LOG_IN_FAIL:
      return {
        ...state,
        loading: false,
        loginState: false,
      }
    case CREATE_USER_TRY:
      return {
        ...state,
        loading: true,
      }
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        loginState: true,
        userID: 'qwerasdfzxcvnmvclkjh',
        userNickname: 'testname',
      }
    case CREATE_USER_FAIL:
      return {
        ...state,
        loading: false,
      }
    case LOG_OUT_TRY:
      return {
        ...state,
        loading: true,
      }
    case LOG_OUT_SUCCESS:
      return {
        ...state,
        loading: false,
        loginState: false,
        userID: '000000000000000000000000',
        userNickname: '익명',
      }
    case LOG_OUT_FAIL:
      return {
        ...state,
        loading: false,
      }
    case CHECK_AUTH:
      return {
        ...state,
        loginState: action.loginState,
        userNickname: action.userNickname,
        userID: action.userID,
      }
    default:
      return state
  }
}
