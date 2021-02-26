import axios from 'axios'
import { authService } from '../lib/firebase'
import { uid } from 'uid'
import { sortISOByTimeStamp } from '../lib/functions'
import { whiteURL } from '../lib/constants'
import { db, firebaseInstance } from '../lib/firebase'

const nodePlaceholder =
  '\n1. 캔버스 위에서 더블 클릭하면, 노드가 만들어져요. \n\n2. 노드를 클릭하면 문서를 작성할 수 있어요.\n\n3. 노드에서 다른 노드로 마우스 드래그를 하면 연결관계를 표현할 수 있어요.\n\n4. 수정모드에서는 노드나 링크를 삭제하거나, 노드를 드래그해서 위치를 바꿀 수 있어요.\n\n5. 코드블럭과 레이텍 문법을 지원합니다.\n\n6. 문서 에디터에 이미지를 드래그 드롭하면 사진을 첨부할 수 있어요.'

const testNodeList =
  '[{"id":"nodee72742ae83f80a1185c8","name":"어떻게 사용하나요?","x":466.3125,"y":159.0851058959961,"radius":15,"body":"캔버스 위를 더블클릭하면 노드가 생겨나요.\\n\\n![1.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/481613567677406.gif)\\n\\n하나의 노드에는 하나의 문서가 연결돼 있어요.\\n\\n노드를 클릭하면 연결된 문서를 열람하고 편집할 수 있어요.","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node72742ae83f80a1185c8d","name":"문서 작성법을 알려주세요!","x":270.4685363769531,"y":256.3616943359375,"radius":15,"body":"드래그 드롭으로 사진을 올릴 수 있어요.\\n![2.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/9091613567728867.gif)\\n코드블록 기능과 \\nLaTeX 수식입력 기능을 지원해요. \\n\\n```c\\nprintf(\'hello, foresty!\')\\n```\\n\\n\\n\\n\\n$$\\n-\\\\frac{\\\\hbar^{2}}{2m} \\\\nabla^{2} \\\\psi + V \\\\psi = E \\\\psi\\n$$\\n\\n\\n## 마크다운\\n\\n*마크다운 문법* 과 [외부링크](https://www.foresty.net)를 삽입하는 기능도 지원해요. \\n","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node2742ae83f80a1185c8d0","name":"노드와 노드를 연결하세요!","x":471.5678253173828,"y":366.2057189941406,"radius":15,"body":"![3.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/9961613567854484.gif)\\n\\n노드에서 다른 노드로 드래그를 해서 링크를 연결할 수 있어요. \\n\\n링크가 연결되면 문서 하단에 자동으로 연관 링크 버튼이 나타나요.\\n\\n문서간의 연결관계를 한눈에 볼 수 있답니다!\\n","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"nodee83f80a1185c8d0b7a21","name":"Contact Here!","x":511.0713195800781,"y":617.1347961425781,"radius":15,"body":"\\n\\nemail: contact@foresty.net\\n\\n","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node243f78ce5cae6f8f5017","name":"Click Me!","x":248.95333862304688,"y":57.75886154174805,"radius":15,"body":"Foresty 는 지식을 가꾸고 공유하는 노트테이킹&블로깅 커뮤니티입니다. \\n\\n","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node3f78ce5cae6f8f5017f9","name":"전공별 게시판","x":184.93206787109375,"y":634.8865356445312,"radius":15,"body":"전공별 게시판을 통해 전공끼리 통하는 정보를 공유할 수 있어요","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node1404f55e439124249a1e","name":"트리의 모양을 마음껏 수정하세요!","x":342.10028076171875,"y":483.4468078613281,"radius":15,"body":"\\n![4.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/1011613567929412.gif)\\n수정모드에서 노드를 드래그해서 위치를 바꿀수 있어요. \\n\\n노드나 링크를 삭제할 수도 있구요.","hashtags":[],"fillColor":"#69bc69","parentNodeID":[],"childNodeID":[]}]'

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
  treeLikeUsers: [],
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

const FORK_TREE_TRY = 'techtree/FORK_TREE_TRY'
const FORK_TREE_SUCCESS = 'techtree/FORK_TREE_SUCCESS'
const FORK_TREE_FAIL = 'techtree/FORK_TREE_FAIL'

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

export const createTechtree = (userInfo) => async (
  dispatch,
  getState,
  { history }
) => {
  dispatch({ type: CREATE_TECHTREE_DATA_TRY })
  const techtreeID = uid(24)

  db.collection('trees')
    .doc(techtreeID)
    .set({
      title: '',
      _id: techtreeID,
      hashtags: [],
      nodeList: `[]`,
      linkList: `[]`,
      thumbnail: whiteURL,
      author: userInfo,
      createdAt: firebaseInstance.firestore.FieldValue.serverTimestamp(),
      like_user: [],
    })
    .then(() => {
      dispatch({ type: CREATE_TECHTREE_DATA_SUCCESS })
      history.push(`/tree/${techtreeID}`)
    })
    .catch((error) => {})
  //authService.currentUser
  //  .getIdToken(true)
  //  .then(async (idToken) => {
  //    await axios({
  //      method: 'post',
  //      url: `${process.env.REACT_APP_BACKEND_URL}/techtree`,
  //      headers: { 'Content-Type': 'application/json' },
  //      data: {
  //        title: '',
  //        _id: techtreeID,
  //        hashtags: [],
  //        nodeList: `[]`,
  //        linkList: `[]`,
  //        thumbnail: whiteURL,
  //        firebaseToken: idToken,
  //      },
  //    })
  //  })
  //  .then(() => {
  //    dispatch({ type: CREATE_TECHTREE_DATA_SUCCESS })
  //    history.push(`/tree/${techtreeID}`)
  //  })
  //  .catch((e) => {
  //    //console.log('error: ', e)
  //  })
}

