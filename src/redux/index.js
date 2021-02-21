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

export default rootReducer
