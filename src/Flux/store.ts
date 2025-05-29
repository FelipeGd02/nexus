import { AppDispatcher, Action } from "./Dispatcher"; // Dispatcher para manejar las acciones
import { ActionTypes } from "./action"; // Tipos de acciones que la app reconoce
import { defaultUser } from "../data/Users"; // Datos por defecto para usuario invitado
import { posts, comments } from "../data/Posts"; // Datos iniciales de posts y comentarios
import { games } from "../data/Games"; // Datos de juegos
import { Screens } from "../types/navigation"; // Nombres de pantallas de la app
import { User, Post, Comment, Game, Category } from "../types/models"; // Tipos para modelos usados

// Esta es la estructura completa del estado de la app que se guarda y se usa para todo
export interface AppState {
  currentScreen: Screens;               // Pantalla que se está mostrando
  currentUser: User | null;             // Usuario logueado o null si no hay
  isAuthenticated: boolean;             // Si hay usuario autenticado
  currentPostId: string | null;         // ID del post actual (detalle)
  currentCategoryFilter: Category | null; // Categoría con la que se están filtrando posts
  posts: Post[];                        // Todos los posts
  comments: Comment[];                  // Todos los comentarios
  games: Game[];                       // Todos los juegos
  filteredPosts: Post[];                // Posts filtrados según categoría
  loading: boolean;                    // Estado de carga (por si se usa)
}

type Listener = (state: AppState) => void; // Tipo para funciones que escuchan cambios

// Estas son las pantallas públicas donde no se requiere estar autenticado
const PUBLIC_ROUTES = [Screens.LANDING, Screens.LOGIN, Screens.REGISTER];

class Store {
  private _state: AppState;
  private _listeners: Listener[] = [];

  constructor() {
    // Al crear el store, cargamos el estado guardado o usamos el inicial
    this._state = this._loadState();
    // Nos registramos en el dispatcher para recibir las acciones
    AppDispatcher.register(this._handleActions.bind(this));
  }

