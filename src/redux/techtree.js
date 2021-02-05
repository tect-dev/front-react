import axios from 'axios'
import { authService } from '../lib/firebase'
import { uid } from 'uid'
import { sortISOByTimeStamp } from '../lib/functions'

const initialState = {
  loading: false,
  techtreeList: [],
  previousNodeList: [{ name: '' }],
  nextNodeList: [{ name: '' }],
  selectedNode: {
    name: '지식트리를 꾸며보세요',
    body:
      '노드를 클릭하고, \n노드와 연결된 문서를 수정하고,\n노드끼리의 연결관계를 표현할 수 있어요.\n마크다운과 코드블럭, 사진첨부도 가능합니다',
  },
  isEditingDocument: false,
  isEditingTechtree: false,
  nodeList: [{}],
  linkList: [{}],
  techtreeTitle: '',
  techtreeData: {
    title: 'empty',
    nodeList: [{}],
    linkList: [{}],
  },
}

// define ACTION types
const EDIT_DOCUMENT = 'techtree/EDIT_DOCUMENT'
const EDIT_TECHTREE = 'techtree/EDIT_TECHTREE'

const FINISH_TECHTREE_EDIT = 'techtree/FINISH_TECHTREE_EDIT'
const FINISH_DOCU_EDIT = 'techtree/FINISH_DOCU_EDIT'

const SELECT_NODE = 'techtree/SELECT_NODE'

const CREATE_NODE = 'techtree/CREATE_NODE'
const DELETE_NODE = 'techtree/DELETE_NODE'

const CREATE_LINK = 'techtree/CREATE_LINK'
const DELETE_LINK = 'techtree/DELETE_LINK'

const READ_TECHTREE_LIST_TRY = 'techtree/READ_TECHTREE_LIST_TRY'
const READ_TECHTREE_LIST_SUCCESS = 'techtree/READ_TECHTREE_LIST_SUCCESS'
const READ_TECHTREE_LIST_FAIL = 'techtree/READ_TECHTREE_LIST_FAIL'

const READ_TECHTREE_DATA_TRY = 'techtree/READ_TECHTREE_DATA_TRY'
const READ_TECHTREE_DATA_SUCCESS = 'techtree/READ_TECHTREE_DATA_SUCCESS'
const READ_TECHTREE_DATA_FAIL = 'techtree/READ_TECHTREE_DATA_FAIL'

// action 생성 함수
export const editTechtree = () => {
  return { type: EDIT_TECHTREE }
}
export const editDocument = () => {
  return { type: EDIT_DOCUMENT }
}
export const finishTechtreeEdit = () => {
  return { type: FINISH_TECHTREE_EDIT }
}
export const finishDocuEdit = (nodeID, nodeName, nodeBody) => {
  return { type: FINISH_DOCU_EDIT, nodeID, nodeName, nodeBody }
}
export const selectNode = (previousNodeList, nextNodeList, node) => {
  return { type: SELECT_NODE, previousNodeList, nextNodeList, node }
}
export const createNode = (nodeList) => {
  return { type: CREATE_NODE, nodeList: nodeList }
}
export const createLink = (linkList) => {
  return { type: CREATE_LINK, linkList: linkList }
}
export const deleteNode = (nodeList, linkList, node) => {
  try {
    const stringifiedNodeList = JSON.stringify(nodeList)
    const stringifiedLinkList = JSON.stringify(linkList)
    authService.currentUser.getIdToken(true).then(async (idToken) => {
      const res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_BACKEND_URL}/techtree`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          title: '테스트용 테크트리',
          _id: uid(24),
          hashtags: [],
          nodeList: stringifiedNodeList,
          linkList: stringifiedLinkList,
          firebaseToken: idToken,
        },
      })
      //await dispatch({ type: CREATE_QUESTION_SUCCESS })
    })
  } catch (e) {
    alert('error: ', e)
    //dispatch({ type: CREATE_QUESTION_FAIL, error: e })
  }
  const deletionBinaryList = linkList.map((link) => {
    if (link.startNodeID === node.id) {
      return 0
    } else if (link.endNodeID === node.id) {
      return 0
    } else {
      return 1
    }
  })
  // 이러면 linkList 랑 원소의 갯수가 같은 0101010 배열이 나올것.
  const newLinkList = linkList.filter((link, index) => {
    return deletionBinaryList[index] === 1
  })
  const deleteNodeIndex = nodeList.findIndex((ele) => {
    return ele.id === node.id
  })
  const newNodeList = nodeList.filter((ele, index) => {
    return ele.id !== node.id
  })
  // .splice 는 원본배열을 조작하는것. 반환값은 원본배열에서 잘라낸것만 반환한다.
  //nodeList.splice(deleteNodeIndex, 1)
  return { type: DELETE_NODE, newNodeList, newLinkList }
}

export const deleteLink = (linkList, link) => {
  const newLinkList = linkList.filter((ele) => {
    return ele.id !== link.id
  })

  return { type: DELETE_LINK, newLinkList }
}

export const readTechtreeList = () => async (dispatch) => {
  dispatch({ type: READ_TECHTREE_LIST_TRY })
  try {
    const res = await axios({
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/techtree/`,
    })
    // 여기서 모든 배열내의 테크트리들 바꿔서 정리해줘야하네.
    const parsedTechtreeList = res.data.map((techtreeData) => {
      const parsedNodeList = JSON.parse(techtreeData.nodeList)
      const parsedLinkList = JSON.parse(techtreeData.linkList)
      return {
        ...techtreeData,
        nodeList: parsedNodeList,
        linkList: parsedLinkList,
      }
    })

    console.log('파싱된 테크트리 데이터: ', parsedTechtreeList)
    dispatch({
      type: READ_TECHTREE_LIST_SUCCESS,
      techtreeList: parsedTechtreeList.sort((a, b) => {
        return sortISOByTimeStamp(a.createdAt, b.createdAt, 1)
      }),
    })
  } catch (e) {
    console.log(e)
    dispatch({ type: READ_TECHTREE_LIST_FAIL })
  }
}

