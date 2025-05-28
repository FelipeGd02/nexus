import { login } from "../../store/action";
import { users, defaultUser } from "../../data/Users";

class LoginForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

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
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

      if (user) {
        login(user);
      } else {
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
    const styles = `
      :host {
        display: block;
        font-family: 'Inter', sans-serif;
      }

      .login-container {
        background-color: #1e1e1e;
        border-radius: 10px;
        padding: 2rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        width: 100%;
        animation: fadeIn 0.6s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      h2 {
        color: #e0e0e0;
        text-align: center;
        margin: 0 0 2rem;
        font-size: 1.8rem;
        font-weight: 700;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #bdbdbd;
        font-size: 0.9rem;
        font-weight: 500;
      }

      input {
        width: 100%;
        padding: 0.8rem 1rem;
        border: 2px solid #424242;
        background-color: #333;
        color: #e0e0e0;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }

      input:focus {
        outline: none;
        border-color: #7e57c2;
        box-shadow: 0 0 0 3px rgba(126, 87, 194, 0.2);
      }

      .login-button {
        width: 100%;
        padding: 1rem;
        background-color: #7e57c2;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        margin-top: 1.5rem;
      }

      .login-button:hover {
        background-color: #673ab7;
        transform: translateY(-2px);
      }

      .login-button:active {
        transform: translateY(0);
      }

      .register-text {
        text-align: center;
        margin-top: 1.5rem;
        color: #bdbdbd;
        font-size: 0.9rem;
      }

      a {
        color: #7e57c2;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.3s ease;
      }

      a:hover {
        color: #673ab7;
        text-decoration: underline;
      }

      @media (max-width: 480px) {
        .login-container {
          padding: 1.5rem;
        }

        h2 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }

        input {
          padding: 0.7rem 0.9rem;
          font-size: 0.95rem;
        }

        .login-button {
          padding: 0.8rem;
        }
      }
    `;

    this.shadowRoot!.innerHTML = `
      <style>${styles}</style>
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

  disconnectedCallback() {
    const form = this.shadowRoot?.querySelector("form");
    const registerLink = this.shadowRoot?.querySelector("#register-link");

    form?.removeEventListener("submit", this.handleSubmit.bind(this));
    registerLink?.removeEventListener("click", this.handleRegisterClick.bind(this));
  }
}

customElements.define("login-form", LoginForm);
export default LoginForm;
