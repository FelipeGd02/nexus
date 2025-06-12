import { appState } from "../Flux/store";
import { Comment, Post, User } from "../types/models";
import supabase from "./supaConfig";

//AUTHENTICATION FUNCTIONS

export async function registerWithSupa(
  email: string,
  password: string,
  username: string
) {
  console.log("Attempting to register with email:", email); // Debugging line
  const cleanEmail = email.trim();
  const cleanPassword = password.trim();

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password: cleanPassword,
  });
  const user = data?.user;

  if (user) registerUserInDatabase(user?.id, username.trim());

  return { user, error };
}

const registerUserInDatabase = async (userId: string, username: string) => {
  const { data, error } = await supabase
    .from("users")
    .insert([{ id: userId, username }])
    .single();

  if (error) {
    console.error("Error registering user in database:", error);
  }
  return data;
};

export async function loginWithSupa(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  const user = data?.user;
  const session = data?.session;

  let userProfile = null;
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
    } else {
      userProfile = profile;
    }
  }
  return { user, userProfile, session, error };
}

//PROFILE FUNCTIONS

export const updateProfileInDatabase = async (
  userId: string,
  profileData: User
) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        username: profileData.username,
        bio: profileData.bio,
        profilePicture: profileData.profilePicture,
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile in database:", error);
    } else {
      console.log("Profile updated successfully:", data);
    }
  } catch (error) {
    console.error("Error updating profile in database:", error);
  }
};

export async function uploadProfilePicture(file: File): Promise<string> {
  const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
  const filePath = `profile-pictures/${Date.now()}-${cleanName}`;
  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage.from("images").getPublicUrl(filePath);
  return data.publicUrl;
}

//POSTS FUNCTIONS

export async function uploadPostPicture(file: File): Promise<string> {
  const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
  const filePath = `posts-pictures/${Date.now()}-${cleanName}`;
  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage.from("images").getPublicUrl(filePath);
  return data.publicUrl;
}

export const uploadPost = async (post: {
  content: string;
  url: string | undefined;
  gameId: string | undefined;
}) => {
  const state = appState.get();

  function generateRandomBigInt64(): bigint {
    const high = BigInt(Math.floor(Math.random() * 2 ** 32)); // 32 bits
    const low = BigInt(Math.floor(Math.random() * 2 ** 32)); // 32 bits
    const result = (high << 32n) | low;

    // Randomly make it negative
    return Math.random() < 0.5 ? result : -result;
  }

  const newPost = {
    postId: generateRandomBigInt64().toString(),
    content: post.content,
    imageUrl: post.url,
    timestamp: new Date().toISOString(),
    userId: state.currentUser?.id || "",
    likes: null,
    comments: 0,
    reposts: 0,
    saves: null,
    gameId: post.gameId || undefined,
  };

  const { data, error } = await supabase
    .from("posts")
    .insert([newPost])
    .select()
    .single();

  if (error) {
    console.error("Error uploading post:", error);
    throw error;
  }

  console.log("Post uploaded successfully:", data);
};

export const getAllPosts = async (userId: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
    *,
    users (
      username,
      profilePicture
    )
  `
    )
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }

  console.log("Posts fetched successfully:", data[0]);

  const postsArray: Post[] = data.map((post) => ({
    id: post.postId,
    userId: post.userId,
    username: post.users.username,
    profilePicture:
      post.users.profilePicture ||
      "https://i.pinimg.com/736x/9f/16/72/9f1672710cba6bcb0dfd93201c6d4c00.jpg",
    content: post.content,
    imageUrl: post.imageUrl || undefined,
    likes: post.likes?.length || 0,
    reposts: post.reposts || 0,
    comments: post.comments || 0,
    saves: post.saves?.length || 0,
    timestamp: post.timestamp,
    gameId: post.gameId || undefined,
    isLiked: post.likes?.includes(userId) || false,
    isSaved: post.saves?.includes(userId) || false,
  }));

  return postsArray;
};

export const likePost = async (postId: string, userId: string) => {
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("likes")
    .eq("postId", postId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  let updatedLikes: string[] = post.likes ?? [];

  if (updatedLikes.includes(userId)) {
    updatedLikes = updatedLikes.filter((id) => id !== userId);
  } else {
    updatedLikes.push(userId);
  }

  const { data, error } = await supabase
    .from("posts")
    .update({ likes: updatedLikes }) // force a clear update
    .eq("postId", postId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const savePost = async (postId: string, userId: string) => {
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("saves")
    .eq("postId", postId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  let updatedSaves: string[] = post.saves ?? [];

  if (updatedSaves.includes(userId)) {
    updatedSaves = updatedSaves.filter((id) => id !== userId);
  } else {
    updatedSaves.push(userId);
  }

  const { data, error } = await supabase
    .from("posts")
    .update({ saves: updatedSaves }) // force a clear update
    .eq("postId", postId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

//COMMENT FUNCTIONS
export const addComment = async (postId: string, content: string) => {
  const state = appState.get();
  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        postId,
        comId: `c${Date.now()}`,
        userId: state.currentUser?.id || "guest",
        content,
        likes: null,
        timestamp: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error adding comment:", error);
    throw error;
  }

  console.log("Comment added successfully:", data);

  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("comments")
    .eq("postId", postId)
    .single();

  if (fetchError) {
    console.error("Error fetching post for comment count:", fetchError);
    throw fetchError;
  }

  const currentCount = post?.comments ?? 0;

  const { error: updateError } = await supabase
    .from("posts")
    .update({ comments: currentCount + 1 })
    .eq("postId", postId);

  if (updateError) {
    console.error("Error updating post comment count:", updateError);
    throw updateError;
  }

  console.log("Post comment count updated successfully");
};

export const getAllComments = async (userId: string) => {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
    *,
    users (
      username,
      profilePicture
    )
  `
    )
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }

  const commentsArray: Comment[] = data.map((comment) => ({
    id: comment.comId,
    postId: comment.postId,
    userId: comment.userId,
    username: comment.users.username,
    profilePicture:
      comment.users.profilePicture ||
      "https://i.pinimg.com/736x/9f/16/72/9f1672710cba6bcb0dfd93201c6d4c00.jpg",
    content: comment.content,
    likes: comment.likes?.length || 0,
    timestamp: comment.timestamp,
    isLiked: comment.likes?.includes(userId) || false,
  }));

  return commentsArray;
};

export const likeComment = async (commentId: string, userId: string) => {
  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("likes")
    .eq("comId", commentId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  let updatedLikes: string[] = comment.likes ?? [];

  if (updatedLikes.includes(userId)) {
    updatedLikes = updatedLikes.filter((id) => id !== userId);
  } else {
    updatedLikes.push(userId);
  }

  const { data, error } = await supabase
    .from("comments")
    .update({ likes: updatedLikes })
    .eq("comId", commentId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  console.log("Comment liked/unliked successfully:", data);
};
