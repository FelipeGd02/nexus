
// Import screens as custom elements
import { appState } from "../../store";
import { Screens } from "../../types/navigation";

export class AppContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    appState.subscribe(() => this.render(appState.get()));
}

  connectedCallback() {
    this.render();
  }

  render(store = appState.get()) {
    if (!this.shadowRoot) return;

    // Clear existing content before rendering
    this.shadowRoot.innerHTML = `<app-header></app-header><div id="main"></div>`;

    const main = this.shadowRoot.querySelector("#main");
    if (!main) return;

    // Determine the screen to render
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
        main.appendChild(document.createElement("landing-screen"));
        break;
    }
  }
}

