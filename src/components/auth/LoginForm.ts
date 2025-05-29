import { login } from "../../Flux/action"; // Importa la acción de inicio de sesión desde Flux 
import { defaultUser, users } from "../../data/Users"; // Importa los datos de usuarios 
import loginFormStyles from "./LoginForm.css"; 

class LoginForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }); 
  }

  connectedCallback() {
    this.render(); // Llama a la función render cuando el componente se conecta al DOM

    const form = this.shadowRoot?.querySelector("form");
    const registerLink = this.shadowRoot?.querySelector("#register-link");
    
    // Maneja el envío del formulario de inicio de sesión
    form?.addEventListener("submit", this.handleSubmit.bind(this));
    registerLink?.addEventListener("click", this.handleRegisterClick.bind(this));
  }

  // Función que maneja el envío del formulario
  handleSubmit(e: Event) {
    e.preventDefault(); 
    
    const formData = new FormData(e.target as HTMLFormElement); // Obtiene los datos del formulario
    const username = formData.get("username") as string; // Obtiene el nombre de usuario 
    const password = formData.get("password") as string; // Obtiene la contraseña 
    
    if (username && password) { // Verifica que el usuario y la contraseña existan
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase()); // Busca al usuario por nombre

      if (user) {
        // Validar la contraseña
        login(user); // Llama a la función de login si el usuario es encontrado
      } else {
        // Si el usuario no existe, crea un nuevo usuario y realiza el login
        const newUser = {
          ...defaultUser, // Usa los datos por defecto del usuario
          id: `user_${Date.now()}`, // Asigna un ID único basado en el tiempo
          username: username // Asigna el nombre de usuario
        };
        login(newUser); // Llama a la función de login con el nuevo usuario
      }
    }
  }

  handleRegisterClick(e: Event) {
    e.preventDefault(); 
    const registerEvent = new CustomEvent("register"); // Crea un evento personalizado para el registro
    this.dispatchEvent(registerEvent); 
  }

  //Renderizar el HTML del componente
  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${loginFormStyles}</style> <!-- Aplica los estilos CSS -->
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
    const form = this.shadowRoot?.querySelector("form");
    const registerLink = this.shadowRoot?.querySelector("#register-link");
    
    form?.removeEventListener("submit", this.handleSubmit.bind(this));
    registerLink?.removeEventListener("click", this.handleRegisterClick.bind(this));
  }
}


customElements.define("login-form", LoginForm);

export default LoginForm;
