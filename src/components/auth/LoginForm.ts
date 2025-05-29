import { login } from "../../Flux/action";
import { defaultUser, users } from "../../data/Users";
import loginFormStyles from "./LoginForm.css";

class LoginForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    // Add event listeners
    const form = this.shadowRoot?.querySelector("form");
    const registerLink = this.shadowRoot?.querySelector("#register-link");
    
    form?.addEventListener("submit", this.handleSubmit.bind(this));
    registerLink?.addEventListener("click", this.handleRegisterClick.bind(this));
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    
    if (username && password) {
      // Simple mock authentication
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
      
      if (user) {
        // In a real app, we would validate the password
        login(user);
      } else {
        // For demo, allow login with any username
        const newUser = {
          ...defaultUser,
          id: `user_${Date.now()}`,
          username: username
        };
        login(newUser);
      }
    }
  }

  handleRegisterClick(e: Event) {
    e.preventDefault();
    const registerEvent = new CustomEvent("register");
    this.dispatchEvent(registerEvent);
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${loginFormStyles}</style>
        <div class="login-container">
          <h2>Log in to Nexus</h2>
          <form>
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="login-button">Log In</button>
          </form>
          <p class="register-text">
            Don't have an account? <a href="#" id="register-link">Register now</a>
          </p>
        </div>
      `;
    }
  }

  disconnectedCallback() {
    // Cleanup event listeners if needed
    const form = this.shadowRoot?.querySelector("form");
    const registerLink = this.shadowRoot?.querySelector("#register-link");
    
    form?.removeEventListener("submit", this.handleSubmit.bind(this));
    registerLink?.removeEventListener("click", this.handleRegisterClick.bind(this));
  }
}

customElements.define("login-form", LoginForm);
export default LoginForm;