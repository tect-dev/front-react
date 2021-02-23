import axios from 'axios'
import { authService } from '../lib/firebase'
import { uid } from 'uid'
import { sortISOByTimeStamp } from '../lib/functions'
import { whiteURL } from '../lib/constants'

const nodePlaceholder =
  '\n1. 캔버스 위에서 더블 클릭하면, 노드가 만들어져요. \n\n2. 노드를 클릭하면 문서를 작성할 수 있어요.\n\n3. 노드에서 다른 노드로 마우스 드래그를 하면 연결관계를 표현할 수 있어요.\n\n4. 수정모드에서는 노드나 링크를 삭제하거나, 노드를 드래그해서 위치를 바꿀 수 있어요.\n\n5. 코드블럭과 레이텍 문법을 지원합니다.\n\n6. 문서 에디터에 이미지를 드래그 드롭하면 사진을 첨부할 수 있어요.'

const initialState = {
  loading: false,
  techtreeList: [],
  previousNodeList: [],
  nextNodeList: [],
  selectedNode: {
    name: '',
    body: nodePlaceholder,
  },
  isEditingDocument: false,
  isEditingTechtree: false,
  isSavingTechtree: false,
  nodeList: [{}],
  linkList: [{}],
  techtreeTitle: '',
  techtreeData: {
    title: 'empty',
    nodeList: [{}],
    linkList: [{}],
    author: {
      firebaseUid: '',
    },
  },
  treeSum: null,
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

const UPDATE_TECHTREE_DATA_TRY = 'techtree/UPDATE_TECHTREE_DATA_TRY'
const UPDATE_TECHTREE_DATA_SUCCESS = 'techtree/UPDATE_TECHTREE_DATA_SUCCESS'
const UPDATE_TECHTREE_DATA_FAIL = 'techtree/UPDATE_TECHTREE_DATA_FAIL'

const DELETE_TECHTREE_DATA_TRY = 'techtree/DELETE_TECHTREE_DATA_TRY'
const DELETE_TECHTREE_DATA_SUCCESS = 'techtree/DELETE_TECHTREE_DATA_SUCCESS'
const DELETE_TECHTREE_DATA_FAIL = 'techtree/DELETE_TECHTREE_DATA_FAIL'

const CREATE_TECHTREE_DATA_TRY = 'techtree/CREATE_TECHTREE_DATA_TRY'
const CREATE_TECHTREE_DATA_SUCCESS = 'techtree/CREATE_TECHTREE_DATA_SUCCESS'

const CHANGE_TECHTREE_TITLE = 'techtree/CHANGE_TECHTREE_TITLE'
const CHANGE_DOCUMENT = 'tectree/CHANGE_DOCUMENT'

const LIKE_TREE_TRY = 'techtree/LIKE_TREE_TRY'
const LIKE_TREE_SUCCESS = 'techtree/LIKE_TREE_SUCCESS'
const LIKE_TREE_FAIL = 'techtree/LIKE_TREE_FAIL'

// updateTechtree: 백엔드에 업데이트를 갱신함.
// changeTechtree: 클라이언트상에서의 변화.

export const likeTree = (treeID) => async (dispatch) => {
  dispatch({ type: LIKE_TREE_TRY })
  try {
    await authService.currentUser.getIdToken(true).then(async (idToken) => {
      const res = await axios({
        method: 'put',
        url: `${process.env.REACT_APP_BACKEND_URL}/like/techtree/${treeID}`,
        headers: { 'Content-Type': 'application/json' },
        data: { firebaseToken: idToken },
      })
    })
    await dispatch({ type: LIKE_TREE_SUCCESS })
  } catch (e) {
    await dispatch({ type: LIKE_TREE_FAIL, error: e })
  }
}

export const changeDocument = (documentTitle, documentText) => {
  return { type: CHANGE_DOCUMENT, documentTitle, documentText }
}

export const changeTechtreeTitle = (techtreeTitle) => {
  return { type: CHANGE_TECHTREE_TITLE, techtreeTitle }
}

export const createTechtree = () => async (dispatch, getState, { history }) => {
  dispatch({ type: CREATE_TECHTREE_DATA_TRY })
  const techtreeID = uid(24)

  authService.currentUser
    .getIdToken(true)
    .then(async (idToken) => {
      await axios({
        method: 'post',
        url: `${process.env.REACT_APP_BACKEND_URL}/techtree`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          title: '',
          _id: techtreeID,
          hashtags: [],
          nodeList: `[]`,
          linkList: `[]`,
          thumbnail: whiteURL,
          firebaseToken: idToken,
        },
      })
    })
    .then(() => {
      dispatch({ type: CREATE_TECHTREE_DATA_SUCCESS })
      history.push(`/tree/${techtreeID}`)
    })
    .catch((e) => {
      console.log('error: ', e)
    })
}

