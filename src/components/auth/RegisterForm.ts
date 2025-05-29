import { login } from "../../Flux/action"; // Función para iniciar sesión en la app
import { defaultUser } from "../../data/Users"; // Datos por defecto de un usuario
import { firebaseService } from "../../services/firebase"; // Servicio para manejar Firebase 
import registerFormStyles from "./RegisterForm.css"; 

class RegisterForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }); // Crea un espacio para que estilos y código no choquen con otros
  }

  connectedCallback() {
    this.render(); // Dibuja el formulario en la página

    // Busca el formulario y el enlace para cambiar a login dentro del componente
    const form = this.shadowRoot?.querySelector("form");
    const loginLink = this.shadowRoot?.querySelector("#login-link");
    
    // Cuando el formulario se envíe, ejecuta handleSubmit
    form?.addEventListener("submit", this.handleSubmit.bind(this));
    // Cuando el usuario haga click en "Login", ejecuta handleLoginClick
    loginLink?.addEventListener("click", this.handleLoginClick.bind(this));
  }

  // Función que se activa cuando envías el formulario de registro
  async handleSubmit(e: Event) {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    
    // Verifica que las contraseñas coincidan
    if (password !== confirmPassword) {
      alert("Passwords don't match!"); // Muestra alerta si no coinciden
      return; // Sale de la función sin continuar
    }
    
    // Si hay usuario, email y contraseña, intenta registrar
    if (username && email && password) {
      try {
        // Llama al servicio que registra el usuario en Firebase
        await firebaseService.signUp(email, password);
        
        // Crea un objeto con los datos del nuevo usuario
        const newUser = {
          ...defaultUser,
          id: `user_${Date.now()}`, // Crea un id único 
          username: username,
          email: email
        };
        
        // Inicia sesión con el usuario recién creado
        login(newUser);
      } catch (error) {
        // Si algo falla, muestra mensaje en consola y alerta para el usuario
        console.error("Registration error:", error);
        alert("Failed to register. Please try again.");
      }
    }
  }

  // Función que se ejecuta cuando el usuario hace click en el enlace para ir a login
  handleLoginClick(e: Event) {
    e.preventDefault(); // Evita que el enlace recargue la página
    const loginEvent = new CustomEvent("login"); // Crea un evento personalizado llamado "login"
    this.dispatchEvent(loginEvent); // Envía el evento para que el componente padre pueda reaccionar
  }

  // Dibuja el formulario dentro del componente
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
            <button type="submit" class="register-button">Create Account</button>
          </form>
          <p class="login-text">
            Already have an account? <a href="#" id="login-link">Login</a>
          </p>
        </div>
      `;
    }
  }

  // Cuando el componente se elimina de la página, elimina los eventos para evitar problemas
  disconnectedCallback() {
    const form = this.shadowRoot?.querySelector("form");
    const loginLink = this.shadowRoot?.querySelector("#login-link");
    
    form?.removeEventListener("submit", this.handleSubmit.bind(this));
    loginLink?.removeEventListener("click", this.handleLoginClick.bind(this));
  }
}


customElements.define("register-form", RegisterForm);

export default RegisterForm;