export const forkTree = (
  treeData,
  nodeList,
  linkList,
  myID,
  thumbnailURL
) => async (dispatch, getState, { history }) => {
  const techtreeID = uid(24)
  const forkedTreeData = {
    ...treeData,
    _id: techtreeID,
    nodeList: nodeList,
    linkList: linkList,
    author: { ...treeData.author, firebaseUid: myID },
  }
  dispatch({ type: FORK_TREE_TRY })
  try {
    authService.currentUser
      .getIdToken(true)
      .then(async (idToken) => {
        await axios({
          method: 'post',
          url: `${process.env.REACT_APP_BACKEND_URL}/techtree`,
          headers: { 'Content-Type': 'application/json' },
          data: {
            title: treeData.title,
            _id: techtreeID,
            hashtags: [],
            nodeList: JSON.stringify(nodeList),
            linkList: JSON.stringify(linkList),
            thumbnail: thumbnailURL,
            firebaseToken: idToken,
          },
        })
      })
      .then(() => {
        dispatch({ type: FORK_TREE_SUCCESS, treeData: forkedTreeData })
      })
      .then(() => {
        history.push(`/tree/${techtreeID}`)
      })
  } catch (e) {
    dispatch({ type: FORK_TREE_FAIL })
    //console.log('error: ', e)
  }
}

export const deleteTechtree = (techtreeID) => async (
  dispatch,
  getState,
  { history }
) => {
  dispatch({ type: DELETE_TECHTREE_DATA_TRY })
  try {
    await axios({
      method: 'delete',
      url: `${process.env.REACT_APP_BACKEND_URL}/techtree/${techtreeID}`,
    })
    dispatch({ type: DELETE_TECHTREE_DATA_SUCCESS })
    history.push('/forest?page=1')
  } catch (e) {
    //console.log('error: ', e)
    dispatch({ type: DELETE_TECHTREE_DATA_FAIL })
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
    //const treeRef = db.collection('trees').doc(techtreeID)
    //const res = await treeRef.update({
    //  title: techtreeTitle,
    //  nodeList: JSON.stringify(nodeList),
    //  linkList: JSON.stringify(linkList),
    //  thumbnail: thumbnailURL,
    //})

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
    //console.log('error: ', e)
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
    // console.log('error: ', e)
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
    // console.log('error: ', e)
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
    //const docRef = db.collection('trees').doc(techtreeID)
    //docRef.get().then((doc) => {
    //  console.log(doc.data())
    //  dispatch({
    //    type: READ_TECHTREE_DATA_SUCCESS,
    //    techtreeData: {
    //      ...doc.data(),
    //      nodeList: JSON.parse(doc.data().nodeList),
    //      linkList: JSON.parse(doc.data().linkList),
    //    },
    //  })
    //})

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
    case DELETE_TECHTREE_DATA_TRY:
      return {
        ...state,
        loading: true,
      }
    case DELETE_TECHTREE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case DELETE_TECHTREE_DATA_FAIL:
      return {
        ...state,
        loading: false,
      }

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
        treeLikeUsers: [],
      }
    case READ_TECHTREE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        techtreeData: action.techtreeData,
        techtreeTitle: action.techtreeData.title,
        nodeList: action.techtreeData.nodeList,
        linkList: action.techtreeData.linkList,
        treeLikeUsers: action.techtreeData.like_user,
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
        treeLikeUsers: [],
      }
    case CREATE_TECHTREE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
      }

    case FORK_TREE_TRY:
      return {
        ...state,
        isEditingTechtree: false,
        isEditingDocument: false,
        loading: true,
        techtreeData: {},
        nodeList: [],
        linkList: [],
        previousNodeList: [],
        nextNodeList: [],
        techtreeTitle: [],
        selectedNode: {
          name: '',
          body: nodePlaceholder,
        },
        treeLikeUsers: [],
      }
    case FORK_TREE_SUCCESS:
      return {
        ...state,
        loading: false,
        isEditingTechtree: false,
        isEditingDocument: false,
        techtreeData: action.treeData,
        nodeList: action.treeData.nodeList,
        linkList: action.treeData.linkList,
        previousNodeList: [],
        nextNodeList: [],
        techtreeTitle: action.treeData.title,
        selectedNode: {
          name: '',
          body: nodePlaceholder,
        },
        treeLikeUsers: [],
      }
    case FORK_TREE_FAIL:
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
