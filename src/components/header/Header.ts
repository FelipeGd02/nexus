//^ Importa el estado de la aplicación desde el store central de Flux
import { appState } from "../../Flux/store";

//^ Importa funciones para navegar entre pantallas y cerrar sesión
import { navigate , logout } from "../../Flux/action";

//^ Importa las constantes de nombres de pantallas
import { Screens } from "../../types/navigation";

//^ Importa los estilos CSS del componente
import headerStyles from "./Header.css";

//! Define el componente personalizado <app-header>
class AppHeader extends HTMLElement {
  constructor() {
    super();
    //! Crea un shadow DOM para encapsular el estilo y contenido del componente
    this.attachShadow({ mode: "open" });
  }

  //& Método que se ejecuta cuando el componente se inserta en el DOM
  connectedCallback() {
    this.render(); //& Llama al método para renderizar el contenido del componente

    //& Referencias a los elementos del shadow DOM se usa query selector pa encontrar el elemento por su id
    const threadsLink = this.shadowRoot?.querySelector("#threads-link");
    const categoriesLink = this.shadowRoot?.querySelector("#categories-link");
    const communityLink = this.shadowRoot?.querySelector("#community-link");
    const loginLink = this.shadowRoot?.querySelector("#login-link");
    const logoLink = this.shadowRoot?.querySelector("#logo-link");
    const profileLink = this.shadowRoot?.querySelector("#profile-link");
    const logoutBtn = this.shadowRoot?.querySelector("#logout-btn");

    //* Eventos de navegación al hacer clic en los distintos enlaces del header
    logoLink?.addEventListener("click", () => {
      navigate(Screens.LANDING); //* Navega a la pantalla de inicio
    });

    threadsLink?.addEventListener("click", () => {
      navigate(Screens.THREADS); //* Navega a la pantalla de hilos
    });

    categoriesLink?.addEventListener("click", () => {
      navigate(Screens.CATEGORIES); //* Navega a la pantalla de categorías
    });

    communityLink?.addEventListener("click", () => {
      navigate(Screens.COMMUNITY); //* Navega a la pantalla de comunidad
    });

    loginLink?.addEventListener("click", () => {
      navigate(Screens.LOGIN); //* Navega a la pantalla de login
    });

    profileLink?.addEventListener("click", () => {
      navigate(Screens.PROFILE); //* Navega al perfil del usuario
    });

    //* Evento para cerrar sesión
    logoutBtn?.addEventListener("click", () => {
      logout(); // *Ejecuta la acción de logout (cerrar sesión)
    });
  }

  //! Método para renderizar el HTML dentro del shadow DOM
  render() {
    const state = appState.get(); //& Obtiene el estado actual de la aplicación
    
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${headerStyles}</style> <!-- Aplica los estilos importados dentro del Shaadow DOOM -->
        <header>
          <div class="header-container">
            <div class="logo" id="logo-link">
              <h1>Nexus</h1> <!-- Nombre del sitio -->
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
                  <!-- Si el usuario está autenticado, muestra perfil y botón de logout -->
                  <div class="user-profile" id="profile-link">
                    <img src="${state.currentUser.profilePicture}" alt="${state.currentUser.username}">
                    <span>${state.currentUser.username}</span>
                  </div>
                  <button id="logout-btn" class="logout-btn">Logout</button>
                `
                : `
                  <!-- Si no está autenticado, muestra botón de login -->
                  <button id="login-link" class="login-btn">Login</button>
                `
              }
            </div>
            <div class="menu-toggle">
              <!-- Icono de menú para dispositivos móviles -->
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </header>
      `;

      //! Funcionalidad para alternar el menú en vista móvil
      const menuToggle = this.shadowRoot.querySelector(".menu-toggle");
      const navLinks = this.shadowRoot.querySelector(".nav-links");
      
      menuToggle?.addEventListener("click", () => {
        menuToggle.classList.toggle("active"); //& Cambia el estado visual del botón
        navLinks?.classList.toggle("active"); //& Muestra/oculta los enlaces
      });
    }
  }
}

//^ Exporta el componente para poder usarlo en otras partes de la app
export default AppHeader;

//& Este componente sirve como el encabezado principal de la aplicación Nexus,
//& mostrando el logo, enlaces de navegación, login/logout y perfil de usuario,
//& además de gestionar la navegación entre pantallas y soportar diseño responsive.
