import { combineReducers } from "redux"
import msgs from "./msgs"
import reducer from "./reducer"

const chat = combineReducers({
  msgs,
  reducer
});

export default chat