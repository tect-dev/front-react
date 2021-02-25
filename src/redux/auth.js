import { authService, firebaseInstance } from '../lib/firebase'
import axios from 'axios'
import { sortISOByTimeStamp } from '../lib/functions'

const initialState = {
  loginState: false,
  userID: '000000000000000000000000', // myID 로 고쳐야함
  userNickname: '익명', // myDisplayName 으로 고쳐야함
  emailVerified: false,
  loading: false,
  myUserInfo: {},
  userData: { displayName: '' }, // 나의 인증정보랑 상관없음. 다른 유저의 데이터가 될수도 있음.
  userTreeData: [], // 위와 마찬가지. 나의 트리데이터가 아니라, 누군가의 트리데이터임.
  userPlace: 'main', //내가 어느 게시판 들어갔느냐,
}

// define ACTION type

const SET_USER_PLACE = 'auth/SET_USER_PLACE'

const LOG_IN_TRY = 'auth/LOG_IN_TRY'
const LOG_IN_SUCCESS = 'auth/LOG_IN_SUCCESS'
const LOG_IN_FAIL = 'auth/LOG_IN_FAIL'

const LOG_OUT_TRY = 'auth/LOG_OUT_TRY'
const LOG_OUT_SUCCESS = 'auth/LOG_OUT_SUCCESS'
const LOG_OUT_FAIL = 'auth/LOG_OUT_FAIL'

const CREATE_USER_TRY = 'auth/CREATE_USER_TRY'
const CREATE_USER_SUCCESS = 'auth/CREATE_USER_SUCCESS'
const CREATE_USER_FAIL = 'auth/CREATE_USER_FAIL'

const GET_USER_TRY = 'auth/GET_USER_TRY'
const GET_USER_SUCCESS = 'auth/GET_USER_SUCCESS'
const GET_USER_FAIL = 'auth/GET_USER_FAIL'

const CHECK_AUTH = 'auth/CHECK_AUTH'

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
      //console.log('getIdToken 오류', e)
      alert('오류가 발생했습니다.')
    })
}

const session_signup = (displayName, introduce) => {
  authService.currentUser
    .getIdToken(true)
    .then((idToken) => {
      axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/login/account`,
        method: 'POST',
        data: {
          firebaseToken: idToken,
          displayName: displayName,
          introduce: introduce,
        },
        withCredentials: true,
      })
    })
    .catch((e) => {
      //console.log('getIdToken 오류', e)
      alert('오류가 발생했습니다.')
    })
}

// 액션타입을 redux 파일 안에 정의하고, 정의한 액션타입을 다른 파일에서 사용하기 위해
// 액션 생성함수를 정의하고, 생성함수를 export 할 것이다.
// thunk 사용시에는 액션생성함수 따로 안만듬.

export const setUserPlace = (userPlace) => {
  return { type: SET_USER_PLACE, userPlace: userPlace }
}

export const checkAuth = (user) => async (dispatch) => {
  if (user) {
    dispatch({
      type: CHECK_AUTH,
      loginState: true,
      userNickname: user.displayName,
      userID: user.uid,
      emailVerified: user.emailVerified,
      myUserInfo: user,
    })
  }
}

export const emailLogin = (email, password) => async (dispatch) => {
  dispatch({ type: LOG_IN_TRY })
  try {
    await authService.signInWithEmailAndPassword(email, password).then(() => {
      dispatch({ type: LOG_IN_SUCCESS })
      //session_login()
    })
  } catch (e) {
    //console.log('error: ', e)
    dispatch({ type: LOG_IN_FAIL })
    alert('잘못된 로그인 정보입니다.')
  }
}

export const emailSignUp = (email, password, displayName, introduce) => async (
  dispatch
) => {
  dispatch({ type: CREATE_USER_TRY })
  try {
    await authService
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        session_signup(displayName, introduce)
        authService.currentUser
          .sendEmailVerification()
          .then(
            '인증메일이 발송됐습니다! 메일함을 확인해 주세요. 메일인증이 마무리 되면 회원가입이 마무리됩니다.'
          )
      })
    dispatch({ type: CREATE_USER_SUCCESS, displayName })
  } catch (e) {
    //console.log('error: ', e)
    dispatch({ type: CREATE_USER_FAIL })
    switch (e.message) {
      case 'The email address is already in use by another account.':
        alert('이미 가입한 이메일 입니다.')
        return
      default:
        alert('오류가 발생했습니다.')
        return
    }
  }
}

export const logout = () => async (dispatch) => {
  dispatch({ type: LOG_OUT_TRY })

  try {
    authService.signOut()
    dispatch({ type: LOG_OUT_SUCCESS })
  } catch (e) {
    dispatch({ type: LOG_OUT_FAIL })
    //console.log('error: ', e)
  }
}

export const getUserInfo = (userID) => async (dispatch) => {
  dispatch({ type: GET_USER_TRY })
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/user/${userID}`,
      { withCredentials: true }
    )
    dispatch({ type: GET_USER_SUCCESS, userData: { ...res.data } })
  } catch (e) {
    // console.log('error: ', e)
    dispatch({ type: GET_USER_FAIL, error: e })
  }
}

export const updateProfile = (userID, displayName, introduce) => async (
  dispatch
) => {
  try {
    authService.currentUser.getIdToken(true).then(async (idToken) => {
      const res = await axios({
        method: 'put',
        url: `${process.env.REACT_APP_BACKEND_URL}/user/update`,
        data: {
          displayName: displayName,
          introduce: introduce,
          firebaseToken: idToken,
        },
      })
    })
  } catch (e) {
    //console.log('error: ', e)
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
        displayName: action.displayName,
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
        displayName: '익명',
        emailVerified: false,
      }
    case LOG_OUT_FAIL:
      return {
        ...state,
        loading: false,
      }
    case GET_USER_TRY:
      return {
        ...state,
        loading: true,
      }
    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        userData: {
          ...action.userData,
          treeData: action.userData.treeData.sort((a, b) => {
            return sortISOByTimeStamp(a.createdAt, b.createdAt, 1)
          }),
        },
        userTreeData: action.userData.treeData.sort((a, b) => {
          return sortISOByTimeStamp(a.createdAt, b.createdAt, 1)
        }),
      }
    case GET_USER_FAIL:
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
        emailVerified: action.emailVerified,
        myUserInfo: action.myUserInfo,
      }
    case SET_USER_PLACE:
      return {
        ...state,
        userPlace: action.userPlace,
      }
    default:
      return state
  }
}
