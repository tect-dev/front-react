import axios from 'axios'

const initialState = {
  loading: false,
  error: null,
  isUpdated: false,
}

// action types

const UPDATE_QUESTION_TRY = 'question/UPDATE_QUESTION_TRY'
const UPDATE_QUESTION_SUCCESS = 'question/UPDATE_QUESTION_SUCCESS'
const UPDATE_QUESTION_FAIL = 'question/UPDATE_QUESTION_FAIL'

const UPDATE_ANSWER_TRY = 'answer/UPDATE_ANSWER_TRY'
const UPDATE_ANSWER_SUCCESS = 'answer/UPDATE_ANSWER_SUCCESS'
const UPDATE_ANSWER_FAIL = 'answer/UPDATE_ANSWER_FAIL'

const UPDATE_ARTICLE_TRY = 'article/UPDATE_ARTICLE_TRY'
const UPDATE_ARTICLE_SUCCESS = 'article/UPDATE_ARTICLE_SUCCESS'
const UPDATE_ARTICLE_FAIL = 'article/UPDATE_ARTICLE_FAIL'

const UPDATE_COMMENT_TRY = 'comment/UPDATE_COMMENT_TRY'
const UPDATE_COMMENT_SUCCESS = 'comment/UPDATE_COMMENT_SUCCESS'
const UPDATE_COMMENT_FAIL = 'comment/UPDATE_COMMENT_FAIL'

// thunk를 사용할때는 thunk 함수를 dispatch 하므로, 굳이 액션생성함수를 만들어서 export 해줄 필요가 없다.
// 3번째 인자를 이용하면 withExtraArgument 에서 넣어준 값을 사용할 수 있다.
export const updateQuestion = (data) => async (
  dispatch,
  getState,
  { history }
) => {
  dispatch({ type: UPDATE_QUESTION_TRY })
  try {
    const obj = JSON.stringify(data)
    await axios({
      method: 'put',
      url: `/question/${data.postID}`,
      headers: { 'Content-Type': 'application/json' },
      data: obj,
    })
    await dispatch({ type: UPDATE_QUESTION_SUCCESS })

    history.push(`/question/${data.postID}`)
    // obj 는 스트링으로 만든거라서, data 를 써야함.
  } catch (e) {
    alert('error: ', e)
    dispatch({ type: UPDATE_QUESTION_FAIL, error: e })
  }
}

export const updateAnswer = (answerID, data) => async (dispatch) => {
  dispatch({ type: UPDATE_ANSWER_TRY })
  try {
    const obj = JSON.stringify(data)
    await axios({
      method: 'put',
      url: `/answer/${answerID}`,
      headers: { 'Content-Type': 'application/json' },
      data: obj,
    })
    dispatch({ type: UPDATE_ANSWER_SUCCESS })
    console.log('answer updated')
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: UPDATE_ANSWER_FAIL, error: e })
  }
}

export const updateArticle = (data) => async (dispatch) => {
  dispatch({ type: UPDATE_ARTICLE_TRY })
  try {
    const obj = JSON.stringify(Object.fromEntries(data))
    await axios({
      method: 'put',
      url: `/article`,
      headers: { 'Content-Type': 'application/json' },
      data: obj,
    })
    setTimeout(() => {
      dispatch({ type: UPDATE_ARTICLE_SUCCESS })
    }, 500)
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: UPDATE_ARTICLE_FAIL, error: e })
  }
}

export default function updatePost(state = initialState, action) {
  switch (action.type) {
    case UPDATE_QUESTION_TRY:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case UPDATE_QUESTION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        isUpdated: true,
      }
    case UPDATE_QUESTION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    case UPDATE_ANSWER_TRY:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case UPDATE_ANSWER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        isUpdated: true,
      }
    case UPDATE_ANSWER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    case UPDATE_ARTICLE_TRY:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case UPDATE_ARTICLE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        isUpdated: true,
      }
    case UPDATE_ARTICLE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      }

    default:
      return state
  }
}
