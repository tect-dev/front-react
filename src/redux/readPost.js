// postingAPI.함수이름 으로 사용하게 모든 함수를 임포트(import * as postingAPI)

import axios from 'axios'
import { sortISOByTimeStamp } from '../lib/functions'

const initialState = {
  questionList: {
    loading: false,
    data: null,
    error: null,
    num: null
  },
  question: {
    loading: false,
    data: null,
    error: null,
  },
  articleList: {
    loading: false,
    data: null,
    error: null,
  },
  article: {
    loading: false,
    data: null,
    error: null,
  },
  searchedResults: {
    loading: false,
    data: null,
    error: null,
  },

  hashtag: null
}

// action types
const READ_QUESTION_LIST_TRY = 'question/READ_QUESTION_LIST_TRY'
const READ_QUESTION_LIST_SUCCESS = 'question/READ_QUESTION_LIST_SUCCESS'
const READ_QUESTION_LIST_FAIL = 'question/READ_QUESTION_LIST_FAIL'

const READ_QUESTION_TRY = 'question/READ_QUESTION_TRY'
const READ_QUESTION_SUCCESS = 'question/READ_QUESTION_SUCCESS'
const READ_QUESTION_FAIL = 'question/READ_QUESTION_FAIL'

const READ_ARTICLE_LIST_TRY = 'article/READ_ARTICLE_LIST_TRY'
const READ_ARTICLE_LIST_SUCCESS = 'article/READ_ARTICLE_LIST_SUCCESS'
const READ_ARTICLE_LIST_FAIL = 'article/READ_ARTICLE_LIST_FAIL'

const READ_ARTICLE_TRY = 'article/READ_ARTICLE_TRY'
const READ_ARTICLE_SUCCESS = 'article/READ_ARTICLE_SUCCESS'
const READ_ARTICLE_FAIL = 'article/READ_ARTICLE_FAIL'

const READ_SEARCHED_TRY = 'searched/READ_SEARCHED_TRY'
const READ_SEARCHED_SUCCESS = 'searched/READ_SEARCHED_SUCCESS'
const READ_SEARCHED_FAIL = 'searched/READ_SEARCHED_FAIL'

const READ_SEARCHED_BY_HASHTAG_TRY = 'searchedByHashtag/READ_SEARCHED_BY_HASHTAG_TRY'
const READ_SEARCHED_BY_HASHTAG_SUCCESS = 'searchedByHashtag/READ_SEARCHED_BY_HASHTAG_SUCCESS'
const READ_SEARCHED_BY_HASHTAG_FAIL = 'searchedByHashtag/READ_SEARCHED_BY_HASHTAG_FAIL'

const REFRESH_HASHTAG = 'refresh/REFRESH_HASHTAG'

// thunk를 사용할때는 thunk 함수를 dispatch 하므로, 굳이 액션생성함수를 만들어서 export 해줄 필요가 없다.

export const readQuestionList = (spa) => async (dispatch) => {
  dispatch({ type: READ_QUESTION_LIST_TRY, spa: spa })
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/question/page/1`)
    dispatch({
      type: READ_QUESTION_LIST_SUCCESS,
      questionList: res.data.question.sort((a, b) => {
        return sortISOByTimeStamp(a.createdAt, b.createdAt, 1)
      }),
      num: res.data.questionSum
    })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: READ_QUESTION_LIST_FAIL, error: e })
  }
}

export const readArticleList = () => async (dispatch) => {
  dispatch({ type: READ_ARTICLE_LIST_TRY })
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/article`)
    dispatch({ type: READ_ARTICLE_LIST_SUCCESS, articleList: res.data })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: READ_ARTICLE_LIST_FAIL, error: e })
  }
}

export const readQuestionByUID = (uid) => async (dispatch) => {
  dispatch({ type: READ_QUESTION_TRY })
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/question/${uid}`
    )
    dispatch({ type: READ_QUESTION_SUCCESS, question: res.data })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: READ_QUESTION_FAIL, error: e })
  }
}

export const readArticleByUID = (uid) => async (dispatch) => {
  dispatch({ type: READ_ARTICLE_TRY })
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/article/${uid}`
    )
    dispatch({ type: READ_ARTICLE_SUCCESS, article: res.data })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: READ_ARTICLE_FAIL, error: e })
  }
}

