const nodePlaceholder =
  'Foresty 는 지식을 가꾸고 공유하는 블로깅 커뮤니티입니다. \n\n지식의 나무가 늘어갈때마다, Foresty 팀이 나무를 심으러 가요!'

const initialState = {
  demoTitle: 'Foresty 는 무엇인가요 ?',
  demoNodeList: JSON.parse(
    '[{"id":"nodee72742ae83f80a1185c8","name":"어떻게 사용하나요?","x":291.3125,"y":66,"radius":15,"body":"캔버스 위를 더블클릭하면 노드가 생겨나요.\\n\\n![1.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/481613567677406.gif)\\n\\n하나의 노드에는 하나의 문서가 연결돼 있어요.\\n\\n노드를 클릭하면 연결된 문서를 열람하고 편집할 수 있어요.","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node72742ae83f80a1185c8d","name":"문서의 기능들","x":362.3125,"y":167,"radius":15,"body":"드래그 드롭으로 사진을 올릴 수 있어요.\\n![2.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/9091613567728867.gif)\\n코드블록 기능과 \\nLaTeX 수식입력 기능을 지원해요. \\n\\n```c\\nprintf(\'hello, foresty!\')\\n```\\n\\n\\n\\n\\n$$\\n-\\\\frac{\\\\hbar^{2}}{2m} \\\\nabla^{2} \\\\psi + V \\\\psi = E \\\\psi\\n$$\\n\\n\\nToday I Learned(TIL) 도 좋고, 단순한 ToDo 목록으로 활용해도 좋아요.","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node2742ae83f80a1185c8d0","name":"노드와 노드를 연결하세요","x":192.3125,"y":185,"radius":15,"body":"![3.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/9961613567854484.gif)\\n\\n노드에서 다른 노드로 드래그를 해서 링크를 연결할 수 있어요. \\n\\n문서간의 연결관계를 한눈에 볼 수 있답니다.\\n\\n아쉽게도 노드 연결 기능은 모바일에서 지원하지 않습니다(열심히 개발하고 있어요!)","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"nodee83f80a1185c8d0b7a21","name":"Contact Here!","x":337.3125,"y":426,"radius":15,"body":"[github repo](https://github.com/tect-dev/front-react)\\n\\nemail: contact@foresty.net\\n\\n","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node243f78ce5cae6f8f5017","name":"Click Me!","x":157.109375,"y":59,"radius":15,"body":"Foresty 는 지식을 가꾸고 공유하는 블로깅 커뮤니티입니다. \\n\\n지식의 나무가 늘어갈때마다, Foresty 팀이 나무를 심으러 가요!","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node3f78ce5cae6f8f5017f9","name":"전공별 게시판","x":160.109375,"y":409,"radius":15,"body":"왜 대학 커뮤니티들은 대학별로 묶이는걸까요? 오히려 같은 전공끼리 공유할 수 있는게 더 많을텐데요.\\n\\n그래서 전공별 게시판을 마련해 놓았습니다.","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node1404f55e439124249a1e","name":"위치를 마음대로 바꾸세요","x":257.703125,"y":301,"radius":15,"body":"\\n![4.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/1011613567929412.gif)\\n수정모드에서 노드를 드래그해서 위치를 바꿀수 있어요. \\n\\n노드나 링크를 삭제할 수도 있구요.","hashtags":[],"fillColor":"#69bc69","parentNodeID":[],"childNodeID":[]}]'
  ),
  demoLinkList: JSON.parse(
    '[{"startNodeID":"nodee72742ae83f80a1185c8","startX":291.3125,"startY":66,"endNodeID":"node72742ae83f80a1185c8d","id":"link742ae83f80a1185c8d0b","endX":362.3125,"endY":167},{"startNodeID":"node243f78ce5cae6f8f5017","startX":157.109375,"startY":59,"endNodeID":"nodee72742ae83f80a1185c8","endX":291.3125,"endY":66,"id":"link43f78ce5cae6f8f5017f"},{"startNodeID":"node2742ae83f80a1185c8d0","startX":192.3125,"startY":185,"endNodeID":"node1404f55e439124249a1e","endX":257.703125,"endY":301,"id":"link404f55e439124249a1e0"},{"startNodeID":"node72742ae83f80a1185c8d","startX":362.3125,"startY":167,"endNodeID":"node2742ae83f80a1185c8d0","endX":192.3125,"endY":185,"id":"link04f55e439124249a1e04"},{"startNodeID":"node1404f55e439124249a1e","startX":257.703125,"startY":301,"endNodeID":"node3f78ce5cae6f8f5017f9","id":"linkd48ec2ce053cf67d28ea","endX":160.109375,"endY":409},{"startNodeID":"node1404f55e439124249a1e","startX":257.703125,"startY":301,"endNodeID":"nodee83f80a1185c8d0b7a21","endX":337.3125,"endY":426,"id":"link48ec2ce053cf67d28eab"}]'
  ),
  isEditingTechtree: false,
  isEditingTechtree: false,
  selectedNode: {
    name: '',
    body: nodePlaceholder,
  },
  previousNodeList: [],
  nextNodeList: [],
}