export const readTechtree = (techtreeID) => async (dispatch) => {
  dispatch({ type: READ_TECHTREE_DATA_TRY })
  try {
    const res = await axios({
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${techtreeID}`,
    })
    const parsedNodeList = JSON.parse(res.data.nodeList)
    const parsedLinkList = JSON.parse(res.data.linkList)
    const parsedTechtreeData = {
      ...res.data,
      nodeList: parsedNodeList,
      linkList: parsedLinkList,
    }
    console.log('파싱된 테크트리 데이터: ', parsedTechtreeData)
    dispatch({
      type: READ_TECHTREE_DATA_SUCCESS,
      techtreeData: parsedTechtreeData,
    })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: READ_TECHTREE_DATA_FAIL })
  }
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
        linkList: action.linkList,
      }
    case CREATE_NODE:
      return {
        ...state,
        techtreeData: {
          ...state.techtreeData,
          nodeList: action.nodeList,
        },
        nodeList: action.nodeList,
      }
    case DELETE_NODE:
      return {
        ...state,
        nodeList: action.newNodeList,
        linkList: action.newLinkList,
        techtreeData: {
          ...state.techtreeData,
          nodeList: action.newNodeList,
          linkList: action.newLinkList,
        },
      }
    case DELETE_LINK:
      return {
        ...state,
        linkList: action.newLinkList,
        techtreeData: {
          ...state.techtreeData,
          linkList: action.newLinkList,
        },
      }
    case EDIT_TECHTREE:
      return {
        ...state,
        isEditingTechtree: true,
      }
    case FINISH_TECHTREE_EDIT:
      return {
        ...state,
        isEditingTechtree: false,
      }
    case EDIT_DOCUMENT:
      return {
        ...state,
        isEditingDocument: true,
      }
    case FINISH_DOCU_EDIT:
      const changingIndex = state.nodeList.findIndex(
        (element) => action.nodeID === element.id
      )
      const changingNode = state.nodeList[changingIndex]
      const newNodeList = state.nodeList
      newNodeList[changingIndex] = {
        ...changingNode,
        id: action.nodeID,
        name: action.nodeName,
        body: action.nodeBody,
      }
      return {
        ...state,
        techtreeData: { ...state.techtreeData, nodeList: newNodeList },
        nodeList: newNodeList,
        isEditingDocument: false,
        isEditingTechtree: false,
      }
    case SELECT_NODE:
      return {
        ...state,
        selectedNode: action.node,
        previousNodeList: action.previousNodeList,
        nextNodeList: action.nextNodeList,
      }
    case READ_TECHTREE_LIST_TRY:
      return {
        ...state,
        loading: true,
        techtreeList: [],
      }
    case READ_TECHTREE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        techtreeList: action.techtreeList,
      }
    case READ_TECHTREE_LIST_FAIL:
      return {
        ...state,
        loading: false,
        techtreeList: [],
      }
    case READ_TECHTREE_DATA_TRY:
      return {
        ...state,
        loading: true,
        techtreeData: {},
        nodeList: [],
        linkList: [],
      }
    case READ_TECHTREE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        techtreeData: action.techtreeData,
        nodeList: action.techtreeData.nodeList,
        linkList: action.techtreeData.linkList,
      }
    case READ_TECHTREE_DATA_FAIL:
      return {
        ...state,
        loading: false,
      }
    default:
      return { ...state }
  }
}
