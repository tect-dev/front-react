const initialState = { content: '' };

// define ACTION type
const CHANGE_CONTENT = 'write/CHANGE_CONTENT';

// 액션타입을 redux 파일 안에 정의하고, 정의한 액션타입을 다른 파일에서 사용하기 위해
// 액션 생성함수를 정의하고, 생성함수를 export 할 것이다.
export const changeContent = (content) => {
  return { type: CHANGE_CONTENT, content: content };
};

export default function write(state = initialState, action) {
  switch (action.type) {
    case CHANGE_CONTENT:
      return {
        ...state,
        content: action.content,
      };
    default:
      return state;
  }
}
