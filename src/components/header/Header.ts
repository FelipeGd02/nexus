import { appState } from "../../Flux/store"; //^ Importa el estado global de la aplicación
import { navigate , logout } from "../../Flux/action"; //^ Importa funciones para navegar entre pantallas y cerrar sesión
import { Screens } from "../../types/navigation"; //^ Importa las constantes que representan las pantallas
import headerStyles from "./Header.css"; //^ Importa los estilos del encabezado

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }); //& Crea un Shadow DOM para encapsular contenido y estilos
  }

  connectedCallback() {
    this.render(); //! Renderiza el contenido del header

    //* Selecciona los elementos interactivos dentro del Shadow DOM del componente,
    //* es decir, los botones o enlaces que el usuario puede hacer clic para navegar o interactuar

    const threadsLink = this.shadowRoot?.querySelector("#threads-link"); 
    //& Selecciona el enlace que lleva a la pantalla de "Threads" (hilos de discusión)

    const categoriesLink = this.shadowRoot?.querySelector("#categories-link"); 
    //& Selecciona el enlace que lleva a la pantalla de "Categories" (categorías de juegos o contenido)

    const communityLink = this.shadowRoot?.querySelector("#community-link"); 
    //& Selecciona el enlace que lleva a la pantalla de "Community" (comunidad)

    const loginLink = this.shadowRoot?.querySelector("#login-link"); 
    //& Selecciona el botón de "Login", que se muestra solo si el usuario no ha iniciado sesión

    const logoLink = this.shadowRoot?.querySelector("#logo-link"); 
    //& Selecciona el logo de Nexus, que también actúa como botón para volver a la pantalla principal (landing)

    const profileLink = this.shadowRoot?.querySelector("#profile-link"); 
    //& Selecciona el área donde se muestra el perfil del usuario (foto y nombre) cuando está autenticado

    const logoutBtn = this.shadowRoot?.querySelector("#logout-btn"); 
    //& Selecciona el botón de "Logout", que permite al usuario cerrar sesión


    //! Asigna navegación a cada enlace del header
    logoLink?.addEventListener("click", () => {
      navigate(Screens.LANDING); //! Navega a la pantalla de inicio si le unde al boton por eso el addeventListener
    });

    threadsLink?.addEventListener("click", () => {
      navigate(Screens.THREADS); //! Navega a la pantalla de hilos si le unde al boton por eso el addeventListener
    });

    categoriesLink?.addEventListener("click", () => {
      navigate(Screens.CATEGORIES); //! Navega a la pantalla de categorías si le unde al boton por eso el addeventListener
    });

    communityLink?.addEventListener("click", () => {
      navigate(Screens.COMMUNITY); //! Navega a la comunidad si le unde al boton por eso el addeventListener
    });

    loginLink?.addEventListener("click", () => {
      navigate(Screens.LOGIN); //! Navega a la pantalla de login si le unde al boton por eso el addeventListener
    });

    profileLink?.addEventListener("click", () => {
      navigate(Screens.PROFILE); //! Navega al perfil del usuario si le unde al boton por eso el addeventListener
    });

    logoutBtn?.addEventListener("click", () => {
      logout(); //! Cierra la sesión del usuario actual si le unde al boton por eso el addeventListener
    });
  }

  render() {
    const state = appState.get(); //& Obtiene el estado global actual
    
    if (this.shadowRoot) {
      //* Inserta el HTML del header con estilos y contenido dinámico según el estado
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

      //! Funcionalidad del botón de menú en móvil esto es muy importante pa el responsive
      const menuToggle = this.shadowRoot.querySelector(".menu-toggle"); //* Selecciona el icono del menú osea las 3 rayitas
      const navLinks = this.shadowRoot.querySelector(".nav-links"); //* Selecciona la barra de navegación

      menuToggle?.addEventListener("click", () => {
        menuToggle.classList.toggle("active"); //! Activa o desactiva la animación del botón de las rayitas
        navLinks?.classList.toggle("active"); //! Muestra u oculta el menú
      });
    }
  }
}

export default AppHeader; //^ Exporta el componente para usarlo en otras partes del proyecto
