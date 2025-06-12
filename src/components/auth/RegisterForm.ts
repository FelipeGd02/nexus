
import { navigate } from "../../Flux/action";
import { registerWithSupa } from "../../services/supabase";
import { Screens } from "../../types/navigation";
import registerFormStyles from "./RegisterForm.css";

class RegisterForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render(); 

    const form = this.shadowRoot?.querySelector("form"); 
    const loginLink = this.shadowRoot?.querySelector("#login-link"); 
    
    form?.addEventListener("submit", this.handleSubmit.bind(this));
    loginLink?.addEventListener("click", this.handleLoginClick.bind(this));
  }

  async handleSubmit(e: Event) {
    e.preventDefault(); 

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (username && email && password) {
      try {

        console.log("Attempting to register with email:", email); // Add this line

        const {user, error} = await registerWithSupa(email, password, username)

        if (error) {
          console.error("Registration error:", error);
          const errorMessage = error.message || "An error occurred during registration.";
          const errorElement = this.shadowRoot?.querySelector("#error");
          if (errorElement) {
            errorElement.textContent = errorMessage;
          }
          return;
        }

        if (user) {
          navigate(Screens.LOGIN); 
        }

      } catch (error) {
        console.error("Registration error:", error); 
        alert("Failed to register. Please try again."); 
      }
    }
  }

  handleLoginClick(e: Event) {
    e.preventDefault(); 
    const loginEvent = new CustomEvent("login"); 
    this.dispatchEvent(loginEvent); 
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${registerFormStyles}</style> <!-- Aplica estilos -->
        <div class="register-container">
          <h2>Create Account</h2>
          <form>
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
            </div>
            <div class="form-group">
              <label for="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" name="confirmPassword" required>
            </div>
            <p id="error"></p>
            <button type="submit" class="register-button">Create Account</button>
          </form>
          <p class="login-text">
            Already have an account? <a href="#" id="login-link">Login</a>
          </p>
        </div>
      `;
    }
  }

  disconnectedCallback() {
    const form = this.shadowRoot?.querySelector("form");
    const loginLink = this.shadowRoot?.querySelector("#login-link");
    form?.removeEventListener("submit", this.handleSubmit.bind(this));
    loginLink?.removeEventListener("click", this.handleLoginClick.bind(this));
  }
}

export default RegisterForm;
