// define ACTION type

const LOG_IN_TRY = 'auth/LOG_IN_TRY';
const LOG_IN_SUCCESS = 'auth/LOG_IN_SUCCESS';
const LOG_IN_FAIL = 'auth/LOG_IN_FAIL';
const CREATE_USER_SUCCESS = 'auth/CREATE_USER_SUCCESS';

const initialState = { loginState: false, userInfo: {} };

// 액션타입을 redux 파일 안에 정의하고, 정의한 액션타입을 다른 파일에서 사용하기 위해
// 액션 생성함수를 정의하고, 생성함수를 export 할 것이다.
export const loginSuccess = () => {
  return { type: LOG_IN_SUCCESS };
};

// 1초 뒤에 loginSuccess() 를 디스패치 한다. 딜레이된 로그인석세스를 디스패치->다시한번 로그인석세스를 1초뒤 디스패치.
export const loginSuccessDelayed = () => (dispatch) => {
  setTimeout(() => {
    dispatch(loginSuccess());
  }, 1000);
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case LOG_IN_SUCCESS:
      return {
        userInfo: { userNickname: 'testname', userUID: 'qwerasdfzxcvnmvclkjh' },
        loginState: true,
      };
    case LOG_IN_FAIL:
      return {
        ...state,
        loginState: false,
      };
    default:
      return state;
  }
}
