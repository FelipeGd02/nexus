import { RealtimeChannel } from "@supabase/supabase-js";
import { appState } from "../../Flux/store";
import {
  initCommentsLikeListener,
  initCommentsRealtimeListener,
  initPostsRealtimeListener,
  initPostUpdateListener,
  initUserRealtimeListener,
} from "../../services/supaListen";
import { Screens } from "../../types/navigation";

export class AppContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    appState.subscribe(() => {
      const state = appState.get();
      this.render(state);
      console.log("State updated, re-rendering AppContainer");
      if (state.currentUser) {
        const userId = state.currentUser.id;
        this.handleUserRealTime(userId);
      }
    });
  }

  realTimeUser: RealtimeChannel | null = null;
  realTimePosts: RealtimeChannel | null = null;
  realTimePostUpdates: RealtimeChannel | null = null;
  realTimeComments: RealtimeChannel | null = null;
  realTimeCommentsLikes: RealtimeChannel | null = null;

  handleUserRealTime(id: string) {
    let oldUser = "";

    if (id !== oldUser) {
      this.realTimeUser?.unsubscribe();
      this.realTimeUser = initUserRealtimeListener(id);
      oldUser = id;
    }
  }

  connectedCallback() {
    this.render();

    const state = appState.get();
    console.log("AppContainer connected, current state:", state);

    this.realTimePosts = initPostsRealtimeListener();
    this.realTimePostUpdates = initPostUpdateListener();
    this.realTimeComments = initCommentsRealtimeListener();
    this.realTimeCommentsLikes = initCommentsLikeListener();
  }

  disconnectedCallback() {
    this.realTimeUser?.unsubscribe();
    this.realTimePosts?.unsubscribe();
    this.realTimePostUpdates?.unsubscribe();
    this.realTimeComments?.unsubscribe();
    this.realTimeCommentsLikes?.unsubscribe();
  }

  render(store = appState.get()) {
    if (!this.shadowRoot) return;

    // Limpiamos el contenido actual y añadimos el header y un contenedor principal para la pantalla
    this.shadowRoot.innerHTML = `<app-header></app-header><div id="main"></div>`;

    const main = this.shadowRoot.querySelector("#main");
    if (!main) return;

    // Según la pantalla actual en el estado, mostramos el componente correspondiente
    switch (store.currentScreen) {
      case Screens.LANDING:
        main.appendChild(document.createElement("landing-screen"));
        break;
      case Screens.THREADS:
        main.appendChild(document.createElement("threads-screen"));
        break;
      case Screens.THREAD_DETAIL:
        main.appendChild(document.createElement("thread-detail-screen"));
        break;
      case Screens.CATEGORIES:
        main.appendChild(document.createElement("categories-screen"));
        break;
      case Screens.COMMUNITY:
        main.appendChild(document.createElement("community-screen"));
        break;
      case Screens.PROFILE:
        main.appendChild(document.createElement("profile-screen"));
        break;
      case Screens.LOGIN:
      case Screens.REGISTER:
        main.appendChild(document.createElement("auth-screen"));
        break;
      default:
        // Por si algo falla, siempre mostramos la pantalla principal
        main.appendChild(document.createElement("landing-screen"));
        break;
    }
  }
}
