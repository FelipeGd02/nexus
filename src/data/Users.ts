import { User } from "../types/models";

export const users: User[] = [
  {
    id: "u1",
    username: "GamerPro",
    profilePicture: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
    bio: "Professional gamer and streamer. Love RPGs and action games.",
    followers: 1500,
    following: 350,
    games: [],
    savedPosts: [],
    likedPosts: []
  },
  {
    id: "u2",
    username: "PixelWarrior",
    profilePicture: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg",
    bio: "Indie game developer by day, hardcore gamer by night.",
    followers: 820,
    following: 210,
    games: [],
    savedPosts: [],
    likedPosts: []
  },
  {
    id: "u3",
    username: "NightOwlGamer",
    profilePicture: "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg",
    bio: "Gaming after midnight is my specialty. Horror game enthusiast.",
    followers: 620,
    following: 180,
    games: [],
    savedPosts: [],
    likedPosts: []
  },
  {
    id: "u4",
    username: "StrategyMaster",
    profilePicture: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg",
    bio: "If it requires thinking 10 steps ahead, I'm in. Strategy games are life.",
    followers: 930,
    following: 245,
    games: [],
    savedPosts: [],
    likedPosts: []
  },
  {
    id: "u5",
    username: "SpeedRunner",
    profilePicture: "https://images.pexels.com/photos/774095/pexels-photo-774095.jpeg",
    bio: "Breaking records one game at a time. Currently focused on Elden Ring speedruns.",
    followers: 1200,
    following: 300,
    games: [],
    savedPosts: [],
    likedPosts: []
  }
];

// Default user for local testing
export const defaultUser: User = {
  id: "default",
  username: "Guest",
  profilePicture: "https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg",
  bio: "Welcome to Nexus! Sign in to customize your profile.",
  followers: 0,
  following: 0,
  games: [],
  savedPosts: [],
  likedPosts: []
};