// Definición de la interfaz que describe los métodos que debe implementar un servicio Firebase
export interface FirebaseService {
  // Métodos de autenticación
  signUp(email: string, password: string): Promise<void>; // Registrar nuevo usuario
  signIn(email: string, password: string): Promise<void>; // Iniciar sesión
  signOut(): Promise<void>; // Cerrar sesión
  
  // Métodos para manejar el perfil de usuario
  updateProfile(userId: string, data: any): Promise<void>; // Actualizar información del perfil
  getProfile(userId: string): Promise<any>; // Obtener información del perfil
  
  // Métodos para manejar posts
  createPost(data: any): Promise<void>; // Crear un nuevo post
  getPosts(): Promise<any[]>; // Obtener todos los posts
  updatePost(postId: string, data: any): Promise<void>; // Actualizar un post existente
  deletePost(postId: string): Promise<void>; // Eliminar un post
  
  // Métodos para manejar comentarios
  addComment(postId: string, data: any): Promise<void>; // Agregar un comentario a un post
  getComments(postId: string): Promise<any[]>; // Obtener comentarios de un post
  
  // Métodos para manejar interacciones con posts (like y guardados)
  likePost(postId: string, userId: string): Promise<void>; // Dar like a un post
  unlikePost(postId: string, userId: string): Promise<void>; // Quitar like a un post
  savePost(postId: string, userId: string): Promise<void>; // Guardar un post
  unsavePost(postId: string, userId: string): Promise<void>; // Quitar guardado de un post
}

// Implementación de ejemplo (mock) para pruebas sin conexión a Firebase real
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

// Exportamos la implementación mock para que pueda usarse en la app mientras no haya integración real
export const firebaseService: FirebaseService = new MockFirebaseService();
