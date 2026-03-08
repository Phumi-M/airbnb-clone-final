/**
 * Modal state: open (with content type: "login" | "language") and close.
 */
import { OPEN_MODAL, CLOSE_MODAL } from "../Types/ModalTypes";

export const openModal = (openClose, content) => {
  return {
    type: OPEN_MODAL,
    payload: { openClose: "open", content },
  };
};

export const closeModal = () => {
  return {
    type: CLOSE_MODAL,
    payload: { openClose: "close", content: "" },
  };
};