const CREATE_NODE = 'demo/CREATE_NODE'
const DELETE_NODE = 'demo/DELETE_NODE'

const CREATE_LINK = 'demo/CREATE_LINK'
const DELETE_LINK = 'demo/DELETE_LINK'

const START_EDIT_DOCU = 'demo/START_EDIT_DOCU'
const FINISH_EDIT_DOCU = 'demo/FINISH_EDIT_DOCU'

const EDIT_TECHTREE = 'demo/EDIT_TECHTREE'
const FINISH_TECHTREE_EDIT = 'demo/FINISH_TECHTREE_EDIT'

const SELECT_NODE = 'demo/SELECT_NODE'

export const startEditDocu = () => {
  return { type: START_EDIT_DOCU }
}
export const finishEditDocu = (
  nodeID,
  nodeName,
  nodeBody,
  nodeList,
  linkList,
  techtreeData
) => {
  const changingIndex = nodeList.findIndex((element) => nodeID === element.id)
  const changingNode = nodeList[changingIndex]
  const newNodeList = nodeList
  newNodeList[changingIndex] = {
    ...changingNode,
    id: nodeID,
    name: nodeName,
    body: nodeBody,
  }
  return { type: FINISH_EDIT_DOCU, newNodeList, nodeName, nodeBody }
}

export const finishTreeEdit = () => {}

export const startEditTree = () => {}
export const changeTreeTitle = () => (dispatch) => {}

export const selectNode = (prevNodeList, nextNodeList, node) => (dispatch) => {
  dispatch({ type: SELECT_NODE, prevNodeList, nextNodeList, node })
}

export const createNode = (newNodeList, linkList, techtreeData) => async (
  dispatch
) => {
  dispatch({ type: CREATE_NODE, newNodeList })
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
    dispatch({ type: DELETE_NODE, newNodeList, newLinkList })
  } catch (e) {
    alert('error: ', e)
    //dispatch({ type: CREATE_QUESTION_new, error: e })
    //diLinkch({ type: CREATLinkESTION_new, error: e })
  }
}

export const createLink = (nodeList, linkList, techtreeData) => async (
  dispatch
) => {
  dispatch({ type: CREATE_LINK, demoLinkList: linkList })
}

export const deleteLink = (nodeList, linkList, techtreeData, link) => async (
  dispatch
) => {
  const newLinkList = linkList.filter((ele) => {
    return ele.id !== link.id
  })
  try {
    dispatch({ type: DELETE_LINK, newLinkList })
  } catch (e) {
    console.log('error: ', e)
  }
}

export default function demo(state = initialState, action) {
  switch (action.type) {
    case START_EDIT_DOCU:
      return {
        ...state,
        isEditingDocument: true,
      }
    case FINISH_EDIT_DOCU:
      return {
        ...state,
        demoNodeList: action.newNodeList,
        isEditingDocument: false,
        selectedNode: {
          ...state.selectedNode,
          name: action.nodeName,
          body: action.nodeBody,
        },
      }

    case SELECT_NODE:
      return {
        ...state,
        previousNodeList: action.prevNodeList,
        nextNodeList: action.nextNodeList,
        selectedNode: action.node,
      }
    case CREATE_NODE:
      return {
        ...state,
        demoNodeList: action.newNodeList,
      }
    case DELETE_NODE:
      return {
        ...state,
        demoNodeList: action.newNodeList,
        demoLinkList: action.newLinkList,
      }

    case CREATE_LINK:
      return {
        ...state,
        demoLinkList: action.demoLinkList,
      }

    case DELETE_LINK:
      return {
        ...state,
        demoLinkList: action.newLinkList,
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
    default:
      return {
        ...state,
      }
  }
}
