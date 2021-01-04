import { combineReducers } from 'redux';
import auth from './auth';
import post from './post';
import readPost from './readPost';
import createPost from './createPost';
import updatePost from './updatePost';
import deletePost from './deletePost';

const rootReducer = combineReducers({
  auth,
  post,
  readPost,
  createPost,
  updatePost,
  deletePost,
});

// reducer는 export default 해야된다는데 why??
// default 가 아니라 const 로 해도 작동하는듯 한데.

export default rootReducer;
