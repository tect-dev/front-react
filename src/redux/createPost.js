import axios from 'axios'

const initialState = {
  question: {
    loading: false,
    error: null,
    isAdded: false,
  },
  answer: {
    loading: false,
    error: null,
    isAdded: false,
  },
  article: {
    loading: false,
    error: null,
    isAdded: false,
  },
}

// action types

const CREATE_QUESTION_TRY = 'question/CREATE_QUESTION_TRY'
const CREATE_QUESTION_SUCCESS = 'question/CREATE_QUESTION_SUCCESS'
const CREATE_QUESTION_FAIL = 'question/CREATE_QUESTION_FAIL'

const CREATE_ANSWER_TRY = 'answer/CREATE_ANSWER_TRY'
const CREATE_ANSWER_SUCCESS = 'answer/CREATE_ANSWER_SUCCESS'
const CREATE_ANSWER_FAIL = 'answer/CREATE_ANSWER_FAIL'

const CREATE_ARTICLE_TRY = 'article/CREATE_ARTICLE_TRY'
const CREATE_ARTICLE_SUCCESS = 'article/CREATE_ARTICLE_SUCCESS'
const CREATE_ARTICLE_FAIL = 'article/CREATE_ARTICLE_FAIL'

const CREATE_COMMENT_TRY = 'comment/CREATE_COMMENT_TRY'
const CREATE_COMMENT_SUCCESS = 'comment/CREATE_COMMENT_SUCCESS'
const CREATE_COMMENT_FAIL = 'comment/CREATE_COMMENT_FAIL'

// thunk를 사용할때는 thunk 함수를 dispatch 하므로, 굳이 액션생성함수를 만들어서 export 해줄 필요가 없다.
// 3번째 인자를 이용하면 withExtraArgument 에서 넣어준 값을 사용할 수 있다.
export const createQuestion = (data) => async (
  dispatch,
  getState,
  { history }
) => {
  dispatch({ type: CREATE_QUESTION_TRY })
  try {
    const obj = JSON.stringify(data)
    await axios({
      method: 'post',
      url: `/question`,
      headers: { 'Content-Type': 'application/json' },
      data: obj,
    })
    await dispatch({ type: CREATE_QUESTION_SUCCESS })

    history.push(`/question/${data.postID}`)
    // obj 는 스트링으로 만든거라서, data 를 써야함.
  } catch (e) {
    alert('error: ', e)
    dispatch({ type: CREATE_QUESTION_FAIL, error: e })
  }
}

export const createAnswer = (data) => async (dispatch) => {
  dispatch({ type: CREATE_ANSWER_TRY })
  try {
    const obj = JSON.stringify(data)
    await axios({
      method: 'post',
      url: `/answer`,
      headers: { 'Content-Type': 'application/json' },
      data: obj,
    })
    dispatch({ type: CREATE_ANSWER_SUCCESS })
    console.log('answer added')
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: CREATE_ANSWER_FAIL, error: e })
  }
}

export const createArticle = (data) => async (dispatch) => {
  dispatch({ type: CREATE_ARTICLE_TRY })
  try {
    const obj = JSON.stringify(Object.fromEntries(data))
    await axios({
      method: 'post',
      url: `/article`,
      headers: { 'Content-Type': 'application/json' },
      data: obj,
    })
    setTimeout(() => {
      dispatch({ type: CREATE_ARTICLE_SUCCESS })
    }, 500)
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: CREATE_ARTICLE_FAIL, error: e })
  }
}

export default function createPost(state = initialState, action) {
  switch (action.type) {
    case CREATE_QUESTION_TRY:
      return {
        ...state,
        question: {
          loading: true,
          error: null,
        },
      }
    case CREATE_QUESTION_SUCCESS:
      return {
        ...state,
        question: {
          loading: false,
          error: null,
          isAdded: true,
        },
      }
    case CREATE_QUESTION_FAIL:
      return {
        ...state,
        question: {
          loading: false,
          error: action.error,
        },
      }
    case CREATE_ANSWER_TRY:
      return {
        ...state,
        answer: {
          loading: true,
          error: null,
        },
      }
    case CREATE_ANSWER_SUCCESS:
      return {
        ...state,
        answer: {
          loading: false,
          error: null,
          isAdded: true,
        },
      }
    case CREATE_ANSWER_FAIL:
      return {
        ...state,
        answer: {
          loading: false,
          error: action.error,
        },
      }
    case CREATE_ARTICLE_TRY:
      return {
        ...state,
        article: {
          loading: true,
          error: null,
        },
      }
    case CREATE_ARTICLE_SUCCESS:
      return {
        ...state,
        article: {
          loading: false,
          error: null,
        },
        content: '',
      }
    case CREATE_ARTICLE_FAIL:
      return {
        ...state,
        article: {
          loading: false,
          error: action.error,
        },
      }

    default:
      return state
  }
}
