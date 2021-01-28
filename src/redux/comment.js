import axios from 'axios'
import { authService } from '../lib/firebase'
import auth from './auth'

const initialState = {}

// defin action type

const CREATE_QUESTION_COMMENT_TRY = 'CREATE_QUESTION_COMMENT_TRY'
const CREATE_QUESTION_COMMENT_SUCCESS = 'CREATE_QUESTION_COMMENT_SUCCESS'
const CREATE_QUESTION_COMMENT_FAIL = 'CREATE_QUESTION_COMMENT_FAIL'

const CREATE_ANSWER_COMMENT_TRY = 'CREATE_ANSWER_COMMENT_TRY'
const CREATE_ANSWER_COMMENT_SUCCESS = 'CREATE_ANSWER_COMMENT_SUCCESS'
const CREATE_ANSWER_COMMENT_FAIL = 'CREATE_ANSWER_COMMENT_FAIL'

const DELETE_QUESTION_COMMENT_TRY = 'DELETE_QUESTION_COMMENT_TRY'
const DELETE_QUESTION_COMMENT_SUCCESS = 'DELETE_QUESTION_COMMENT_SUCCESS'
const DELETE_QUESTION_COMMENT_FAIL = 'DELETE_QUESTION_COMMENT_FAIL'

const DELETE_ANSWER_COMMENT_TRY = 'DELETE_ANSWER_COMMENT_TRY'
const DELETE_ANSWER_COMMENT_SUCCESS = 'DELETE_ANSWER_COMMENT_SUCCESS'
const DELETE_ANSWER_COMMENT_FAIL = 'DELETE_ANSWER_COMMENT_FAIL'

const UPDATE_QUESTION_COMMENT_TRY = 'UPDATE_QUESTION_COMMENT_TRY'
const UPDATE_QUESTION_COMMENT_SUCCESS = 'UPDATE_QUESTION_COMMENT_SUCCESS'
const UPDATE_QUESTION_COMMENT_FAIL = 'UPDATE_QUESTION_COMMENT_FAIL'

const UPDATE_ANSWER_COMMENT_TRY = 'UPDATE_ANSWER_COMMENT_TRY'
const UPDATE_ANSWER_COMMENT_SUCCESS = 'UPDATE_ANSWER_COMMENT_SUCCESS'
const UPDATE_ANSWER_COMMENT_FAIL = 'UPDATE_ANSWER_COMMENT_FAIL'

const CREATE_ARTICLE_COMMENT_TRY = 'CREATE_ARTICLE_COMMENT_TRY'
const CREATE_ARTICLE_COMMENT_SUCCESS = 'CREATE_ARTICLE_COMMENT_SUCCESS'
const CREATE_ARTICLE_COMMENT_FAIL = 'CREATE_ARTICLE_COMMENT_FAIL'

export const createQuestionComment = (data) => async (dispatch) => {
  dispatch({ type: CREATE_QUESTION_COMMENT_TRY })
  try {
    authService.currentUser.getIdToken(true).then(async (idToken) => {
      //const obj = JSON.stringify(data)
      await axios({
        method: 'post',
        url: `${process.env.REACT_APP_BACKEND_URL}/comment/questionComment`,
        headers: { 'Content-Type': 'application/json' },
        data: { ...data, firebaseToken: idToken },
      })
      await dispatch({ type: CREATE_QUESTION_COMMENT_SUCCESS })
    })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: CREATE_QUESTION_COMMENT_FAIL, error: e })
  }
}

export const createAnswerComment = (data) => async (dispatch) => {
  dispatch({ type: CREATE_ANSWER_COMMENT_TRY })
  try {
    authService.currentUser.getIdToken(true).then(async (idToken) => {
      //const obj = JSON.stringify(data)
      await axios({
        method: 'post',
        url: `${process.env.REACT_APP_BACKEND_URL}/comment/answerComment`,
        headers: { 'Content-Type': 'application/json' },
        data: { ...data, firebaseToken: idToken },
      })
      await dispatch({ type: CREATE_ANSWER_COMMENT_SUCCESS })
    })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: CREATE_ANSWER_COMMENT_FAIL, error: e })
  }
}

export const deleteQuestionComment = (commentID) => async (dispatch) => {
  dispatch({ type: DELETE_QUESTION_COMMENT_TRY })
  try {
    await axios({
      method: 'delete',
      url: `/comment/${commentID}`,
      headers: { 'Content-Type': 'application/json' },
    })
    await dispatch({ type: DELETE_QUESTION_COMMENT_SUCCESS })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: DELETE_QUESTION_COMMENT_FAIL, error: e })
  }
}

export const deleteAnswerComment = (commentID) => async (dispatch) => {
  dispatch({ type: DELETE_ANSWER_COMMENT_TRY })
  try {
    await axios({
      method: 'delete',
      url: `/comment/${commentID}`,
      headers: { 'Content-Type': 'application/json' },
    })
    await dispatch({ type: DELETE_ANSWER_COMMENT_SUCCESS })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: DELETE_ANSWER_COMMENT_FAIL, error: e })
  }
}

export default function comment(state = initialState, action) {
  switch (action.type) {
    case CREATE_QUESTION_COMMENT_TRY:
      return { ...state }
    case CREATE_QUESTION_COMMENT_SUCCESS:
      return { ...state }
    case CREATE_QUESTION_COMMENT_FAIL:
      return { ...state }
  }
  return
}
