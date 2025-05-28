import { login } from "../../store/action";
import { defaultUser } from "../../data/Users";
import { firebaseService } from "../../services/firebase";

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
        await firebaseService.signUp(email, password);

        const newUser = {
          ...defaultUser,
          id: `user_${Date.now()}`,
          username,
          email
        };

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
    const styles = `
      :host {
        display: block;
        font-family: 'Inter', sans-serif;
      }

      .register-container {
        background-color: var(--color-darker);
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
        color: var(--color-white);
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
        color: var(--color-white);
        font-size: 0.9rem;
        font-weight: 500;
      }

      input {
        width: 100%;
        padding: 0.8rem 1rem;
        border: 2px solid var(--color-secondary);
        background-color: var(--color-dark);
        color: var(--color-white);
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }

      input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(191, 52, 103, 0.2);
      }

      .register-button {
        width: 100%;
        padding: 1rem;
        background-color: var(--color-primary);
        color: var(--color-white);
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        margin-top: 1rem;
      }

      .register-button:hover {
        background-color: #a62d57;
        transform: translateY(-2px);
      }

      .register-button:active {
        transform: translateY(0);
      }

      .login-text {
        text-align: center;
        margin-top: 1.5rem;
        color: var(--color-white);
        font-size: 0.9rem;
      }

      a {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 600;
        transition: color 0.3s ease;
      }

      a:hover {
        color: #a62d57;
        text-decoration: underline;
      }

      @media (max-width: 480px) {
        .register-container {
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

        .register-button {
          padding: 0.8rem;
        }
      }
    `;

    this.shadowRoot!.innerHTML = `
      <style>${styles}</style>
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

  disconnectedCallback() {
    const form = this.shadowRoot?.querySelector("form");
    const loginLink = this.shadowRoot?.querySelector("#login-link");

    form?.removeEventListener("submit", this.handleSubmit.bind(this));
    loginLink?.removeEventListener("click", this.handleLoginClick.bind(this));
  }
}

customElements.define("register-form", RegisterForm);
export default RegisterForm;
