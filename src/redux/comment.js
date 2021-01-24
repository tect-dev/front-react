import axios from 'axios'

const initialState = {}

// defin action type

const CREATE_QUESTION_COMMENT_TRY = 'CREATE_QUESTION_COMMENT_TRY'
const CREATE_QUESTION_COMMENT_SUCCESS = 'CREATE_QUESTION_COMMENT_SUCCESS'
const CREATE_QUESTION_COMMENT_FAIL = 'CREATE_QUESTION_COMMENT_FAIL'

const CREATE_ANSWER_COMMENT_TRY = 'CREATE_ANSWER_COMMENT_TRY'
const CREATE_ANSWER_COMMENT_SUCCESS = 'CREATE_ANSWER_COMMENT_SUCCESS'
const CREATE_ANSWER_COMMENT_FAIL = 'CREATE_ANSWER_COMMENT_FAIL'

const CREATE_ARTICLE_COMMENT_TRY = 'CREATE_ARTICLE_COMMENT_TRY'
const CREATE_ARTICLE_COMMENT_SUCCESS = 'CREATE_ARTICLE_COMMENT_SUCCESS'
const CREATE_ARTICLE_COMMENT_FAIL = 'CREATE_ARTICLE_COMMENT_FAIL'

export const createComment = (data) => async (dispatch) => {
  dispatch({ type: CREATE_QUESTION_COMMENT_TRY })
  try {
    const obj = JSON.stringify(data)
    //console.log(obj);
    await axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/comment`,
      headers: { 'Content-Type': 'application/json' },
      data: obj,
    })
    await dispatch({ type: CREATE_QEUSTION_COMMENT_SUCCESS })
  } catch (e) {
    console.log('error: ', e)
    dispatch({ type: CREATE_QUESTION_COMMENT_FAIL, error: e })
  }
}

export default function comment(initialState, action) {
  return
}
