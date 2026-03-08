import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_CLEAR_ERROR,
  USER_LOGOUT,
} from "../Types/UserTypes";

export const userLoginReducers = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true, error: null };

    case USER_LOGIN_SUCCESS: {
      const payload = action.payload;
      const userInfo = payload?.userInfo ?? payload;
      const rawToken = payload?.token;
      const token = typeof rawToken === "string" && rawToken.trim() ? rawToken.trim() : null;
      return { loading: false, userInfo: userInfo || null, token, error: null };
    }

    case USER_LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload };

    case USER_CLEAR_ERROR:
      return { ...state, error: null };

    case USER_LOGOUT:
      return {};

    default:
      return state;
  }
};
