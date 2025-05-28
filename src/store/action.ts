import { AppDispatcher } from "./dispatch";
import { Screens } from "../types/navigation";
import { User, Category } from "../types/models";

// Action Types
export const ActionTypes = {
  NAVIGATE: "NAVIGATE",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  UPDATE_PROFILE: "UPDATE_PROFILE",
  TOGGLE_LIKE_POST: "TOGGLE_LIKE_POST",
  TOGGLE_SAVE_POST: "TOGGLE_SAVE_POST",
  ADD_COMMENT: "ADD_COMMENT",
  FILTER_BY_CATEGORY: "FILTER_BY_CATEGORY"
};

// Actions
export const navigate = (screen: Screens, postId?: string, category?: Category) => {
  AppDispatcher.dispatch({
    type: ActionTypes.NAVIGATE,
    payload: { screen, postId, category }
  });
};

export const login = (user: User) => {
  AppDispatcher.dispatch({
    type: ActionTypes.LOGIN,
    payload: user
  });
};

export const logout = () => {
  AppDispatcher.dispatch({ type: ActionTypes.LOGOUT });
};

export const updateProfile = (user: User) => {
  AppDispatcher.dispatch({
    type: ActionTypes.UPDATE_PROFILE,
    payload: user
  });
};

export const toggleLikePost = (postId: string) => {
  AppDispatcher.dispatch({
    type: ActionTypes.TOGGLE_LIKE_POST,
    payload: postId
  });
};

export const toggleSavePost = (postId: string) => {
  AppDispatcher.dispatch({
    type: ActionTypes.TOGGLE_SAVE_POST,
    payload: postId
  });
};

export const addComment = (postId: string, content: string) => {
  AppDispatcher.dispatch({
    type: ActionTypes.ADD_COMMENT,
    payload: { postId, content }
  });
};

export const filterByCategory = (category: Category | null) => {
  AppDispatcher.dispatch({
    type: ActionTypes.FILTER_BY_CATEGORY,
    payload: category
  });
};