export const readSearchedResults = (querystring) => async (dispatch) => {
  dispatch({ type: READ_SEARCHED_TRY })
  try {
    const obj = JSON.stringify({ target: querystring })
    const res = await axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/search`,
      headers: { 'Content-Type': 'application/json' },
      data: obj,
    })
    dispatch({ type: READ_SEARCHED_SUCCESS, searchedResults: res.data })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: READ_SEARCHED_FAIL, error: e })
  }
}

export const readHashtagResults = (hashtag) => async (dispatch) => {
  dispatch({ type: READ_SEARCHED_BY_HASHTAG_TRY })
  try {
    const obj = JSON.stringify({ target: hashtag })
    const res = await axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/search/hash`,
      headers: { 'Content-Type': 'application/json' },
      data: obj,
    })
    dispatch({ type: READ_SEARCHED_BY_HASHTAG_SUCCESS, searchedResults: res.data, hashtag: hashtag })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: READ_SEARCHED_BY_HASHTAG_FAIL, error: e })
  }
}

export const refreshHashtag = () => async (dispatch) => {
  dispatch({type: REFRESH_HASHTAG })
}

export default function readPost(state = initialState, action) {
  switch (action.type) {
    case READ_QUESTION_LIST_TRY:
      if(action.spa){
        return state
      } else {
        return {
          ...state,
          questionList: {
            loading: true,
            data: null,
            error: null,
          },
          hashtag: null
        }
      }
    case READ_QUESTION_LIST_SUCCESS:
      return {
        ...state,
        questionList: {
          loading: false,
          data: action.questionList,
          num: action.num,
          error: null
        },
      }
    case READ_QUESTION_LIST_FAIL:
      return {
        ...state,
        questionList: {
          loading: false,
          data: null,
          error: action.error,
        },
      }

    case READ_QUESTION_TRY:
      return {
        ...state,
        question: {
          loading: true,
          data: null,
          error: null,
        },
      }
    case READ_QUESTION_SUCCESS:
      return {
        ...state,
        question: {
          loading: false,
          data: action.question,
          error: null,
        },
      }
    case READ_QUESTION_FAIL:
      return {
        ...state, // 테스트를 위해 각주처리. 실제 서버가 돌아가면 각주 풀어줘야함.
        question: {
          loading: false,
          data: null,
          error: action.error,
        },
      }

    case READ_ARTICLE_LIST_TRY:
      return {
        ...state,
        articleList: {
          loading: true,
          data: null,
          error: null,
        },
      }
    case READ_ARTICLE_LIST_SUCCESS:
      return {
        ...state,
        articleList: {
          loading: false,
          data: action.articleList,
          error: null,
        },
      }
    case READ_ARTICLE_LIST_FAIL:
      return {
        ...state,
        articleList: {
          loading: false,
          data: null,
          error: action.error,
        },
      }

    case READ_ARTICLE_TRY:
      return {
        ...state,
        article: {
          loading: true,
          data: null,
          error: null,
        },
      }
    case READ_ARTICLE_SUCCESS:
      return {
        ...state,
        article: {
          loading: false,
          data: action.article,
          error: null,
        },
      }
    case READ_ARTICLE_FAIL:
      return {
        ...state,
        article: {
          loading: false,
          data: null,
          error: action.error,
        },
      }
    case READ_SEARCHED_TRY:
      return {
        ...state,
        searchedResults: {
          loading: true,
          data: null,
          error: null,
        },
      }
    case READ_SEARCHED_SUCCESS:
      return {
        ...state,
        searchedResults: {
          loading: false,
          data: action.searchedResults,
          error: null,
        },
      }
    case READ_SEARCHED_FAIL:
      return {
        ...state,
        searchedResults: {
          loading: false,
          data: null,
          error: action.error,
        },
      }
    case READ_SEARCHED_BY_HASHTAG_TRY:
      return state
    case READ_SEARCHED_BY_HASHTAG_SUCCESS:
      return {
        ...state,
        questionList: {
          loading: false,
          data: action.searchedResults,
          error: null,
        },
        hashtag: action.hashtag
      }
    case READ_SEARCHED_BY_HASHTAG_FAIL:
      return {
        ...state,
        questionList: {
          loading: false,
          data: null,
          error: action.error,
        },
      }
    case REFRESH_HASHTAG:
      return {
        ...state,
        hashtag: null
      }
    default:
      return state
  }
}
