// postingAPI.함수이름 으로 사용하게 모든 함수를 임포트(import * as postingAPI)
import * as dummyAPI from '../lib/dummyAPI';
import axios from 'axios';

const initialState = {
  posts: {
    loading: false,
    data: null,
    error: null,
  },
  post: {
    loading: false,
    data: null,
    error: null,
  },
};

// action types
const GET_POSTS_TRY = 'post/GET_POSTS_TRY';
const GET_POSTS_SUCCESS = 'post/GET_POSTS_SUCCESS';
const GET_POSTS_FAIL = 'post/GET_POSTS_FAIL';

const GET_POST_TRY = 'post/GET_POST_TRY';
const GET_POST_SUCCESS = 'post/GET_POST_SUCCESS';
const GET_POST_FAIL = 'post/GET_POST_FAIL';

// thunk를 사용할때는 thunk 함수를 dispatch 하므로, 굳이 액션생성함수를 만들어서 export 해줄 필요가 없다.
export const getPosts = () => async (dispatch) => {
  dispatch({ type: GET_POSTS_TRY }); // 요청이 시작됨
  try {
    const res = await axios.get('/posts'); //api 요청을 보내고, 성공하면 성공에 대한 타입을 dispatch. 에러가 발생하면 에러에 대한 dispatch
    // 디버깅을 위해 setTimeout 을 설정해뒀다.
    setTimeout(() => {
      dispatch({ type: GET_POSTS_SUCCESS, posts: res.data });
    }, 500);
  } catch (e) {
    dispatch({ type: GET_POSTS_FAIL, error: e });
  }
};

export const getPostById = (id) => async (dispatch) => {
  dispatch({ type: GET_POST_TRY });
  try {
    const res = await axios.get(`/posts/${id}`);
    console.log('res.data: ', res.data);
    setTimeout(() => {
      dispatch({ type: GET_POST_SUCCESS, post: res.data });
    }, 500);
  } catch (e) {
    console.log('error: ', e);
    dispatch({ type: GET_POST_FAIL, error: e });
  }
};

export default function post(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS_TRY:
      return {
        ...state,
        posts: {
          loading: true,
          data: null,
          error: null,
        },
      };
    case GET_POSTS_SUCCESS:
      return {
        ...state,
        posts: {
          loading: false,
          data: action.posts,
          error: null,
        },
      };
    case GET_POSTS_FAIL:
      return {
        ...state,
        posts: {
          loading: false,
          data: null,
          error: action.error,
        },
      };

    case GET_POST_TRY:
      return {
        ...state,
        post: {
          loading: true,
          data: null,
          error: null,
        },
      };
    case GET_POST_SUCCESS:
      return {
        ...state,
        post: {
          loading: false,
          data: action.post,
          error: null,
        },
      };
    case GET_POST_FAIL:
      return {
        ...state,
        post: {
          loading: false,
          data: null,
          error: action.error,
        },
      };
    default:
      return state;
  }
}
