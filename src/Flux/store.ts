import { AppDispatcher, Action } from "./Dispatcher";
import { ActionTypes } from "./action";
import { defaultUser } from "../data/Users";
import { posts, comments } from "../data/Posts";
import { games } from "../data/Games";
import { Screens } from "../types/navigation";
import { User, Post, Comment, Game, Category } from "../types/models";

export interface AppState {
  currentScreen: Screens;
  currentUser: User | null;
  isAuthenticated: boolean;
  currentPostId: string | null;
  currentCategoryFilter: Category | null;
  posts: Post[];
  comments: Comment[];
  games: Game[];
  filteredPosts: Post[];
  loading: boolean;
}

type Listener = (state: AppState) => void;

const PUBLIC_ROUTES = [Screens.LANDING, Screens.LOGIN, Screens.REGISTER];

class Store {
  private _state: AppState;
  private _listeners: Listener[] = [];

  constructor() {
    this._state = this._loadState();
    AppDispatcher.register(this._handleActions.bind(this));
  }

  private _loadState(): AppState {
    const savedState = localStorage.getItem("nexusAppState");
    const baseState: AppState = {
      currentScreen: Screens.LANDING,
      currentUser: null,
      isAuthenticated: false,
      currentPostId: null,
      currentCategoryFilter: null,
      posts: [...posts],
      comments: [...comments],
      games: [...games],
      filteredPosts: [...posts],
      loading: false
    };

    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return {
          ...baseState,
          ...parsed,
          posts: parsed.posts || baseState.posts,
          comments: parsed.comments || baseState.comments,
          filteredPosts: parsed.currentCategoryFilter
            ? (parsed.posts || posts).filter((post: Post) => {
                const game = games.find(g => g.id === post.gameId);
                return game && game.category === parsed.currentCategoryFilter;
              })
            : [...(parsed.posts || posts)]
        };
      } catch (e) {
        console.error("Failed to parse saved state:", e);
      }
    }

    return baseState;
  }

  getState(): AppState {
    return this._state;
  }

  subscribe(listener: Listener): void {
    this._listeners.push(listener);
    listener(this._state);
  }

  unsubscribe(listener: Listener): void {
    this._listeners = this._listeners.filter(l => l !== listener);
  }

  private _notifyListeners(): void {
    // Guardar en localStorage todo lo necesario para persistencia
    const {
      currentScreen,
      currentUser,
      isAuthenticated,
      currentPostId,
      currentCategoryFilter,
      posts,
      comments
    } = this._state;

    localStorage.setItem(
      "nexusAppState",
      JSON.stringify({
        currentScreen,
        currentUser,
        isAuthenticated,
        currentPostId,
        currentCategoryFilter,
        posts,
        comments
      })
    );

    // Notificar a todos los listeners suscritos
    for (const listener of this._listeners) {
      listener(this._state);
    }
  }

  private _handleActions(action: Action): void {
    switch (action.type) {
      case ActionTypes.NAVIGATE:
        if (action.payload) {
          const targetScreen = action.payload.screen;

          if (!PUBLIC_ROUTES.includes(targetScreen) && !this._state.isAuthenticated) {
            this._state.currentScreen = Screens.LOGIN;
            break;
          }

          this._state.currentScreen = targetScreen;
          this._state.currentPostId = action.payload.postId || this._state.currentPostId;
          this._state.currentCategoryFilter = action.payload.category || this._state.currentCategoryFilter;
        }
        break;

      case ActionTypes.LOGIN:
        this._state.currentUser = action.payload;
        this._state.isAuthenticated = true;
        this._state.currentScreen = Screens.THREADS;
        break;

      case ActionTypes.LOGOUT:
        this._state.currentUser = null;
        this._state.isAuthenticated = false;
        this._state.currentScreen = Screens.LANDING;
        break;

      case ActionTypes.UPDATE_PROFILE:
        if (this._state.currentUser && action.payload) {
          this._state.currentUser = {
            ...this._state.currentUser,
            ...action.payload
          };
        }
        break;

      case ActionTypes.CREATE_POST: {
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
        this._state.posts.unshift(newPost);
        this._state.filteredPosts = this._state.currentCategoryFilter
          ? this._state.posts.filter(post => {
              const game = this._state.games.find(g => g.id === post.gameId);
              return game && game.category === this._state.currentCategoryFilter;
            })
          : [...this._state.posts];
        break;
      }

      case ActionTypes.TOGGLE_LIKE_POST:
        this._togglePostInteraction("likes", "isLiked", action.payload);
        break;

      case ActionTypes.TOGGLE_SAVE_POST:
        this._togglePostInteraction("saves", "isSaved", action.payload);
        break;

      case ActionTypes.ADD_COMMENT: {
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
        this._state.comments.push(newComment);
        this._incrementPostField(action.payload.postId, "comments");
        break;
      }

      case ActionTypes.TOGGLE_LIKE_COMMENT: {
        const comment = this._state.comments.find(c => c.id === action.payload);
        if (comment) {
          const isLiked = comment.isLiked;
          comment.likes = isLiked ? comment.likes - 1 : comment.likes + 1;
          comment.isLiked = !isLiked;
        }
        break;
      }

      case ActionTypes.FILTER_BY_CATEGORY:
        this._state.currentCategoryFilter = action.payload;
        this._state.filteredPosts = action.payload
          ? this._state.posts.filter(post => {
              const game = this._state.games.find(g => g.id === post.gameId);
              return game && game.category === action.payload;
            })
          : [...this._state.posts];
        break;
    }

    this._notifyListeners();
  }

  private _togglePostInteraction(field: "likes" | "saves", flag: "isLiked" | "isSaved", postId: string) {
    const toggle = (post: Post) => {
      if (post.id !== postId) return post;
      const updated = {
        ...post,
        [field]: post[flag] ? post[field] - 1 : post[field] + 1,
        [flag]: !post[flag]
      };
      return updated;
    };

    this._state.posts = this._state.posts.map(toggle);
    this._state.filteredPosts = this._state.filteredPosts.map(toggle);
  }

  private _incrementPostField(postId: string, field: "comments") {
    const update = (post: Post) => (post.id === postId ? { ...post, [field]: post[field] + 1 } : post);
    this._state.posts = this._state.posts.map(update);
    this._state.filteredPosts = this._state.filteredPosts.map(update);
  }
}

const _storeInstance = new Store();

export const appState = {
  get: () => _storeInstance.getState(),
  subscribe: (listener: (state: AppState) => void) => _storeInstance.subscribe(listener),
  unsubscribe: (listener: (state: AppState) => void) => _storeInstance.unsubscribe(listener)
};

export const dispatch = (action: Action) => {
  AppDispatcher.dispatch(action);
};