  // Carga el estado guardado en localStorage o devuelve el estado base
  private _loadState(): AppState {
    const savedState = localStorage.getItem("nexusAppState");
    const baseState: AppState = {
      currentScreen: Screens.LANDING,
      currentUser: null,
      isAuthenticated: false,
      currentPostId: null,
      currentCategoryFilter: null,
      posts: [...posts],       // Copiamos los posts iniciales
      comments: [...comments], // Copiamos los comentarios iniciales
      games: [...games],       // Copiamos los juegos iniciales
      filteredPosts: [...posts], // Por defecto mostramos todos los posts
      loading: false
    };

    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return {
          ...baseState,
          ...parsed,
          // Si hay filtro de categoría, aplicamos filtro a posts
          filteredPosts: parsed.currentCategoryFilter
            ? posts.filter(post => {
                const game = games.find(g => g.id === post.gameId);
                return game && game.category === parsed.currentCategoryFilter;
              })
            : [...posts]
        };
      } catch (e) {
        console.error("Failed to parse saved state:", e);
      }
    }

    return baseState;
  }

  // Devuelve el estado actual
  getState(): AppState {
    return this._state;
  }

  // Permite que otros se suscriban para escuchar cambios en el estado
  subscribe(listener: Listener): void {
    this._listeners.push(listener);
    listener(this._state); // Llamamos al listener con el estado actual para sincronizar
  }

  // Permite que se cancelen suscripciones
  unsubscribe(listener: Listener): void {
    this._listeners = this._listeners.filter(l => l !== listener);
  }

  // Notifica a todos los listeners cuando hay cambios
  private _notifyListeners(): void {
    // Guardamos solo ciertas partes del estado en localStorage para persistencia
    const { currentScreen, currentUser, isAuthenticated, currentPostId, currentCategoryFilter } = this._state;
    localStorage.setItem(
      "nexusAppState",
      JSON.stringify({ currentScreen, currentUser, isAuthenticated, currentPostId, currentCategoryFilter })
    );
    // Avisamos a todos los listeners del nuevo estado
    for (const listener of this._listeners) {
      listener(this._state);
    }
  }

  // Aquí se manejan todas las acciones que llegan del Dispatcher
  private _handleActions(action: Action): void {
    switch (action.type) {
      case ActionTypes.NAVIGATE:
        if (action.payload) {
          const targetScreen = action.payload.screen;

          // Si la pantalla no es pública y no estás autenticado, te mandamos a login
          if (!PUBLIC_ROUTES.includes(targetScreen) && !this._state.isAuthenticated) {
            this._state.currentScreen = Screens.LOGIN;
            break;
          }

          // Cambiamos la pantalla y actualizamos postId y categoría si vienen en la acción
          this._state.currentScreen = targetScreen;
          this._state.currentPostId = action.payload.postId || this._state.currentPostId;
          this._state.currentCategoryFilter = action.payload.category || this._state.currentCategoryFilter;
        }
        break;

      case ActionTypes.LOGIN:
        // Guardamos el usuario que hizo login y cambiamos a pantalla Threads
        this._state.currentUser = action.payload;
        this._state.isAuthenticated = true;
        this._state.currentScreen = Screens.THREADS;
        break;

      case ActionTypes.LOGOUT:
        // Limpiamos usuario y volvemos a pantalla Landing
        this._state.currentUser = null;
        this._state.isAuthenticated = false;
        this._state.currentScreen = Screens.LANDING;
        break;

      case ActionTypes.UPDATE_PROFILE:
        // Actualizamos el perfil del usuario actual
        if (this._state.currentUser && action.payload) {
          this._state.currentUser = {
            ...this._state.currentUser,
            ...action.payload
          };
        }
        break;

      case ActionTypes.CREATE_POST: {
        // Creamos un nuevo post con los datos del usuario y la hora actual
        const newPost: Post = {
          id: `p${Date.now()}`,
          userId: this._state.currentUser?.id || "guest",
          username: this._state.currentUser?.username || "Guest",
          profilePicture: this._state.currentUser?.profilePicture || defaultUser.profilePicture,
          content: action.payload.content,
          imageUrl: action.payload.imageUrl,
          likes: 0,
          reposts: 0,
          comments: 0,
          saves: 0,
          timestamp: new Date().toISOString()
        };
        // Añadimos el nuevo post al principio
        this._state.posts.unshift(newPost);

        // Actualizamos la lista filtrada según la categoría actual
        this._state.filteredPosts = this._state.currentCategoryFilter
          ? this._state.posts.filter(post => {
              const game = this._state.games.find(g => g.id === post.gameId);
              return game && game.category === this._state.currentCategoryFilter;
            })
          : [...this._state.posts];
        break;
      }

      case ActionTypes.TOGGLE_LIKE_POST:
        // Cambiamos el estado de like en el post correspondiente
        this._togglePostInteraction("likes", "isLiked", action.payload);
        break;

      case ActionTypes.TOGGLE_SAVE_POST:
        // Cambiamos el estado de guardado en el post correspondiente
        this._togglePostInteraction("saves", "isSaved", action.payload);
        break;

      case ActionTypes.ADD_COMMENT: {
        // Creamos un comentario nuevo con los datos actuales
        const newComment: Comment = {
          id: `c${Date.now()}`,
          postId: action.payload.postId,
          userId: this._state.currentUser?.id || "guest",
          username: this._state.currentUser?.username || "Guest",
          profilePicture: this._state.currentUser?.profilePicture || defaultUser.profilePicture,
          content: action.payload.content,
          likes: 0,
          timestamp: new Date().toISOString()
        };
        // Añadimos el comentario
        this._state.comments.push(newComment);

        // Incrementamos el contador de comentarios del post
        this._incrementPostField(action.payload.postId, "comments");
        break;
      }

      case ActionTypes.TOGGLE_LIKE_COMMENT: {
        // Cambiamos el estado de like de un comentario
        const comment = this._state.comments.find(c => c.id === action.payload);
        if (comment) {
          const isLiked = comment.isLiked;
          comment.likes = isLiked ? comment.likes - 1 : comment.likes + 1;
          comment.isLiked = !isLiked;
        }
        break;
      }

      case ActionTypes.FILTER_BY_CATEGORY:
        // Actualizamos la categoría para filtrar posts
        this._state.currentCategoryFilter = action.payload;
        this._state.filteredPosts = action.payload
          ? this._state.posts.filter(post => {
              const game = this._state.games.find(g => g.id === post.gameId);
              return game && game.category === action.payload;
            })
          : [...this._state.posts];
        break;
    }

    // Después de manejar cualquier acción, notificamos a todos los que escuchan
    this._notifyListeners();
  }

  // Método para alternar likes o guardados en posts
  private _togglePostInteraction(field: "likes" | "saves", flag: "isLiked" | "isSaved", postId: string) {
    const toggle = (post: Post) => {
      if (post.id !== postId) return post;
      return {
        ...post,
        [field]: post[flag] ? post[field] - 1 : post[field] + 1, // Aumentar o disminuir contador
        [flag]: !post[flag] // Cambiar estado true/false
      };
    };

    // Actualizamos los posts y los posts filtrados para reflejar el cambio
    this._state.posts = this._state.posts.map(toggle);
    this._state.filteredPosts = this._state.filteredPosts.map(toggle);
  }

  // Método para incrementar contadores (ej: comentarios) en posts
  private _incrementPostField(postId: string, field: "comments") {
    const update = (post: Post) => (post.id === postId ? { ...post, [field]: post[field] + 1 } : post);
    this._state.posts = this._state.posts.map(update);
    this._state.filteredPosts = this._state.filteredPosts.map(update);
  }
}

// Creamos una única instancia del Store para usar en toda la app
const _storeInstance = new Store();

// Exportamos funciones para obtener el estado y suscribirse a cambios
export const appState = {
  get: () => _storeInstance.getState(),
  subscribe: (listener: (state: AppState) => void) => _storeInstance.subscribe(listener),
  unsubscribe: (listener: (state: AppState) => void) => _storeInstance.unsubscribe(listener)
};

// Función para enviar acciones al Dispatcher
export const dispatch = (action: Action) => {
  AppDispatcher.dispatch(action);
};
