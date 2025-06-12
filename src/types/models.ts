export interface User {
  id: string;
  username: string;
  profilePicture: string;
  bio: string;
  followers: number;
  following: number;
}

export interface Game {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  rating: number;
  releaseDate: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  profilePicture: string;
  content: string;
  imageUrl?: string;
  likes: number;
  reposts: number;
  comments: number;
  saves: number;
  timestamp: string;
  gameId?: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  profilePicture: string;
  content: string;
  likes: number;
  timestamp: string;
  isLiked?: boolean;
}

export interface SupaPost {
  postId: string;
  userId: string;
  username: string;
  profilePicture: string;
  content: string;
  imageUrl?: string;
  likes: string[] | null;
  reposts: number;
  comments: number;
  saves: string[] | null;
  timestamp: string;
  gameId?: string;
}

export interface SupaComment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  profilePicture: string;
  content: string;
  likes: string[] | null;
  timestamp: string;
}

export interface SupaUser {
  id: string;
  username: string;
  profilePicture: string;
  bio: string;
  followers: number;
  following: number;
  posts: string[];
}

export enum Category {
  ACTION = "Action",
  ADVENTURE = "Adventure",
  RPG = "RPG",
  STRATEGY = "Strategy",
  SPORTS = "Sports",
  HORROR = "Horror",
  RACING = "Racing",
  FIGHTING = "Fighting",
}
