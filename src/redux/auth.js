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
        url: 'http://localhost:1818/login/sessionLogin',
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

const session_signup = (email) => {
  authService.currentUser
    .getIdToken(/* forceRefresh */ true)
    .then((idToken) => {
      axios({
        url: 'http://localhost:1818/login/account',
        method: 'POST',
        data: {
          firebaseToken: idToken,
          authorNickname: 'lee',
          email: email,
          point: '10',
          posts: ['hi', 'hello'],
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

export const login = () => async (dispatch) => {
  try {
    dispatch({ type: LOG_IN_SUCCESS })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: LOG_IN_FAIL })
  }
}

export const checkAuth = (user) => {
  console.log('checkAuth:')
  if (user) {
    return {
      type: CHECK_AUTH,
      loginState: true,
      userNickname: user.email,
      userID: user.uid,
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
    await authService
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        session_login()
      })
      .then((res) => {
        console.log('로그인 결과 res: ', res)
      })
    dispatch({ type: LOG_IN_SUCCESS })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: LOG_IN_FAIL })
  }
}

export const emailSignUp = (email, password) => async (dispatch) => {
  dispatch({ type: CREATE_USER_TRY })
  try {
    await authService
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        session_signup(email)
      })
      .then((res) => {
        console.log('회원가입 결과 res: ', res)
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
    authService.signOut()
    localStorage.removeItem(
      'FE37F882DCF4A30642E6B59D595F0760B0F1C3FE86F466922270B61E6D09106D'
    )
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
