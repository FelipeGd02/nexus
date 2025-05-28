// Firebase Service Interface
export interface FirebaseService {
  // Auth
  signUp(email: string, password: string): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  
  // User Profile
  updateProfile(userId: string, data: any): Promise<void>;
  getProfile(userId: string): Promise<any>;
  
  // Posts
  createPost(data: any): Promise<void>;
  getPosts(): Promise<any[]>;
  updatePost(postId: string, data: any): Promise<void>;
  deletePost(postId: string): Promise<void>;
  
  // Comments
  addComment(postId: string, data: any): Promise<void>;
  getComments(postId: string): Promise<any[]>;
  
  // Interactions
  likePost(postId: string, userId: string): Promise<void>;
  unlikePost(postId: string, userId: string): Promise<void>;
  savePost(postId: string, userId: string): Promise<void>;
  unsavePost(postId: string, userId: string): Promise<void>;
}

// Mock implementation for now
export class MockFirebaseService implements FirebaseService {
  async signUp(email: string, password: string): Promise<void> {
    console.log('Mock: Sign up', { email, password });
  }

  async signIn(email: string, password: string): Promise<void> {
    console.log('Mock: Sign in', { email, password });
  }

  async signOut(): Promise<void> {
    console.log('Mock: Sign out');
  }

  async updateProfile(userId: string, data: any): Promise<void> {
    console.log('Mock: Update profile', { userId, data });
  }

  async getProfile(userId: string): Promise<any> {
    console.log('Mock: Get profile', { userId });
    return {};
  }

  async createPost(data: any): Promise<void> {
    console.log('Mock: Create post', { data });
  }

  async getPosts(): Promise<any[]> {
    console.log('Mock: Get posts');
    return [];
  }

  async updatePost(postId: string, data: any): Promise<void> {
    console.log('Mock: Update post', { postId, data });
  }

  async deletePost(postId: string): Promise<void> {
    console.log('Mock: Delete post', { postId });
  }

  async addComment(postId: string, data: any): Promise<void> {
    console.log('Mock: Add comment', { postId, data });
  }

  async getComments(postId: string): Promise<any[]> {
    console.log('Mock: Get comments', { postId });
    return [];
  }

  async likePost(postId: string, userId: string): Promise<void> {
    console.log('Mock: Like post', { postId, userId });
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    console.log('Mock: Unlike post', { postId, userId });
  }

  async savePost(postId: string, userId: string): Promise<void> {
    console.log('Mock: Save post', { postId, userId });
  }

  async unsavePost(postId: string, userId: string): Promise<void> {
    console.log('Mock: Unsave post', { postId, userId });
  }
}

// Export the mock service for now
export const firebaseService: FirebaseService = new MockFirebaseService();