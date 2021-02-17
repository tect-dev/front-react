const nodePlaceholder =
  '\n1. 캔버스 위에서 더블 클릭하면, 노드가 만들어져요. \n\n2. 노드를 클릭하면 문서를 작성할 수 있어요.\n\n3. 노드에서 다른 노드로 마우스 드래그를 하면 연결관계를 표현할 수 있어요.\n\n4. 수정모드에서는 노드나 링크를 삭제하거나, 노드를 드래그해서 위치를 바꿀 수 있어요.\n\n5. 코드블럭과 레이텍 문법을 지원합니다.\n\n6. 문서 에디터에 이미지를 드래그 드롭하면 사진을 첨부할 수 있어요.'

const initialState = {
  demoTitle: 'What is it ?',
  demoNodeList: JSON.parse(
    '[{"id":"nodee72742ae83f80a1185c8","name":"Click Me!","x":90.3125,"y":80,"radius":15,"body":"캔버스 위를 더블클릭하면 노드가 생겨나요.\\n\\n![1.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/481613567677406.gif)\\n\\n노드를 클릭하면 노드와 연결된 문서를 열람하고 편집할 수 있어요.","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node72742ae83f80a1185c8d","name":"문서에는 생각을 정리합니다","x":318.3125,"y":83,"radius":15,"body":"드래그 드롭으로 사진을 올릴 수 있어요.\\n![2.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/9091613567728867.gif)\\n코드블록 기능과 \\nLaTeX 수식입력 기능을 지원해요. \\n\\n```c\\nprintf(\'hello, foresty!\')\\n```\\n\\n\\n\\n\\n$$\\n-\\\\frac{\\\\hbar^{2}}{2m} \\\\nabla^{2} \\\\psi + V \\\\psi = E \\\\psi\\n$$\\n\\n\\nToday I Learned(TIL) 도 좋고, 단순한 ToDo 목록으로 활용해도 좋아요. 뻗어나가는 생각이라면 무엇이든 편리하게 정리하세요.","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node2742ae83f80a1185c8d0","name":"노드와 노드를 연결하세요","x":123.3125,"y":261,"radius":15,"body":"![3.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/9961613567854484.gif)\\n\\n노드에서 다른 노드로 드래그를 해서 링크를 연결할 수 있어요. \\n문서간의 선후관계를 한눈에 볼 수 있답니다.","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"node2ae83f80a1185c8d0b7a","name":"트리를 원하는 대로 수정하세요","x":340.3125,"y":287,"radius":15,"body":"\\n![4.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/1011613567929412.gif)\\n수정모드에서 노드를 드래그하고 원하는 대로 생각을 움직이세요.","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]},{"id":"nodee83f80a1185c8d0b7a21","name":"Contact Here!","x":198.3125,"y":407,"radius":15,"body":"[github repo](https://github.com/tect-dev/front-react)\\n\\nemail: contact@foresty.net\\n\\n","hashtags":[],"fillColor":"#00bebe","parentNodeID":[],"childNodeID":[]}]'
  ),
  demoLinkList: JSON.parse(
    '[{"startNodeID":"nodee72742ae83f80a1185c8","startX":90.3125,"startY":80,"endNodeID":"node72742ae83f80a1185c8d","id":"link742ae83f80a1185c8d0b","endX":318.3125,"endY":83},{"startNodeID":"node72742ae83f80a1185c8d","startX":318.3125,"startY":83,"endNodeID":"node2742ae83f80a1185c8d0","endX":123.3125,"endY":261,"id":"link42ae83f80a1185c8d0b7"},{"startNodeID":"node2742ae83f80a1185c8d0","startX":123.3125,"startY":261,"endNodeID":"node2ae83f80a1185c8d0b7a","endX":340.3125,"endY":287,"id":"linkae83f80a1185c8d0b7a2"}]'
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
