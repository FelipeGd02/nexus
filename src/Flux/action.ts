import { AppDispatcher } from "./Dispatcher";
import { Screens } from "../types/navigation";
import {
  User,
  Category,
  SupaPost,
  SupaComment,
  Comment,
  SupaUser,
} from "../types/models";
import { Post } from "../types/models";
import { appState } from "./store";

export const ActionTypes = {
  NAVIGATE: "NAVIGATE",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  UPDATE_PROFILE: "UPDATE_PROFILE",
  FILTER_BY_CATEGORY: "FILTER_BY_CATEGORY",
  UPDATE_POSTS: "UPDATE_POSTS",
  UPDATE_COMMENTS: "UPDATE_COMMENTS",
};

export const navigate = (
  screen: Screens,
  postId?: string,
  category?: Category
) => {
  AppDispatcher.dispatch({
    type: ActionTypes.NAVIGATE,
    payload: { screen, postId, category },
  });
};

export const login = (user: User) => {
  AppDispatcher.dispatch({
    type: ActionTypes.LOGIN,
    payload: user,
  });
};

export const logout = () => {
  AppDispatcher.dispatch({ type: ActionTypes.LOGOUT });
};

export const updateProfile = (supauser: SupaUser) => {
  console.log(supauser.profilePicture);

  const user: User = {
    id: supauser.id,
    username: supauser.username,
    profilePicture:
      supauser.profilePicture ||
      "https://i.pinimg.com/736x/9f/16/72/9f1672710cba6bcb0dfd93201c6d4c00.jpg",
    bio: supauser.bio || "",
    followers: supauser.followers || 0,
    following: supauser.following || 0,
  };

  AppDispatcher.dispatch({
    type: ActionTypes.UPDATE_PROFILE,
    payload: user,
  });
};

export const filterByCategory = (category: Category | null) => {
  AppDispatcher.dispatch({
    type: ActionTypes.FILTER_BY_CATEGORY,
    payload: category,
  });
};

export const updatePosts = (supaPost: SupaPost) => {
  const state = appState.get(); 

  const post: Post = {
    id: supaPost.postId.toString(),
    content: supaPost.content,
    imageUrl: supaPost.imageUrl || undefined,
    likes: supaPost.likes?.length || 0,
    comments: supaPost.comments,
    timestamp: supaPost.timestamp,
    userId: supaPost.userId,
    username: supaPost.username,
    profilePicture: supaPost.profilePicture,
    reposts: supaPost.reposts,
    saves: supaPost.saves?.length || 0,
    gameId: supaPost.gameId || undefined,
    isLiked: state.currentUser
      ? supaPost.likes?.includes(state.currentUser.id)
      : false,
    isSaved: state.currentUser
      ? supaPost.saves?.includes(state.currentUser.id)
      : false,
  };

  AppDispatcher.dispatch({
    type: ActionTypes.UPDATE_POSTS,
    payload: post,
  });
};

export const updateComment = (supaComment: SupaComment) => {
  const comment: Comment = {
    id: supaComment.id,
    postId: supaComment.postId,
    userId: supaComment.userId,
    username: supaComment.username,
    profilePicture: supaComment.profilePicture,
    content: supaComment.content,
    likes: supaComment.likes?.length || 0,
    timestamp: supaComment.timestamp,
    isLiked: supaComment.likes?.includes(supaComment.userId) || false,
  };

  AppDispatcher.dispatch({
    type: ActionTypes.UPDATE_COMMENTS,
    payload: comment,
  });
};
