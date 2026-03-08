import { OPEN_MODAL, CLOSE_MODAL } from "../Types/ModalTypes";

const initialState = { openClose: "close", content: "" };

export const modalReducer = (state = initialState, action) => {
  if (action.type === OPEN_MODAL) {
    return action.payload;
  }
  if (action.type === CLOSE_MODAL) {
    return action.payload;
  }
  return state;
};
