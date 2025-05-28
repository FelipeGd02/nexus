import { appState } from "../../store";
import { Screens } from "../../types/navigation";
import "../../components/auth/login-form";
import "../../components/auth/register-form";
import authStyles from "./AuthScreen.css";

class AuthScreen extends HTMLElement {
  showRegister: boolean = false;
  
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Determine which form to show based on the current screen
    const state = appState.get();
    this.showRegister = state.currentScreen === Screens.REGISTER;
    
    this.render();
    
    // Event listeners
    const loginForm = this.shadowRoot?.querySelector("login-form");
    const registerForm = this.shadowRoot?.querySelector("register-form");
    
    loginForm?.addEventListener("register", () => {
      this.showRegister = true;
      this.render();
    });
    
    registerForm?.addEventListener("login", () => {
      this.showRegister = false;
      this.render();
    });
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${authStyles}</style>
        <div class="auth-container">
          <div class="auth-content">
            <div class="form-container ${this.showRegister ? 'show-register' : ''}">
              <div class="form-wrapper login-wrapper">
                <login-form></login-form>
              </div>
              <div class="form-wrapper register-wrapper">
                <register-form></register-form>
              </div>
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
      
      // Re-attach event listeners after rendering
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
  }

  disconnectedCallback() {
    // Cleanup event listeners if needed
  }
}

export default AuthScreen;