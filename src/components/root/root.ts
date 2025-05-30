import { appState } from "../../Flux/store";
import { Screens } from "../../types/navigation";

export class AppContainer extends HTMLElement {
  constructor() {
    super();
    // Creamos un Shadow DOM para tener nuestro propio espacio separado
    this.attachShadow({ mode: "open" });

    // Nos suscribimos a cambios en el estado global para redibujar la pantalla cuando cambie
    appState.subscribe(() => this.render(appState.get()));
  }

  connectedCallback() {
    // Cuando el componente se añade al DOM, dibujamos la pantalla actual
    this.render();
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
