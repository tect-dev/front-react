import axios from 'axios';

const initialState = {
  question: {
    loading: false,
    error: null,
  },
  answer: {
    loading: false,
    error: null,
  },
  article: {
    loading: false,
    error: null,
  },
};

// action types

const CREATE_QUESTION_TRY = 'question/CREATE_QUESTION_TRY';
const CREATE_QUESTION_SUCCESS = 'question/CREATE_QUESTION_SUCCESS';
const CREATE_QUESTION_FAIL = 'question/CREATE_QUESTION_FAIL';

const CREATE_ANSWER_TRY = 'answer/CREATE_ANSWER_TRY';
const CREATE_ANSWER_SUCCESS = 'answer/CREATE_ANSWER_SUCCESS';
const CREATE_ANSWER_FAIL = 'answer/CREATE_ANSWER_FAIL';

const CREATE_ARTICLE_TRY = 'article/CREATE_ARTICLE_TRY';
const CREATE_ARTICLE_SUCCESS = 'article/CREATE_ARTICLE_SUCCESS';
const CREATE_ARTICLE_FAIL = 'article/CREATE_ARTICLE_FAIL';

// thunk를 사용할때는 thunk 함수를 dispatch 하므로, 굳이 액션생성함수를 만들어서 export 해줄 필요가 없다.

export const createQuestion = (data) => async (dispatch) => {
  dispatch({ type: CREATE_QUESTION_TRY });
  try {
    const obj = JSON.stringify(Object.fromEntries(data));
    console.log(obj);
    await axios({
      method: 'post',
      url: `/question`,
      headers: { 'Content-Type': 'application/json' },
      data: obj,
    });
    await dispatch({ type: CREATE_QUESTION_SUCCESS });
    // 왜 리다이렉션이 안되지??
    window.location.href = `/question/${obj.postID}`;
  } catch (e) {
    console.log('error: ', e);
    dispatch({ type: CREATE_QUESTION_FAIL, error: e });
  }
};

export const createAnswer = (data) => async (dispatch) => {
  dispatch({ type: CREATE_ANSWER_TRY });
  try {
    await axios.post({ method: 'post', url: `/write`, data: data });
    setTimeout(() => {
      dispatch({ type: CREATE_ANSWER_SUCCESS });
    }, 500);
  } catch (e) {
    console.log('error: ', e);
    dispatch({ type: CREATE_ANSWER_FAIL, error: e });
  }
};

export const createArticle = (data) => async (dispatch) => {
  dispatch({ type: CREATE_ARTICLE_TRY });
  try {
    await axios.post(`/write`, data);
    setTimeout(() => {
      dispatch({ type: CREATE_ARTICLE_SUCCESS });
    }, 500);
  } catch (e) {
    console.log('error: ', e);
    dispatch({ type: CREATE_ARTICLE_FAIL, error: e });
  }
};

export default function createPost(state = initialState, action) {
  switch (action.type) {
    case CREATE_QUESTION_TRY:
      return {
        ...state,
        question: {
          loading: true,
          error: null,
        },
      };
    case CREATE_QUESTION_SUCCESS:
      return {
        ...state,
        question: {
          loading: false,
          error: null,
        },
      };
    case CREATE_QUESTION_FAIL:
      return {
        ...state,
        question: {
          loading: false,
          error: action.error,
        },
      };
    case CREATE_ANSWER_TRY:
      return {
        ...state,
        answer: {
          loading: true,
          error: null,
        },
      };
    case CREATE_ANSWER_SUCCESS:
      return {
        ...state,
        answer: {
          loading: false,
          error: null,
        },
      };
    case CREATE_ANSWER_FAIL:
      return {
        ...state,
        answer: {
          loading: false,
          error: action.error,
        },
      };
    case CREATE_ARTICLE_TRY:
      return {
        ...state,
        article: {
          loading: true,
          error: null,
        },
      };
    case CREATE_ARTICLE_SUCCESS:
      return {
        ...state,
        article: {
          loading: false,
          error: null,
        },
      };
    case CREATE_ARTICLE_FAIL:
      return {
        ...state,
        article: {
          loading: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}
