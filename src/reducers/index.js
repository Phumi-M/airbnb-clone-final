import { combineReducers } from "redux";
import listingReducer from "./listingReducer";
import modalReducer from "./modalReducer";

const rootReducer = combineReducers({
  listingList: listingReducer,
  modal: modalReducer,
});

export default rootReducer;