export const deleteTechtree = (techtreeID) => async (
  dispatch,
  getState,
  { history }
) => {
  try {
    await axios({
      method: 'delete',
      url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${techtreeID}`,
    })
    history.push('/forest')
  } catch (e) {
    console.log('error: ', e)
  }
}
export const updateTechtree = (
  nodeList,
  linkList,
  techtreeID,
  techtreeTitle,
  thumbnailURL
) => async (dispatch) => {
  dispatch({ type: UPDATE_TECHTREE_DATA_TRY })
  try {
    await axios({
      method: 'put',
      url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${techtreeID}`,
      data: {
        title: techtreeTitle,
        nodeList: JSON.stringify(nodeList),
        linkList: JSON.stringify(linkList),
        thumbnail: thumbnailURL,
      },
    })
    dispatch({ type: UPDATE_TECHTREE_DATA_SUCCESS, techtreeTitle })
  } catch (e) {
    dispatch({ type: UPDATE_TECHTREE_DATA_FAIL })
    console.log('error: ', e)
  }
}
export const editTechtree = () => {
  return { type: EDIT_TECHTREE }
}
export const editDocument = () => {
  return { type: EDIT_DOCUMENT }
}
export const finishTechtreeEdit = () => {
  return { type: FINISH_TECHTREE_EDIT }
}
export const finishDocuEdit = (
  nodeID,
  nodeName,
  nodeBody,
  nodeList,
  linkList,
  techtreeData
) => {
  const techtreeID = techtreeData._id
  const techtreeTitle = techtreeData.title
  const changingIndex = nodeList.findIndex((element) => nodeID === element.id)
  const changingNode = nodeList[changingIndex]
  const newNodeList = nodeList
  newNodeList[changingIndex] = {
    ...changingNode,
    id: nodeID,
    name: nodeName,
    body: nodeBody,
  }
  authService.currentUser.getIdToken(true).then(async (idToken) => {
    axios({
      method: 'put',
      url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${techtreeID}`,
      data: {
        title: techtreeTitle,
        nodeList: JSON.stringify(nodeList),
        linkList: JSON.stringify(linkList),
        _id: techtreeID,
        firebaseToken: idToken,
      },
    })
  })

  return { type: FINISH_DOCU_EDIT, newNodeList, nodeName, nodeBody }
}

export const selectNode = (previousNodeList, nextNodeList, node) => {
  return { type: SELECT_NODE, previousNodeList, nextNodeList, node }
}

export const createNode = (nodeList, linkList, techtreeData) => {
  const techtreeID = techtreeData._id
  const techtreeTitle = techtreeData.title
  authService.currentUser.getIdToken(true).then(async (idToken) => {
    axios({
      method: 'put',
      url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${techtreeID}`,
      data: {
        title: techtreeTitle,
        nodeList: JSON.stringify(nodeList),
        linkList: JSON.stringify(linkList),
        _id: techtreeID,
        firebaseToken: idToken,
      },
    })
  })
  return { type: CREATE_NODE, nodeList: nodeList }
}
export const createLink = (nodeList, linkList, techtreeData) => async (
  dispatch
) => {
  const techtreeID = techtreeData._id
  const techtreeTitle = techtreeData.title
  try {
    authService.currentUser.getIdToken(true).then(async (idToken) => {
      axios({
        method: 'put',
        url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${techtreeID}`,
        data: {
          title: techtreeTitle,
          nodeList: JSON.stringify(nodeList),
          linkList: JSON.stringify(linkList),
          _id: techtreeID,
          firebaseToken: idToken,
        },
      })
    })
    dispatch({ type: CREATE_LINK, linkList: linkList })
  } catch (e) {
    console.log('error: ', e)
  }
}
export const deleteNode = (
  nodeList,
  linkList,
  techtreeID,
  node,
  techtreeData
) => async (dispatch) => {
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
  try {
    const stringifiedNodeList = JSON.stringify(newNodeList)
    const stringifiedLinkList = JSON.stringify(newLinkList)
    authService.currentUser.getIdToken(true).then(async (idToken) => {
      const res = await axios({
        method: 'put',
        url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${techtreeID}`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          title: techtreeData.title,
          _id: uid(24),
          hashtags: [],
          nodeList: stringifiedNodeList,
          linkList: stringifiedLinkList,
          firebaseToken: idToken,
        },
      })
    })
    dispatch({ type: DELETE_NODE, newNodeList, newLinkList })
  } catch (e) {
    alert('error: ', e)
    //dispatch({ type: CREATE_QUESTION_FAIL, error: e })
  }
  // .splice 는 원본배열을 조작하는것. 반환값은 원본배열에서 잘라낸것만 반환한다.
  //nodeList.splice(deleteNodeIndex, 1)
}

