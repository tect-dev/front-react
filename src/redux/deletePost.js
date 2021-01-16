import axios from 'axios'

const initialState = {
  loading: false,
  error: null,
}

// action types

const DELETE_QUESTION_TRY = 'question/DELETE_QUESTION_TRY'
const DELETE_QUESTION_SUCCESS = 'question/DELETE_QUESTION_SUCCESS'
const DELETE_QUESTION_FAIL = 'question/DELETE_QUESTION_FAIL'

const DELETE_ANSWER_TRY = 'answer/DELETE_ANSWER_TRY'
const DELETE_ANSWER_SUCCESS = 'answer/DELETE_ANSWER_SUCCESS'
const DELETE_ANSWER_FAIL = 'answer/DELETE_ANSWER_FAIL'

const DELETE_ARTICLE_TRY = 'article/DELETE_ARTICLE_TRY'
const DELETE_ARTICLE_SUCCESS = 'article/DELETE_ARTICLE_SUCCESS'
const DELETE_ARTICLE_FAIL = 'article/DELETE_ARTICLE_FAIL'

const DELETE_COMMENT_TRY = 'comment/DELETE_COMMENT_TRY'
const DELETE_COMMENT_SUCCESS = 'comment/DELETE_COMMENT_SUCCESS'
const DELETE_COMMENT_FAIL = 'comment/DELETE_COMMENT_FAIL'

// thunk를 사용할때는 thunk 함수를 dispatch 하므로, 굳이 액션생성함수를 만들어서 export 해줄 필요가 없다.

export const deleteQuestion = (questionID) => async (
  dispatch,
  getState,
  { history }
) => {
  dispatch({ type: DELETE_QUESTION_TRY })
  try {
    await axios({
      method: 'delete',
      url: `/question/${questionID}`,
    })
    await dispatch({ type: DELETE_QUESTION_SUCCESS })
    history.push('/question')
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: DELETE_QUESTION_FAIL, error: e })
    alert('게시글을 삭제하는데 오류가 발생했습니다.')
  }
}

export const deleteAnswer = (answerID) => async (dispatch) => {
  dispatch({ type: DELETE_ANSWER_TRY })
  try {
    await axios({
      method: 'delete',
      url: `/answer/${answerID}`,
    })
    dispatch({ type: DELETE_ANSWER_SUCCESS })
    console.log('answer deleted')
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: DELETE_ANSWER_FAIL, error: e })
    alert('게시글을 삭제하는데 오류가 발생했습니다.')
  }
}

export const deleteArticle = (articleID) => async (dispatch) => {
  dispatch({ type: DELETE_ARTICLE_TRY })
  try {
    await axios({
      method: 'delete',
      url: `/article/${articleID}`,
    })
    setTimeout(() => {
      dispatch({ type: DELETE_ARTICLE_SUCCESS })
    }, 500)
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: DELETE_ARTICLE_FAIL, error: e })
  }
}

export const deleteComment = (commentID) => async (dispatch) => {
  dispatch({ type: DELETE_COMMENT_TRY })
  try {
    await axios({
      method: 'delete',
      url: `/comment/${commentID}`,
    })
    await dispatch({ type: DELETE_COMMENT_SUCCESS })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: DELETE_COMMENT_FAIL, error: e })
  }
}

export default function deletePost(state = initialState, action) {
  switch (action.type) {
    case DELETE_QUESTION_TRY:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case DELETE_QUESTION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      }
    case DELETE_QUESTION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    case DELETE_ANSWER_TRY:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case DELETE_ANSWER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      }
    case DELETE_ANSWER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    case DELETE_ARTICLE_TRY:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case DELETE_ARTICLE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      }
    case DELETE_ARTICLE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    case DELETE_COMMENT_TRY:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case DELETE_COMMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      }
    case DELETE_COMMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    default:
      return state
  }
}
