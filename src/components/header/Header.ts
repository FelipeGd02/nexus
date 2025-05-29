import { appState } from "../../Flux/store"; // Estado global de la aplicación
import { navigate , logout } from "../../Flux/action"; // Funciones para cambiar pantalla y cerrar sesión
import { Screens } from "../../types/navigation"; // Lista de pantallas disponibles
import headerStyles from "./Header.css"; 

class AppHeader extends HTMLElement {
  constructor() {
    super();
    // Creamos un Shadow DOM para que este componente tenga su propio espacio separado
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Cuando el componente se pone visible, dibujamos todo
    this.render();

    // Buscamos los enlaces y botones que vamos a necesitar para ponerles eventos
    const threadsLink = this.shadowRoot?.querySelector("#threads-link");
    const categoriesLink = this.shadowRoot?.querySelector("#categories-link");
    const communityLink = this.shadowRoot?.querySelector("#community-link");
    const loginLink = this.shadowRoot?.querySelector("#login-link");
    const logoLink = this.shadowRoot?.querySelector("#logo-link");
    const profileLink = this.shadowRoot?.querySelector("#profile-link");
    const logoutBtn = this.shadowRoot?.querySelector("#logout-btn");

    // Cuando el logo es clickeado, vamos a la pantalla principal
    logoLink?.addEventListener("click", () => {
      navigate(Screens.LANDING);
    });

    // Cada enlace navega a la pantalla correspondiente
    threadsLink?.addEventListener("click", () => {
      navigate(Screens.THREADS);
    });

    categoriesLink?.addEventListener("click", () => {
      navigate(Screens.CATEGORIES);
    });

    communityLink?.addEventListener("click", () => {
      navigate(Screens.COMMUNITY);
    });

    loginLink?.addEventListener("click", () => {
      navigate(Screens.LOGIN);
    });

    profileLink?.addEventListener("click", () => {
      navigate(Screens.PROFILE);
    });

    // Si se hace click en el botón de logout, cerramos sesión
    logoutBtn?.addEventListener("click", () => {
      logout();
    });
  }

  render() {
    // Obtenemos el estado actual de la app para saber qué mostrar
    const state = appState.get();
    
    if (this.shadowRoot) {
      // Armamos el HTML del header con estilos, enlaces y opciones según si el usuario está logueado
      this.shadowRoot.innerHTML = `
        <style>${headerStyles}</style>
        <header>
          <div class="header-container">
            <div class="logo" id="logo-link">
              <h1>Nexus</h1>
            </div>
            <nav class="nav-links">
              <ul>
                <li><a id="threads-link" class="${state.currentScreen === Screens.THREADS ? 'active' : ''}">Threads</a></li>
                <li><a id="categories-link" class="${state.currentScreen === Screens.CATEGORIES ? 'active' : ''}">Categories</a></li>
                <li><a id="community-link" class="${state.currentScreen === Screens.COMMUNITY ? 'active' : ''}">Community</a></li>
              </ul>
            </nav>
            <div class="auth-section">
              ${state.isAuthenticated && state.currentUser 
                ? `
                  <div class="user-profile" id="profile-link">
                    <img src="${state.currentUser.profilePicture}" alt="${state.currentUser.username}">
                    <span>${state.currentUser.username}</span>
                  </div>
                  <button id="logout-btn" class="logout-btn">Logout</button>
                `
                : `<button id="login-link" class="login-btn">Login</button>`
              }
            </div>
            <div class="menu-toggle">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </header>
      `;

      // Para dispositivos móviles: botón para mostrar u ocultar el menú
      const menuToggle = this.shadowRoot.querySelector(".menu-toggle");
      const navLinks = this.shadowRoot.querySelector(".nav-links");
      
      menuToggle?.addEventListener("click", () => {
        menuToggle.classList.toggle("active"); // Cambia estilo del botón para mostrar que está activo
        navLinks?.classList.toggle("active"); // Muestra u oculta los enlaces del menú
      });
    }
  }

}

export default AppHeader;
