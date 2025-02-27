import { combineReducers } from 'redux'
import betReducer from './betReducer'
import userReducer from './userReducer'
import transactionReducer from './transactionReducer'
import gameReducer from './gameReducer'
import gameValueReducer from './gameValueReducer'
import displayValueReducer from './displayValueReducer'
import usersBetDataReducer from './usersBetDataReducer'

export default combineReducers({
  betData: betReducer,
  userData: userReducer,
  transactionData: transactionReducer,
  betGameData: gameReducer,
  gameValue: gameValueReducer,
  displayData: displayValueReducer,
  usersBetData: usersBetDataReducer
})