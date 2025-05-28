export interface User {
  id: string;
  username: string;
  profilePicture: string;
  bio: string;
  followers: number;
  following: number;
  games: Game[];
  savedPosts: string[];
  likedPosts: string[];
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
}

export enum Category {
  ACTION = "Action",
  ADVENTURE = "Adventure",
  RPG = "RPG",
  STRATEGY = "Strategy",
  SPORTS = "Sports",
  HORROR = "Horror",
  RACING = "Racing",
  FIGHTING = "Fighting"
}