export const deleteLink = (nodeList, linkList, techtreeData, link) => async (
  dispatch
) => {
  const techtreeID = techtreeData._id
  const techtreeTitle = techtreeData.title
  const newLinkList = linkList.filter((ele) => {
    return ele.id !== link.id
  })
  try {
    axios({
      method: 'put',
      url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${techtreeID}`,
      data: {
        title: techtreeTitle,
        nodeList: JSON.stringify(nodeList),
        linkList: JSON.stringify(newLinkList),
      },
    })
    dispatch({ type: DELETE_LINK, newLinkList })
  } catch (e) {
    console.log('error: ', e)
  }
}

export const readTechtreeList = (pageNumber) => async (dispatch) => {
  dispatch({ type: READ_TECHTREE_LIST_TRY })
  try {
    const res = await axios({
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/techtree/page/${pageNumber}`,
    })
    // 여기서 모든 배열내의 테크트리들 바꿔서 정리해줘야하네.
    const parsedTechtreeList = res.data.techTree.map((techtreeData) => {
      try {
        const parsedNodeList = JSON.parse(techtreeData.nodeList)
        const parsedLinkList = JSON.parse(techtreeData.linkList)
        return {
          ...techtreeData,
          nodeList: parsedNodeList,
          linkList: parsedLinkList,
        }
      } catch (e) {
        return {
          ...techtreeData,
          nodeList: [],
          linkList: [],
        }
      }
    })
    dispatch({
      type: READ_TECHTREE_LIST_SUCCESS,
      techtreeList: parsedTechtreeList.sort((a, b) => {
        return sortISOByTimeStamp(a.createdAt, b.createdAt, 1)
      }),
      treeSum: res.data.techTreeSum,
    })
  } catch (e) {
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
    try {
      const parsedNodeList = JSON.parse(res.data.nodeList)
      const parsedLinkList = JSON.parse(res.data.linkList)
      const parsedTechtreeData = {
        ...res.data,
        nodeList: parsedNodeList,
        linkList: parsedLinkList,
      }
      dispatch({
        type: READ_TECHTREE_DATA_SUCCESS,
        techtreeData: parsedTechtreeData,
      })
    } catch (e) {
      const parsedNodeList = []
      const parsedLinkList = []
      const parsedTechtreeData = {
        ...res.data,
        nodeList: parsedNodeList,
        linkList: parsedLinkList,
      }
      dispatch({
        type: READ_TECHTREE_DATA_SUCCESS,
        techtreeData: parsedTechtreeData,
      })
    }
  } catch (e) {
    console.log('error_READ_TECHTREE_DATA_FAIL: ', e)
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
      return {
        ...state,
        techtreeData: { ...state.techtreeData, nodeList: action.newNodeList },
        nodeList: action.newNodeList,
        isEditingDocument: false,
        //isEditingTechtree: false,
        selectedNode: {
          ...state.selectedNode,
          name: action.nodeName,
          body: action.nodeBody,
        },
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
        treeSum: action.treeSum,
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
        isEditingTechtree: false,
        isEditingDocument: false,
        techtreeData: {},
        nodeList: [],
        linkList: [],
        previousNodeList: [],
        nextNodeList: [],
        techtreeTitle: '',
        selectedNode: {
          name: '',
          body: nodePlaceholder,
        },
      }
    case READ_TECHTREE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        techtreeData: action.techtreeData,
        techtreeTitle: action.techtreeData.title,
        nodeList: action.techtreeData.nodeList,
        linkList: action.techtreeData.linkList,
      }
    case READ_TECHTREE_DATA_FAIL:
      return {
        ...state,
        loading: false,
      }
    case CREATE_TECHTREE_DATA_TRY:
      return {
        ...state,
        loading: true,
      }
    case CREATE_TECHTREE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case CHANGE_TECHTREE_TITLE:
      return {
        ...state,
        techtreeTitle: action.techtreeTitle,
        techtreeData: {
          ...state.techtreeData,
          techtreeTitle: action.techtreeTitle,
        },
      }
    case CHANGE_DOCUMENT:
      return {
        ...state,
        selectedNode: {
          ...state.selectedNode,
          nodeName: action.documentTitle,
          nodeBody: action.documentText,
        },
      }
    case UPDATE_TECHTREE_DATA_TRY:
      return {
        ...state,
        isSavingTechtree: true,
      }
    case UPDATE_TECHTREE_DATA_SUCCESS:
      return {
        ...state,
        isSavingTechtree: false,
      }
    case UPDATE_TECHTREE_DATA_FAIL:
      return {
        ...state,
        isSavingTechtree: false,
      }
    default:
      return { ...state }
  }
}
