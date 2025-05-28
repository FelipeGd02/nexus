import { Post, Comment } from "../types/models";

export const posts: Post[] = [
  {
    id: "p1",
    userId: "u1",
    username: "GamerPro",
    profilePicture: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
    content: "Just finished The Last Guardian and I'm emotionally wrecked. That ending was perfect!",
    imageUrl: "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg",
    likes: 342,
    reposts: 87,
    comments: 42,
    saves: 56,
    timestamp: "2023-10-15T14:32:00Z",
    gameId: "1"
  },
  {
    id: "p2",
    userId: "u3",
    username: "NightOwlGamer",
    profilePicture: "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg",
    content: "Outlast still gives me nightmares. Best horror game experience ever! Who else has played it?",
    imageUrl: "https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg",
    likes: 256,
    reposts: 34,
    comments: 68,
    saves: 29,
    timestamp: "2023-10-14T23:17:00Z",
    gameId: "2"
  },
  {
    id: "p3",
    userId: "u2",
    username: "PixelWarrior",
    profilePicture: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg",
    content: "Final Fantasy VII Remake was everything I wanted and more. Can't wait for the next part!",
    imageUrl: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg",
    likes: 578,
    reposts: 123,
    comments: 89,
    saves: 145,
    timestamp: "2023-10-13T16:45:00Z",
    gameId: "3"
  },
  {
    id: "p4",
    userId: "u5",
    username: "SpeedRunner",
    profilePicture: "https://images.pexels.com/photos/774095/pexels-photo-774095.jpeg",
    content: "Just set a new personal best in Forza Horizon 5! The Mexico map is incredible for speedruns.",
    imageUrl: "https://images.pexels.com/photos/12920555/pexels-photo-12920555.jpeg",
    likes: 189,
    reposts: 21,
    comments: 35,
    saves: 12,
    timestamp: "2023-10-12T19:28:00Z",
    gameId: "4"
  },
  {
    id: "p5",
    userId: "u4",
    username: "StrategyMaster",
    profilePicture: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg",
    content: "Age of Empires IV brings back the glory of RTS games. Who wants to play some matches this weekend?",
    imageUrl: "https://images.pexels.com/photos/279618/pexels-photo-279618.jpeg",
    likes: 231,
    reposts: 45,
    comments: 72,
    saves: 38,
    timestamp: "2023-10-11T10:12:00Z",
    gameId: "5"
  },
  {
    id: "p6",
    userId: "u1",
    username: "GamerPro",
    profilePicture: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
    content: "Street Fighter 6 has the best fighting mechanics I've experienced in years. The depth of combat is incredible!",
    imageUrl: "https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg",
    likes: 412,
    reposts: 92,
    comments: 54,
    saves: 67,
    timestamp: "2023-10-10T08:56:00Z",
    gameId: "7"
  }
];

export const comments: Comment[] = [
  {
    id: "c1",
    postId: "p1",
    userId: "u2",
    username: "PixelWarrior",
    profilePicture: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg",
    content: "I completely agree! That bond between the boy and Trico was so well developed.",
    likes: 28,
    timestamp: "2023-10-15T15:10:00Z"
  },
  {
    id: "c2",
    postId: "p1",
    userId: "u5",
    username: "SpeedRunner",
    profilePicture: "https://images.pexels.com/photos/774095/pexels-photo-774095.jpeg",
    content: "The controls were a bit finicky, but the story made it all worth it.",
    likes: 15,
    timestamp: "2023-10-15T16:22:00Z"
  },
  {
    id: "c3",
    postId: "p2",
    userId: "u1",
    username: "GamerPro",
    profilePicture: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
    content: "I had to play it with the lights on! That asylum was terrifying.",
    likes: 42,
    timestamp: "2023-10-15T00:05:00Z"
  },
  {
    id: "c4",
    postId: "p3",
    userId: "u4",
    username: "StrategyMaster",
    profilePicture: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg",
    content: "The combat system was amazing. Perfect blend of old and new.",
    likes: 31,
    timestamp: "2023-10-13T17:30:00Z"
  },
  {
    id: "c5",
    postId: "p3",
    userId: "u3",
    username: "NightOwlGamer",
    profilePicture: "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg",
    content: "Cloud's character development was so well done in this remake!",
    likes: 24,
    timestamp: "2023-10-13T18:15:00Z"
  }
];