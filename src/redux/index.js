import { combineReducers } from 'redux'
import auth from './auth'
import readPost from './readPost'
import createPost from './createPost'
import updatePost from './updatePost'
import deletePost from './deletePost'
import techtree from './techtree'
import board from './board'

const rootReducer = combineReducers({
  auth,
  readPost,
  createPost,
  updatePost,
  deletePost,
  techtree,
  board,
})

// reducer는 export default 해야된다는데 why??
// default 가 아니라 const 로 해도 작동하는듯 한데.

export default rootReducer
