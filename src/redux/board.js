// postingAPI.함수이름 으로 사용하게 모든 함수를 임포트(import * as postingAPI)

import axios from 'axios'
import { authService } from '../lib/firebase'
import { sortISOByTimeStamp } from '../lib/functions'

const initialState = {
  postList: [],
  postSum: 1,
  loading: false,
  error: null,
  postTitle: '',
  postContent: '',
  postCreatedAt: '',
  postAnswers: null,
  postID: '',
  postLike: 0,
  postAuthor: { firebaseUid: '', displayName: '' },
  postLikeUsers: [],
  sortingMethod: 'time', // 'time' or 'likes'.
}

// action types

const READ_POST_LIST_TRY = 'board/READ_POST_LIST_TRY'
const READ_POST_LIST_SUCCESS = 'board/READ_POST_LIST_SUCCESS'
const READ_POST_LIST_FAIL = 'board/READ_POST_LIST_FAIL'

const READ_POST_DETAIL_TRY = 'board/READ_POST_DETAIL_TRY'
const READ_POST_DETAIL_SUCCESS = 'board/READ_POST_DETAIL_SUCCESS'
const READ_POST_DETAIL_FAIL = 'board/READ_POST_DETAIL_FAIL'

const CREATE_QUESTION_TRY = 'board/CREATE_QUESTION_TRY'
const CREATE_QUESTION_SUCCESS = 'board/CREATE_QUESTION_SUCCESS'
const CREATE_QUESTION_FAIL = 'board/CREATE_QUESTION_FAIL'

const CREATE_ANSWER_TRY = 'board/CREATE_ANSWER_TRY'
const CREATE_ANSWER_SUCCESS = 'board/CREATE_ANSWER_SUCCESS'
const CREATE_ANSWER_FAIL = 'board/CREATE_ANSWER_FAIL'

const UPDATE_POST_TRY = 'board/UPDATE_POST_TRY'
const UPDATE_POST_SUCCESS = 'board/UPDATE_POST_SUCCESS'
const UPDATE_POST_FAIL = 'board/UPDATE_POST_FAIL'

const UPDATE_ANSWER_TRY = 'board/UPDATE_ANSWER_TRY'
const UPDATE_ANSWER_SUCCESS = 'board/UPDATE_ANSWER_SUCCESS'
const UPDATE_ANSWER_FAIL = 'board/UPDATE_ANSWER_FAIL'

const DELETE_POST_TRY = 'board/DELETE_POST_TRY'
const DELETE_POST_SUCCESS = 'board/DELETE_POST_SUCCESS'
const DELETE_POST_FAIL = 'board/DELETE_POST_FAIL'

const DELETE_ANSWER_TRY = 'board/DELETE_ANSWER_TRY'
const DELETE_ANSWER_SUCCESS = 'board/DELETE_ANSWER_SUCCESS'
const DELETE_ANSWER_FAIL = 'board /DELETE_ANSWER_FAIL'

const LIKE_POST_TRY = 'board/LIKE_POST_TRY'
const LIKE_POST_SUCCESS = 'board/LIKE_POST_SUCCESS'
const LIKE_POST_FAIL = 'board /LIKE_POST_FAIL'

const LIKE_ANSWER_TRY = 'board/LIKE_ANSWER_TRY'
const LIKE_ANSWER_SUCCESS = 'board/LIKE_ANSWER_SUCCESS'
const LIKE_ANSWER_FAIL = 'board /LIKE_ANSWER_FAIL'

const SEARCH_POST_LIST_TRY = 'board/SEARCH_POST_LIST_TRY'
const SEARCH_POST_LIST_SUCCESS = 'board/SEARCH_POST_LIST_SUCCESS'
const SEARCH_POST_LIST_FAIL = 'board/SEARCH_POST_LIST_FAIL'

const CHANGE_SORTING_METHOD = 'board/CHANGE_SORTING_METHOD'

export const changeSortingMethod = (category, sortingMethod, pageNumber) => {
  return { type: CHANGE_SORTING_METHOD, sortingMethod }
}

export const readPostList = (querystring, sortingMethod, pageNumber) => async (
  dispatch
) => {
  dispatch({ type: READ_POST_LIST_TRY })
  try {
    switch (sortingMethod) {
      case 'time':
        if (querystring === 'main') {
          const res = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/question/page/${pageNumber}`,
          })
          dispatch({
            type: READ_POST_LIST_SUCCESS,
            postList: res.data.question,
            postSum: res.data.questionSum,
            sortingMethod,
          })
        } else {
          const res = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/search/hash?target=${querystring}&page=${pageNumber}`,
          })
          const res2 = await axios({
            mathod: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/search/hashnum/${querystring}`,
          })
          dispatch({
            type: READ_POST_LIST_SUCCESS,
            postList: res.data.question,
            postSum: res2.data.count,
            sortingMethod,
          })
        }
        return

      case 'likes':
        if (querystring === 'main') {
          const res = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/question/likepage/${pageNumber}`,
          })
          dispatch({
            type: READ_POST_LIST_SUCCESS,
            postList: res.data.question,
            postSum: res.data.questionSum,
            sortingMethod,
          })
        } else {
          const res = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/question/likepage/${pageNumber}`,
          })

          dispatch({
            type: READ_POST_LIST_SUCCESS,
            postList: res.data.question,
            postSum: res.data.questionSum,
            sortingMethod,
          })
        }
        return
      default:
        return
    }
  } catch (e) {
    //console.log('error: ', e)
    dispatch({ type: READ_POST_LIST_FAIL, error: e })
    alert('글목록 불러오기 과정에서 오류가 발생했습니다.')
  }
}

export const readPostDetail = (uid) => async (dispatch) => {
  dispatch({ type: READ_POST_DETAIL_TRY })
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/question/${uid}`
    )
    dispatch({ type: READ_POST_DETAIL_SUCCESS, postData: res.data })
  } catch (e) {
    // console.log('error: ', e)
    dispatch({ type: READ_POST_DETAIL_FAIL, error: e })
    alert('불러오기 과정에서 오류가 발생했습니다.')
  }
}

