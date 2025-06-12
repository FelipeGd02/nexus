import { updateComment, updatePosts, updateProfile } from "../Flux/action";
import { SupaComment, SupaPost, SupaUser } from "../types/models";
import supabase from "./supaConfig";

export const initUserRealtimeListener = (userId: string) => {
  const channel = supabase
    .channel(`user-changes-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "users",
        filter: `id=eq.${userId}`,
      },
      (payload) => {
        console.log("User update detected:", payload);

        const supaProfile: SupaUser = {
          id: payload.new.id,
          username: payload.new.username,
          profilePicture:
            payload.new.profilePicture ||
            "https://i.pinimg.com/736x/9f/16/72/9f1672710cba6bcb0dfd93201c6d4c00.jpg",
          bio: payload.new.bio || "",
          followers: payload.new.followers || 0,
          following: payload.new.following || 0,
          posts: payload.new.posts || [],
        };

        updateProfile(supaProfile);
        console.log("Profile updated in Flux:", supaProfile);
      }
    )
    .subscribe();

  return channel;
};

export const initPostsRealtimeListener = () => {
  const channel = supabase
    .channel("posts-changes")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "posts",
      },
      async (payload) => {
        console.log("New post detected:", payload);

        const userId = payload.new.userId;

        const { data: user, error } = await supabase
          .from("users")
          .select("username, profilePicture")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Failed to fetch user info for post:", error.message);
          return;
        }

        const newPost: SupaPost = {
          postId: payload.new.postId,
          userId: payload.new.userId,
          username: user.username,
          profilePicture:
            user.profilePicture ||
            "https://i.pinimg.com/736x/9f/16/72/9f1672710cba6bcb0dfd93201c6d4c00.jpg",
          content: payload.new.content,
          imageUrl: payload.new.imageUrl || "",
          likes: payload.new.likes || [],
          reposts: payload.new.reposts || 0,
          comments: payload.new.comments || 0,
          saves: payload.new.saves || [],
          timestamp: payload.new.timestamp,
          gameId: payload.new.gameId || undefined,
        };

        updatePosts(newPost);
      }
    )
    .subscribe();

  return channel;
};

export const initPostUpdateListener = () => {
  const channel = supabase
    .channel("posts-updates")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "posts",
      },
      async (payload) => {
        console.log("New post detected:", payload);

        const userId = payload.new.userId;

        const { data: user, error } = await supabase
          .from("users")
          .select("username, profilePicture")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Failed to fetch user info for post:", error.message);
          return;
        }

        const newPost: SupaPost = {
          postId: payload.new.postId,
          userId: payload.new.userId,
          username: user.username,
          profilePicture:
            user.profilePicture ||
            "https://i.pinimg.com/736x/9f/16/72/9f1672710cba6bcb0dfd93201c6d4c00.jpg",
          content: payload.new.content,
          imageUrl: payload.new.imageUrl || "",
          likes: payload.new.likes || [],
          reposts: payload.new.reposts || 0,
          comments: payload.new.comments || 0,
          saves: payload.new.saves || [],
          timestamp: payload.new.timestamp,
          gameId: payload.new.gameId || undefined,
        };
        updatePosts(newPost);
      }
    )
    .subscribe();

  return channel;
};

export const initCommentsRealtimeListener = () => {
  const channel = supabase
    .channel("comments-changes")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "comments",
      },
      async (payload) => {
        console.log("New comment detected:", payload);

        const userId = payload.new.userId;

        const { data: user, error } = await supabase
          .from("users")
          .select("username, profilePicture")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Failed to fetch user info for post:", error.message);
          return;
        }

        const newComment: SupaComment = {
          id: payload.new.comId,
          postId: payload.new.postId,
          userId: payload.new.userId,
          username: user.username,
          profilePicture:
            user.profilePicture ||
            "https://i.pinimg.com/736x/9f/16/72/9f1672710cba6bcb0dfd93201c6d4c00.jpg",
          content: payload.new.content,
          likes: payload.new.likes || [],
          timestamp: payload.new.timestamp,
        };

        updateComment(newComment);
      }
    )
    .subscribe();

  return channel;
};

export const initCommentsLikeListener = () => {
  const channel = supabase
    .channel("comments-changes-updates")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "comments",
      },
      async (payload) => {
        console.log("New comment detected:", payload);

        const userId = payload.new.userId;

        const { data: user, error } = await supabase
          .from("users")
          .select("username, profilePicture")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Failed to fetch user info for post:", error.message);
          return;
        }

        const newComment: SupaComment = {
          id: payload.new.comId,
          postId: payload.new.postId,
          userId: payload.new.userId,
          username: user.username,
          profilePicture:
            user.profilePicture ||
            "https://i.pinimg.com/736x/9f/16/72/9f1672710cba6bcb0dfd93201c6d4c00.jpg",
          content: payload.new.content,
          likes: payload.new.likes || [],
          timestamp: payload.new.timestamp,
        };

        updateComment(newComment);
      }
    )
    .subscribe();

  return channel;
};
