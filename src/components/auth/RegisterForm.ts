import { login } from "../../store/action";
import { defaultUser } from "../../data/Users";
import { firebaseService } from "../../services/firebase";
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
        // Call Firebase service (mock for now)
        await firebaseService.signUp(email, password);
        
        // Create a new user
        const newUser = {
          ...defaultUser,
          id: `user_${Date.now()}`,
          username: username,
          email: email
        };
        
        // Log in the new user
        login(newUser);
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
        <style>${registerFormStyles}</style>
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

customElements.define("register-form", RegisterForm);
export default RegisterForm;