export const createPost = (questionID, title, content, hashtags) => async (
  dispatch,
  getState,
  { history }
) => {
  dispatch({ type: CREATE_QUESTION_TRY })
  try {
    authService.currentUser.getIdToken(true).then(async (idToken) => {
      const res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_BACKEND_URL}/question`,
        headers: { 'Content-Type': 'application/json' },
        data: { questionID, title, content, hashtags, firebaseToken: idToken },
      })
      await dispatch({ type: CREATE_QUESTION_SUCCESS })
      if (res) {
        setTimeout(() => {
          history.push(`/post/${questionID}`)
        }, 20)
      }
    })
  } catch (e) {
    alert('error: ', e)
    dispatch({ type: CREATE_QUESTION_FAIL, error: e })
  }
}

export const createAnswer = (data) => async (dispatch) => {
  dispatch({ type: CREATE_ANSWER_TRY })
  try {
    authService.currentUser.getIdToken(true).then(async (idToken) => {
      //const obj = JSON.stringify(data)
      await axios({
        method: 'post',
        url: `${process.env.REACT_APP_BACKEND_URL}/answer`,
        headers: { 'Content-Type': 'application/json' },
        data: { ...data, firebaseToken: idToken },
      })
      dispatch({ type: CREATE_ANSWER_SUCCESS })
    })
  } catch (e) {
    //console.log('error: ', e)
    dispatch({ type: CREATE_ANSWER_FAIL, error: e })
    alert('답변 생성 과정에서 오류가 발생했습니다.')
  }
}

export const updatePost = (data) => async (dispatch, getState, { history }) => {
  dispatch({ type: UPDATE_POST_TRY })
  try {
    //const obj = JSON.stringify(data)
    authService.currentUser.getIdToken(true).then(async (idToken) => {
      await axios({
        method: 'put',
        url: `${process.env.REACT_APP_BACKEND_URL}/question/${data.postID}`,
        headers: { 'Content-Type': 'application/json' },
        data: { ...data, firebaseToken: idToken },
      })
      await dispatch({ type: UPDATE_POST_SUCCESS })
      history.push(`/post/${data.postID}`)
    })
    // obj 는 스트링으로 만든거라서, data 를 써야함.
  } catch (e) {
    alert('error: ', e)
    dispatch({ type: UPDATE_POST_FAIL, error: e })
  }
}

export const updateAnswer = (answerID, data) => async (dispatch) => {
  dispatch({ type: UPDATE_ANSWER_TRY })
  try {
    await authService.currentUser.getIdToken(true).then(async (idToken) => {
      // const obj = JSON.stringify(data)
      const res = await axios({
        method: 'put',
        url: `${process.env.REACT_APP_BACKEND_URL}/answer/${answerID}`,
        headers: { 'Content-Type': 'application/json' },
        data: { content: data, firebaseToken: idToken },
      })
    })
    dispatch({ type: UPDATE_ANSWER_SUCCESS })
  } catch (e) {
    //console.log('error: ', e)
    dispatch({ type: UPDATE_ANSWER_FAIL, error: e })
    alert('답변 업데이트 과정에서 오류가 발생했습니다.')
  }
}

export const deletePost = (postID) => async (
  dispatch,
  getState,
  { history }
) => {
  dispatch({ type: DELETE_POST_TRY })
  try {
    await axios({
      method: 'delete',
      url: `${process.env.REACT_APP_BACKEND_URL}/question/${postID}`,
    })
    await dispatch({ type: DELETE_POST_SUCCESS })
    history.push('/board/main')
  } catch (e) {
    // console.log('error: ', e)
    dispatch({ type: DELETE_POST_FAIL, error: e })
    alert('게시글을 삭제하는데 오류가 발생했습니다.')
  }
}
export const deleteAnswer = (answerID) => async (dispatch) => {
  dispatch({ type: DELETE_ANSWER_TRY })
  try {
    await axios({
      method: 'delete',
      url: `${process.env.REACT_APP_BACKEND_URL}/answer/${answerID}`,
    })
    dispatch({ type: DELETE_ANSWER_SUCCESS })
  } catch (e) {
    //console.log('error: ', e)
    dispatch({ type: DELETE_ANSWER_FAIL, error: e })
    alert('게시글을 삭제하는데 오류가 발생했습니다.')
  }
}

export const likePost = (postID) => async (dispatch) => {
  dispatch({ type: LIKE_POST_TRY })
  try {
    await authService.currentUser.getIdToken(true).then(async (idToken) => {
      const res = await axios({
        method: 'put',
        url: `${process.env.REACT_APP_BACKEND_URL}/like/question/${postID}`,
        headers: { 'Content-Type': 'application/json' },
        data: { firebaseToken: idToken },
      })
    })
    await dispatch({ type: LIKE_POST_SUCCESS })
  } catch (e) {
    await dispatch({ type: LIKE_POST_FAIL, error: e })
  }
}

export const likeAnswer = (answerID) => async (dispatch) => {
  dispatch({ type: LIKE_ANSWER_TRY })
  try {
    await authService.currentUser.getIdToken(true).then(async (idToken) => {
      const res = await axios({
        method: 'put',
        url: `${process.env.REACT_APP_BACKEND_URL}/like/answer/${answerID}`,
        headers: { 'Content-Type': 'application/json' },
        data: { firebaseToken: idToken },
      })
    })
    await dispatch({ type: LIKE_ANSWER_SUCCESS })
  } catch (e) {
    await dispatch({ type: LIKE_ANSWER_FAIL, error: e })
  }
}

export const searchPostList = (querystring, pageNumber) => async (dispatch) => {
  dispatch({ type: SEARCH_POST_LIST_TRY })
  // 해당 검색어와 일치하는 post가 없으면 백엔드에서 404를 뱉기 때문에
  // 임시로 이렇게 설계함.
  let res = null
  try {
    setTimeout(()=>{
      if(!res){
        dispatch({
          type: SEARCH_POST_LIST_SUCCESS,
          postList: [],
          postSum: 0
        })
        res = true
      }
    }, 5000)
    res = await axios({
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/search/?target=${querystring}&page=${pageNumber}`,
    })
    dispatch({
      type: SEARCH_POST_LIST_SUCCESS,
      postList: res.data.question,
      postSum: res.data.qeustionSum
    })
  } catch (e) {
    if(!res){
      await dispatch({ type: SEARCH_POST_LIST_FAIL, error: e })
    }
  }
}

