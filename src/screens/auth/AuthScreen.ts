import { appState } from "../../Flux/store";
import { Screens } from "../../types/navigation";
import "../../components/auth/LoginForm";
import "../../components/auth/RegisterForm";
import authStyles from "./AuthScreen.css";

class AuthScreen extends HTMLElement {
  showRegister: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const state = appState.get();
    this.showRegister = state.currentScreen === Screens.REGISTER;
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    const formHtml = this.showRegister
      ? `<register-form></register-form>`
      : `<login-form></login-form>`;

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

    const loginForm = this.shadowRoot.querySelector("login-form");
    const registerForm = this.shadowRoot.querySelector("register-form");

    loginForm?.addEventListener("register", () => {
      this.showRegister = true;
      this.render();
    });

    registerForm?.addEventListener("login", () => {
      this.showRegister = false;
      this.render();
    });
  }

  disconnectedCallback() {
    // Optional cleanup if needed
  }
}

export default AuthScreen;
