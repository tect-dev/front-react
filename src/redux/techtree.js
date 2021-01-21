// 해당 노드 리스트 전체 데이터를 받아서 리덕스 스테이트에 저장함.
// 테크트리 에디터 파일에서 리덕스와 연동해 노드리스트 데이터를 보여줌
// 노드가 선택되면 selectedNodeData 라는 리덕스 스테이트에 변화가 일어남
// selectedNode는 테크트리 에디터 파일에서.
// 리액트 파일에서 마크다운 편집모드에 돌입하면, 셀렉티드 노드 정보를 수정.
// 수정 완료 버튼을 누르면 노드 리스트 데이터를 갱신.
// 그리고 서버에 갱신된 정보를 보냄.
// 노드리스트 데이터가 갱신되면 자바스크립트 파일인 테크트리 에디터는 갱신되나?
// 아니면 리액트 컴포넌트와 훅을 쓰고, 상태 끌어올리기 트릭을 쓰는건 어떨까?

// define initial state
const initialState = {
  selectedNode: {},
  isEditingDocument: false,
  isEditingTechtree: false,
  techtreeData: {
    nodeList: [
      {
        id: '1',
        name: '첫번째 노드',
        x: 150,
        y: 150,
        radius: 15,
        body: '## 이것은 마크다운.\n실험용 첫번째 노드',
        tag: '프론트엔드',
        fillColor: 'blue',
      },
      {
        id: '2',
        name: '두번째 노드',
        x: 300,
        y: 300,
        radius: 15,
        body: 'x랑 y의 값은 둘다 300임. 두번째 노드임',
        tag: '백엔드',
        fillColor: 'red',
      },
    ],
    linkList: [],
  },
}

// define ACTION types
const EDIT_DOCUMENT = 'techtree/EDIT_DOCUMENT'
const EDIT_TECHTREE = 'techtree/EDIT_TECHTREE'
const FINISH_EDIT = 'techtree/FINISH_EDIT'
const SELECT_NODE = 'techtree/SELECT_NODE'

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
export const selectNode = (node) => {
  return { type: SELECT_NODE, node: node }
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
    case SELECT_NODE:
      return {
        ...state,
        selectedNode: action.node,
      }
    default:
      return { ...state }
  }
}