export default function board(state = initialState, action) {
  switch (action.type) {
    case CHANGE_SORTING_METHOD:
      return {
        ...state,
        sortingMethod: action.sortingMethod,
      }
    case READ_POST_LIST_TRY:
      return { ...state, loading: true, postList: [], sortingMethod: 'time' }
    case READ_POST_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        postList: action.postList,
        postSum: action.postSum,
        sortingMethod: action.sortingMethod,
      }
    case READ_POST_LIST_FAIL:
      return { ...state, loading: false, error: action.error }

    case READ_POST_DETAIL_TRY:
      return {
        ...state,
        loading: true,
        postTitle: '',
        postContent: '',
        postID: '',
        postCreatedAt: '',
        postAnswers: null,
        postLike: null,
        postAuthor: { firebaseUid: '', displayName: '' },
        postLikeUsers: [],
      }
    case READ_POST_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        postAnswers: action.postData.answerList,
        postTitle: action.postData.question.title,
        postContent: action.postData.question.content,
        postID: action.postData.question._id,
        postLike: action.postData.question.like,
        postCreatedAt: action.postData.question.createdAt,
        postAuthor: action.postData.question.author,
        postLikeUsers: action.postData.question.like_user,
      }
    case READ_POST_DETAIL_FAIL:
      return { ...state, loading: false, error: action.error }

    case CREATE_QUESTION_TRY:
      return { ...state, loading: true }
    case CREATE_QUESTION_SUCCESS:
      return { ...state, loading: false }
    case CREATE_QUESTION_FAIL:
      return { ...state, loading: false, error: action.error }
    case DELETE_POST_TRY:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case DELETE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      }
    case DELETE_POST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    case DELETE_ANSWER_TRY:
      return {
        ...state, // 자연스러운 삭제 ux를 위해 loading 삭제
      }
    case DELETE_ANSWER_SUCCESS:
      return {
        ...state,
      }
    case DELETE_ANSWER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    case UPDATE_POST_TRY:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case UPDATE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        isUpdated: true,
      }
    case UPDATE_POST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    case UPDATE_ANSWER_TRY:
      return {
        ...state, // 자연스러운 수정 ux를 위해 loading 제거
      }
    case UPDATE_ANSWER_SUCCESS:
      return {
        ...state,
        isUpdated: true,
      }
    case UPDATE_ANSWER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    case SEARCH_POST_LIST_TRY:
      return {
        ...state,
        loading: true,
        postList: [],
        sortingMethod: 'time'
      }
    case SEARCH_POST_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        postList: action.postList,
        postSum: action.postSum,
      }
    case SEARCH_POST_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      }

    default:
      return { ...state }
  }
}
