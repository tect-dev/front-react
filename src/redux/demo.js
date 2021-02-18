const nodePlaceholder =
  'Foresty 는 지식을 가꾸고 공유하는 블로깅 커뮤니티입니다. \n\n지식의 나무가 늘어갈때마다, Foresty 팀이 나무를 심으러 가요!'

const initialState = {
  demoTitle: 'Foresty 는 무엇인가요 ?',
  demoNodeList: JSON.parse(
    '[{"id":"nodee72742ae83f80a1185c8","name":"어떻게 사용하나요?","x":260.3125,"y":95,"radius":15,"body":"캔버스 위를 더블클릭하면 노드가 생겨나요.\\n\\n![1.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/481613567677406.gif)\\n\\n하나의 노드에는 하나의 문서가 연결돼 있어요.\\n\\n노드를 클릭하면 연결된 문서를 열람하고 편집할 수 있어요.","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node72742ae83f80a1185c8d","name":"문서의 기능들","x":425.3125,"y":139,"radius":15,"body":"드래그 드롭으로 사진을 올릴 수 있어요.\\n![2.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/9091613567728867.gif)\\n코드블록 기능과 \\nLaTeX 수식입력 기능을 지원해요. \\n\\n```c\\nprintf(\'hello, foresty!\')\\n```\\n\\n\\n\\n\\n$$\\n-\\\\frac{\\\\hbar^{2}}{2m} \\\\nabla^{2} \\\\psi + V \\\\psi = E \\\\psi\\n$$\\n\\n\\nToday I Learned(TIL) 도 좋고, 단순한 ToDo 목록으로 활용해도 좋아요.","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node2742ae83f80a1185c8d0","name":"노드와 노드를 연결하세요","x":267.3125,"y":234,"radius":15,"body":"![3.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/9961613567854484.gif)\\n\\n노드에서 다른 노드로 드래그를 해서 링크를 연결할 수 있어요. \\n\\n문서간의 연결관계를 한눈에 볼 수 있답니다.\\n\\n아쉽게도 노드 연결 기능은 모바일에서 지원하지 않습니다(열심히 개발하고 있어요!)","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node2ae83f80a1185c8d0b7a","name":"트리를 원하는 대로 수정하세요","x":125.3125,"y":312,"radius":15,"body":"\\n![4.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/1011613567929412.gif)\\n수정모드에서 노드를 드래그해서 위치를 바꿀수 있어요. \\n\\n노드나 링크를 삭제할 수도 있구요.","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"nodee83f80a1185c8d0b7a21","name":"Contact Here!","x":398.3125,"y":419,"radius":15,"body":"[github repo](https://github.com/tect-dev/front-react)\\n\\nemail: contact@foresty.net\\n\\n","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node243f78ce5cae6f8f5017","name":"Click Me!","x":88.109375,"y":55,"radius":15,"body":"Foresty 는 지식을 가꾸고 공유하는 블로깅 커뮤니티입니다. \\n\\n지식의 나무가 늘어갈때마다, Foresty 팀이 나무를 심으러 가요!","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node3f78ce5cae6f8f5017f9","name":"전공별 게시판","x":154.109375,"y":421,"radius":15,"body":"왜 대학 커뮤니티들은 대학별로 묶이는걸까요? 오히려 같은 전공끼리 공유할 수 있는게 더 많을텐데요.\\n\\n그래서 전공별 게시판을 마련해 놓았습니다.","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]}]'
  ),
  demoLinkList: JSON.parse(
    '[{"startNodeID":"nodee72742ae83f80a1185c8","startX":260.3125,"startY":95,"endNodeID":"node72742ae83f80a1185c8d","id":"link742ae83f80a1185c8d0b","endX":425.3125,"endY":139},{"startNodeID":"node72742ae83f80a1185c8d","startX":425.3125,"startY":139,"endNodeID":"node2742ae83f80a1185c8d0","endX":267.3125,"endY":234,"id":"link42ae83f80a1185c8d0b7"},{"startNodeID":"node2742ae83f80a1185c8d0","startX":267.3125,"startY":234,"endNodeID":"node2ae83f80a1185c8d0b7a","endX":125.3125,"endY":312,"id":"linkae83f80a1185c8d0b7a2"},{"startNodeID":"node243f78ce5cae6f8f5017","startX":88.109375,"startY":55,"endNodeID":"nodee72742ae83f80a1185c8","endX":260.3125,"endY":95,"id":"link43f78ce5cae6f8f5017f"}]'
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

const EDIT_DOCUMENT = 'demo/EDIT_DOCUMENT'
const FINISH_DOCU_EDIT = 'demo/FINISH_DOCU_EDIT'

const EDIT_TECHTREE = 'demo/EDIT_TECHTREE'
const FINISH_TECHTREE_EDIT = 'demo/FINISH_TECHTREE_EDIT'

const SELECT_NODE = 'techtree/SELECT_NODE'

export const selectNode = (prevNodeList, nextNodeList, node) => {
  return { type: SELECT_NODE, prevNodeList, nextNodeList, node }
}

export const createNode = () => async (dispatch) => {}

export const deleteNode = () => async (dispatch) => {}

export const createLink = () => async (dispatch) => {}

export const deleteLink = () => async (dispatch) => {}

export default function demo(state = initialState, action) {
  switch (action.type) {
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
        demoNodeList: action.demoNodeList,
      }
    case DELETE_NODE:
      return {
        ...state,
        demoNodeList: action.demoNodeList,
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
