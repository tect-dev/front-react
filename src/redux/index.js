import { combineReducers } from 'redux'
import auth from './auth'
import techtree from './techtree'
import board from './board'
import demo from './demo'

const rootReducer = combineReducers({
  auth,
  techtree,
  board,
  demo,
})

// reducer는 export default 해야된다는데 why??
// default 가 아니라 const 로 해도 작동하는듯 한데.

export default rootReducer
