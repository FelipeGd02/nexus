import { appState } from "../../Flux/store"; // Estado global de la app
import { Screens } from "../../types/navigation"; // Pantallas definidas en la app
import "../../components/auth/LoginForm"; // Componente formulario de login
import "../../components/auth/RegisterForm"; // Componente formulario de registro
import authStyles from "./AuthScreen.css"; 

class AuthScreen extends HTMLElement {
  showRegister: boolean = false; // Controla si mostrar formulario de registro o login

  constructor() {
    super();
    // Creamos un Shadow DOM para encapsular el estilo y contenido
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Cuando el componente aparece, chequeamos la pantalla actual para decidir qué formulario mostrar
    const state = appState.get();
    this.showRegister = state.currentScreen === Screens.REGISTER;
    this.render(); // Dibujamos la pantalla
  }

  render() {
    if (!this.shadowRoot) return;

    // Dependiendo de showRegister, mostramos el formulario de registro o el de login
    const formHtml = this.showRegister
      ? `<register-form></register-form>`
      : `<login-form></login-form>`;

    // Armamos el HTML con el formulario elegido y la parte visual (imagen y texto de bienvenida)
    this.shadowRoot.innerHTML = `
      <style>${authStyles}</style>
      <div class="auth-container">
        <div class="auth-content">
          <div class="form-wrapper">
            ${formHtml}
          </div>
          <div class="auth-image">
            <div class="image-overlay"></div>
            <div class="welcome-text">
              <h2>Welcome to Nexus</h2>
              <p>The ultimate social platform for gamers</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Buscamos los formularios para agregar eventos que permitan cambiar entre login y registro
    const loginForm = this.shadowRoot.querySelector("login-form");
    const registerForm = this.shadowRoot.querySelector("register-form");

    // Si el formulario de login dispara el evento 'register', mostramos el formulario de registro
    loginForm?.addEventListener("register", () => {
      this.showRegister = true;
      this.render();
    });

    // Si el formulario de registro dispara el evento 'login', mostramos el formulario de login
    registerForm?.addEventListener("login", () => {
      this.showRegister = false;
      this.render();
    });
  }

  disconnectedCallback() {
    // Aquí podrías limpiar eventos si hiciera falta (opcional)
  }
}

export default AuthScreen;
