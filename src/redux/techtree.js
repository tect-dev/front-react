// define initial state
const initialState = {
  isEditingDocument: false,
  isEditingTechtree: false,
}

// define ACTION types
const EDIT_DOCUMENT = 'techtree/EDIT_DOCUMENT'
const EDIT_TECHTREE = 'techtree/EDIT_TECHTREE'
const FINISH_EDIT = 'techtree/FINISH_EDIT'

// action 생성 함수
export const editTechtree = () => {
  return { type: EDIT_TECHTREE }
}
export const editDocument = () => {
  return { type: EDIT_DOCUMENT }
}
export const finishEdit = (content) => {
  // 여기서 마크다운 content 에 해당하는걸 서버로 보내 저장.
  // 노드와 링크 데이터가 전부 합쳐진 객체를 보내야겠네.
  return { type: FINISH_EDIT }
}

export default function techtree(state = initialState, action) {
  switch (action.type) {
    case EDIT_TECHTREE:
      return {
        ...state,
        isEditingTechtree: true,
      }
    case EDIT_DOCUMENT:
      return {
        ...state,
        isEditingDocument: true,
      }
    case FINISH_EDIT:
      return {
        ...state,
        isEditingDocument: false,
        isEditingTechtree: false,
      }
    default:
      return { ...state }
  }
}
