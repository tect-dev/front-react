import translationText from '../lib/translation.json'

const nodePlaceholder = translationText.en.nodePlaceholder

const initialState = {
  demoTitle: 'What Is The Foresty ?',
  demoNodeList: JSON.parse(
    translationText.en.demoNodeString //'[{"id":"nodee72742ae83f80a1185c8","name":"어떻게 사용하나요?","x":466.3125,"y":159.0851058959961,"radius":15,"body":"캔버스 위를 더블클릭하면 노드가 생겨나요.\\n\\n![1.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/481613567677406.gif)\\n\\n하나의 노드에는 하나의 문서가 연결돼 있어요.\\n\\n노드를 클릭하면 연결된 문서를 열람하고 편집할 수 있어요.","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node72742ae83f80a1185c8d","name":"문서 작성법을 알려주세요!","x":270.4685363769531,"y":256.3616943359375,"radius":15,"body":"드래그 드롭으로 사진을 올릴 수 있어요.\\n![2.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/9091613567728867.gif)\\n코드블록 기능과 \\nLaTeX 수식입력 기능을 지원해요. \\n\\n```c\\nprintf(\'hello, foresty!\')\\n```\\n\\n\\n\\n\\n$$\\n-\\\\frac{\\\\hbar^{2}}{2m} \\\\nabla^{2} \\\\psi + V \\\\psi = E \\\\psi\\n$$\\n\\n\\n## 마크다운\\n\\n*마크다운 문법* 과 [외부링크](https://www.foresty.net)를 삽입하는 기능도 지원해요. \\n","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node2742ae83f80a1185c8d0","name":"노드와 노드를 연결하세요!","x":471.5678253173828,"y":366.2057189941406,"radius":15,"body":"![3.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/9961613567854484.gif)\\n\\n노드에서 다른 노드로 드래그를 해서 링크를 연결할 수 있어요. \\n\\n링크가 연결되면 문서 하단에 자동으로 연관 링크 버튼이 나타나요.\\n\\n문서간의 연결관계를 한눈에 볼 수 있답니다!\\n","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"nodee83f80a1185c8d0b7a21","name":"Contact Here!","x":511.0713195800781,"y":617.1347961425781,"radius":15,"body":"\\n\\nemail: contact@foresty.net\\n\\n문의와 버그리포팅은 이곳으로 연락주세요!\\n","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node243f78ce5cae6f8f5017","name":"Click Me!","x":248.95333862304688,"y":57.75886154174805,"radius":15,"body":"Foresty 는 지식을 가꾸고 공유하는 노트테이킹&블로깅 커뮤니티입니다. \\n\\n","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node3f78ce5cae6f8f5017f9","name":"전공별 게시판","x":184.93206787109375,"y":634.8865356445312,"radius":15,"body":"전공별 게시판을 통해 전공끼리 통하는 정보를 공유할 수 있어요","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node1404f55e439124249a1e","name":"트리의 모양을 마음껏 수정하세요!","x":342.10028076171875,"y":483.4468078613281,"radius":15,"body":"\\n![4.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/1011613567929412.gif)\\n수정모드에서 노드를 드래그해서 위치를 바꿀수 있어요. \\n\\n노드나 링크를 삭제할 수도 있구요.","hashtags":[],"fillColor":"#69bc69","parentNodeID":[],"childNodeID":[]}]'
  ),
  demoLinkList: JSON.parse(
    translationText.en.demoLinkString //'[{"startNodeID":"nodee72742ae83f80a1185c8","startX":466.3125,"startY":159.0851058959961,"endNodeID":"node72742ae83f80a1185c8d","id":"link742ae83f80a1185c8d0b","endX":270.4685363769531,"endY":256.3616943359375},{"startNodeID":"node243f78ce5cae6f8f5017","startX":248.95333862304688,"startY":57.75886154174805,"endNodeID":"nodee72742ae83f80a1185c8","endX":466.3125,"endY":159.0851058959961,"id":"link43f78ce5cae6f8f5017f"},{"startNodeID":"node2742ae83f80a1185c8d0","startX":471.5678253173828,"startY":366.2057189941406,"endNodeID":"node1404f55e439124249a1e","endX":342.10028076171875,"endY":483.4468078613281,"id":"link404f55e439124249a1e0"},{"startNodeID":"node72742ae83f80a1185c8d","startX":270.4685363769531,"startY":256.3616943359375,"endNodeID":"node2742ae83f80a1185c8d0","endX":471.5678253173828,"endY":366.2057189941406,"id":"link04f55e439124249a1e04"},{"startNodeID":"node1404f55e439124249a1e","startX":342.10028076171875,"startY":483.4468078613281,"endNodeID":"node3f78ce5cae6f8f5017f9","id":"linkd48ec2ce053cf67d28ea","endX":184.93206787109375,"endY":634.8865356445312},{"startNodeID":"node1404f55e439124249a1e","startX":342.10028076171875,"startY":483.4468078613281,"endNodeID":"nodee83f80a1185c8d0b7a21","endX":511.0713195800781,"endY":617.1347961425781,"id":"link48ec2ce053cf67d28eab"}]'
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
    //console.log('error: ', e)
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
