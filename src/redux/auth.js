// define ACTION type

const LOG_IN_SUCCESS = 'auth/LOG_IN_SUCCESS';
const LOG_IN_FAIL = 'auth/LOG_IN_FAIL';
const CREATE_USER_SUCCESS = 'auth/CREATE_USER_SUCCESS';

const initialState = { loginState: false, userInfo: {} };

// 액션타입을 redux 파일 안에 정의하고, 정의한 액션타입을 다른 파일에서 사용하기 위해
// 액션 생성함수를 정의하고, 생성함수를 export 할 것이다.
export const loginSuccess = () => {
  return { type: LOG_IN_SUCCESS };
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
