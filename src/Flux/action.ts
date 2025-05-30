import { AppDispatcher } from "./Dispatcher"; // Manejador que envía las acciones a la app
import { Screens } from "../types/navigation"; // Nombres de las pantallas de la app
import { User, Category } from "../types/models"; // Tipos para usuarios y categorías

// Definimos los tipos de acciones que pueden ocurrir en la app
export const ActionTypes = {
  NAVIGATE: "NAVIGATE",               // Cambiar de pantalla
  LOGIN: "LOGIN",                     // Iniciar sesión
  LOGOUT: "LOGOUT",                   // Cerrar sesión
  UPDATE_PROFILE: "UPDATE_PROFILE",   // Actualizar perfil de usuario
  CREATE_POST: "CREATE_POST",         // Crear un nuevo post
  TOGGLE_LIKE_POST: "TOGGLE_LIKE_POST",   // Dar o quitar like a un post
  TOGGLE_SAVE_POST: "TOGGLE_SAVE_POST",   // Guardar o quitar guardado en un post
  ADD_COMMENT: "ADD_COMMENT",         // Agregar un comentario a un post
  TOGGLE_LIKE_COMMENT: "TOGGLE_LIKE_COMMENT", // Dar o quitar like a un comentario
  FILTER_BY_CATEGORY: "FILTER_BY_CATEGORY"    // Filtrar posts por categoría
};

// Ahora definimos las funciones que crean y envían esas acciones

// Cambiar a una pantalla, opcionalmente con id de post o categoría
export const navigate = (screen: Screens, postId?: string, category?: Category) => {
  AppDispatcher.dispatch({
    type: ActionTypes.NAVIGATE,
    payload: { screen, postId, category }
  });
};

// Iniciar sesión con un usuario
export const login = (user: User) => {
  AppDispatcher.dispatch({
    type: ActionTypes.LOGIN,
    payload: user
  });
};

// Cerrar sesión
export const logout = () => {
  AppDispatcher.dispatch({ type: ActionTypes.LOGOUT });
};

// Actualizar perfil con nueva info de usuario
export const updateProfile = (user: User) => {
  AppDispatcher.dispatch({
    type: ActionTypes.UPDATE_PROFILE,
    payload: user
  });
};

// Crear un post nuevo con contenido y opcionalmente una imagen
export const createPost = (content: string, imageUrl?: string) => {
  AppDispatcher.dispatch({
    type: ActionTypes.CREATE_POST,
    payload: { content, imageUrl }
  });
};

// Cambiar el estado de like en un post (dar o quitar)
export const toggleLikePost = (postId: string) => {
  AppDispatcher.dispatch({
    type: ActionTypes.TOGGLE_LIKE_POST,
    payload: postId
  });
};

// Cambiar el estado de guardado en un post (guardar o quitar)
export const toggleSavePost = (postId: string) => {
  AppDispatcher.dispatch({
    type: ActionTypes.TOGGLE_SAVE_POST,
    payload: postId
  });
};

// Agregar un comentario a un post específico
export const addComment = (postId: string, content: string) => {
  AppDispatcher.dispatch({
    type: ActionTypes.ADD_COMMENT,
    payload: { postId, content }
  });
};

// Cambiar el estado de like en un comentario (dar o quitar)
export const toggleLikeComment = (commentId: string) => {
  AppDispatcher.dispatch({
    type: ActionTypes.TOGGLE_LIKE_COMMENT,
    payload: commentId
  });
};

// Filtrar posts para mostrar solo los que tienen cierta categoría (o todos si es null)
export const filterByCategory = (category: Category | null) => {
  AppDispatcher.dispatch({
    type: ActionTypes.FILTER_BY_CATEGORY,
    payload: category
  });
};
