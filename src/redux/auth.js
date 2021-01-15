// define ACTION type

const LOG_IN_TRY = 'auth/LOG_IN_TRY'
const LOG_IN_SUCCESS = 'auth/LOG_IN_SUCCESS'
const LOG_IN_FAIL = 'auth/LOG_IN_FAIL'

const CREATE_USER_TRY = 'auth/CREATE_USER_TRY'
const CREATE_USER_SUCCESS = 'auth/CREATE_USER_SUCCESS'
const CREATE_USER_FAIL = 'auth/CREATE_USER_FAIL'

const initialState = {
  loginState: false,
  userID: null,
  userNickname: '익명',
  loading: false,
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
        userNickname: 'testname',
        userID: 'qwerasdfzxcvnmvclkjh',
        loginState: true,
      }
    case LOG_IN_FAIL:
      return {
        ...state,
        loading: false,
        loginState: false,
      }
    default:
      return state
  }
}
