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
        id: 'asdfasdfasdfasdfasdfasdf',
        name: '첫번째 노드',
        x: 150,
        y: 150,
        radius: 15,
        body: '## 이것은 마크다운.\n실험용 첫번째 노드',
        tag: '프론트엔드',
        fillColor: '#91a7ff',
      },
      {
        id: 'bbdfasdfasdfasdfasdfasdf',
        name: '두번째 노드',
        x: 300,
        y: 300,
        radius: 15,
        body: 'x랑 y의 값은 둘다 300임. 두번째 노드임',
        tag: '백엔드',
        fillColor: '#339af0',
      },
    ],
    linkList: [
      {
        startNodeID: 'asdfasdfasdfasdfasdfasdf',
        endNodeID: 'bbdfasdfasdfasdfasdfasdf',
        startX: 150,
        startY: 150,
        endX: 300,
        endY: 300,
        id: 'ccdfasdfasdfasdfasdfasdf',
        left: false,
        right: true,
      },
    ],
  },
}

// define ACTION types
const EDIT_DOCUMENT = 'techtree/EDIT_DOCUMENT'
const EDIT_TECHTREE = 'techtree/EDIT_TECHTREE'
const FINISH_DOCU_EDIT = 'techtree/FINISH_DOCU_EDIT'
const SELECT_NODE = 'techtree/SELECT_NODE'

const CREATE_NODE = 'techtree/CREATE_NODE'
const CREATE_LINK = 'techtree/CREATE_LINK'

// action 생성 함수
export const editTechtree = () => {
  return { type: EDIT_TECHTREE }
}
export const editDocument = () => {
  return { type: EDIT_DOCUMENT }
}
export const finishDocuEdit = (nodeID, nodeName, nodeBody) => {
  return { type: FINISH_DOCU_EDIT, nodeID, nodeName, nodeBody }
}
export const selectNode = (node) => {
  return { type: SELECT_NODE, node: node }
}
export const createNode = (nodeList) => {
  return { type: CREATE_NODE, nodeList: nodeList }
}
export const createLink = (linkList) => {
  return { type: CREATE_LINK, linkList: linkList }
}

export default function techtree(state = initialState, action) {
  switch (action.type) {
    case CREATE_LINK:
      return {
        ...state,
        techtreeData: {
          ...state.techtreeData,
          linkList: action.linkList,
        },
      }
    case CREATE_NODE:
      return {
        ...state,
        techtreeData: {
          ...state.techtreeData,
          nodeList: action.nodeList,
        },
      }
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
    case FINISH_DOCU_EDIT:
      const changingIndex = state.techtreeData.nodeList.findIndex(
        (element) => action.nodeID === element.id
      )
      const changingNode = state.techtreeData.nodeList[changingIndex]
      const newNodeList = state.techtreeData.nodeList
      newNodeList[changingIndex] = {
        ...changingNode,
        id: action.nodeID,
        name: action.nodeName,
        body: action.nodeBody,
      }
      return {
        ...state,
        techtreeData: { ...state.techtreeData, nodeList: newNodeList },
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
