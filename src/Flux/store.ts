import { AppDispatcher, Action } from "./Dispatcher";
import { ActionTypes } from "./action";
import { games } from "../data/Games";
import { Screens } from "../types/navigation";
import { User, Post, Comment, Game, Category } from "../types/models";
import { getAllComments, getAllPosts } from "../services/supabase";

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
    this._state = {
      currentScreen: Screens.LANDING,
      currentUser: null,
      isAuthenticated: false,
      currentPostId: null,
      currentCategoryFilter: null,
      posts: [],
      comments: [],
      games: [...games],
      filteredPosts: [],
      loading: false,
    };

    this._loadState().then((loadedState) => {
      this._state = loadedState;
      this._notifyListeners();
    });

    AppDispatcher.register(this._handleActions.bind(this));
  }

  private async _loadState(): Promise<AppState> {
    const savedState = localStorage.getItem("nexusAppState");

    const baseState: AppState = {
      currentScreen: Screens.LANDING,
      currentUser: null,
      isAuthenticated: false,
      currentPostId: null,
      currentCategoryFilter: null,
      posts: [],
      comments: [],
      games: [...games],
      filteredPosts: [],
      loading: false,
    };

    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);

        const fetchedPosts = await getAllPosts(
          parsed.currentUser?.id || "guest"
        );
        const fetchedComments = await getAllComments(
          parsed.currentUser?.id || null
        );

        return {
          ...baseState,
          ...parsed,
          posts: fetchedPosts || [],
          comments: fetchedComments || [],
          filteredPosts: parsed.currentCategoryFilter
            ? (fetchedPosts || baseState.posts).filter((post: Post) => {
                const game = games.find((g) => g.id === post.gameId);
                return game && game.category === parsed.currentCategoryFilter;
              })
            : [...(fetchedPosts || baseState.posts)],
          currentUser: parsed.currentUser || null,
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
    this._listeners = this._listeners.filter((l) => l !== listener);
  }

  private _notifyListeners(): void {
    const {
      currentScreen,
      currentUser,
      isAuthenticated,
      currentPostId,
      currentCategoryFilter,
    } = this._state;

    localStorage.setItem(
      "nexusAppState",
      JSON.stringify({
        currentScreen,
        currentUser,
        isAuthenticated,
        currentPostId,
        currentCategoryFilter,
      })
    );

    for (const listener of this._listeners) {
      listener(this._state);
    }
  }

  private _handleActions(action: Action): void {
    switch (action.type) {
      case ActionTypes.NAVIGATE:
        if (action.payload) {
          const targetScreen = action.payload.screen;

          if (
            !PUBLIC_ROUTES.includes(targetScreen) &&
            !this._state.isAuthenticated
          ) {
            this._state.currentScreen = Screens.LOGIN;
            break;
          }

          this._state.currentScreen = targetScreen;
          this._state.currentPostId =
            action.payload.postId || this._state.currentPostId;
          this._state.currentCategoryFilter =
            action.payload.category || this._state.currentCategoryFilter;
        }
        break;

      case ActionTypes.LOGIN:
        this._state.currentUser = action.payload;
        console.log(action.payload);
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
          console.log(action.payload.profilePicture);
          this._state.currentUser = {
            ...this._state.currentUser,
            ...action.payload,
          };
        }
        break;

      case ActionTypes.UPDATE_POSTS:
        if (
          typeof action.payload === "object" &&
          "id" in action.payload &&
          "content" in action.payload
        ) {
          console.log(action.payload.postId);
          this._state.posts.forEach((p) => {
            console.log("Current post:", p.id);
          });
          const postAlreadyExists = this._state.posts.some(
            (post) => post.id === action.payload.id
          );

          if (postAlreadyExists) {
            this._state.posts = this._state.posts.map((post) =>
              post.id === action.payload.id
                ? { ...post, ...action.payload }
                : post
            );

            this._state.filteredPosts = this._state.currentCategoryFilter
              ? this._state.posts.filter((post) => {
                  const game = this._state.games.find(
                    (g) => g.id === post.gameId
                  );
                  return (
                    game && game.category === this._state.currentCategoryFilter
                  );
                })
              : [...this._state.posts];
          } else {
            this._state.posts = [action.payload, ...this._state.posts];

            this._state.filteredPosts = this._state.currentCategoryFilter
              ? this._state.posts.filter((post) => {
                  const game = this._state.games.find(
                    (g) => g.id === post.gameId
                  );
                  return (
                    game && game.category === this._state.currentCategoryFilter
                  );
                })
              : [...this._state.posts];
          }
        }
        break;

      case ActionTypes.UPDATE_COMMENTS:
        if (
          typeof action.payload === "object" &&
          "id" in action.payload &&
          "postId" in action.payload
        ) {
          const commentAlreadyExists = this._state.comments.some(
            (comment) => comment.id === action.payload.id
          );

          if (commentAlreadyExists) {
            this._state.comments = this._state.comments.map((comment) =>
              comment.id === action.payload.id
                ? { ...comment, ...action.payload }
                : comment
            );
          } else {
            this._state.comments = [action.payload, ...this._state.comments];
          }
        }
        break;

      case ActionTypes.FILTER_BY_CATEGORY:
        this._state.currentCategoryFilter = action.payload;
        this._state.filteredPosts = action.payload
          ? this._state.posts.filter((post) => {
              const game = this._state.games.find((g) => g.id === post.gameId);
              return game && game.category === action.payload;
            })
          : [...this._state.posts];
        break;
    }

    this._notifyListeners();
  }
}

const _storeInstance = new Store();

export const appState = {
  get: () => _storeInstance.getState(),
  subscribe: (listener: (state: AppState) => void) =>
    _storeInstance.subscribe(listener),
  unsubscribe: (listener: (state: AppState) => void) =>
    _storeInstance.unsubscribe(listener),
};

export const dispatch = (action: Action) => {
  AppDispatcher.dispatch(action);
};
