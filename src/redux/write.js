const initialState = { writingContent: '' };

// define ACTION type
const ON_CHANGE_CONTENT = 'write/ON_CHANGE_CONTENT';

// 액션타입을 redux 파일 안에 정의하고, 정의한 액션타입을 다른 파일에서 사용하기 위해
// 액션 생성함수를 정의하고, 생성함수를 export 할 것이다.
export const onChangeContent = (writingContent) => {
  return { type: ON_CHANGE_CONTENT, writingContent: writingContent };
};

export default function write(state = initialState, action) {
  switch (action.type) {
    case ON_CHANGE_CONTENT:
      return {
        ...state,
        writingContent: action.writingContent,
      };
    default:
      return state;
  }
}
