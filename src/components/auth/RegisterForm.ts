//^ Importa la función login del sistema Flux
import { login } from "../../Flux/action";

//^ Importa un usuario por defecto como base para crear nuevos usuarios
import { defaultUser } from "../../data/Users";

//^ Importa el servicio de Firebase para registrar usuarios
import { firebaseService } from "../../services/firebase";

//^ Importa los estilos del formulario de registro
import registerFormStyles from "./RegisterForm.css";

//! Crea un nuevo Web Component personalizado llamado RegisterForm
class RegisterForm extends HTMLElement {
  constructor() {
    super();
    //& Crea un shadow DOM para encapsular el contenido y estilos
    this.attachShadow({ mode: "open" });
  }

  //& Se ejecuta automáticamente cuando el componente se inserta en el DOM
  connectedCallback() {
    this.render(); //! Dibuja el contenido HTML del componente

    const form = this.shadowRoot?.querySelector("form"); //! Referencia al formulario
    const loginLink = this.shadowRoot?.querySelector("#login-link"); //! Enlace para ir al login
    
    //& Agrega listeners para el envío del formulario y el clic en "Login"
    form?.addEventListener("submit", this.handleSubmit.bind(this));
    loginLink?.addEventListener("click", this.handleLoginClick.bind(this));
  }

  //& Función que se activa cuando se envía el formulario de registro
  async handleSubmit(e: Event) {
    e.preventDefault(); //! Evita recargar la página

    //! Obtiene los datos del formulario
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    //& Verifica si las contraseñas coinciden
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    //* Si todos los datos están presentes, intenta registrar al usuario
    if (username && email && password) {
      try {
        //* Llama al servicio de Firebase para registrar el usuario (simulado)
        await firebaseService.signUp(email, password);

        //* Crea un nuevo objeto de usuario
        const newUser = {
          ...defaultUser,
          id: `user_${Date.now()}`, // Genera un ID único
          username: username,
          email: email
        };

        //! Inicia sesión automáticamente con el nuevo usuario
        login(newUser);
      } catch (error) {
        console.error("Registration error:", error); //& Muestra el error en consola
        alert("Failed to register. Please try again."); //& Alerta al usuario
      }
    }
  }

  //& Función que se ejecuta al hacer clic en el enlace "Login"
  handleLoginClick(e: Event) {
    e.preventDefault(); //& Previene comportamiento por defecto del enlace
    const loginEvent = new CustomEvent("login"); //& Crea un evento personalizado
    this.dispatchEvent(loginEvent); //& Lanza el evento para cambiar de vista a login
  }

  //& Renderiza el contenido HTML del componente
  render() {
    if (this.shadowRoot) {
      //^ Define el HTML y aplica los estilos del formulario de registro
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

  //& Se ejecuta cuando el componente se elimina del DOM
  disconnectedCallback() {
    //! Limpia los event listeners al remover el componente del DOM
    const form = this.shadowRoot?.querySelector("form");
    const loginLink = this.shadowRoot?.querySelector("#login-link");

    //& Intenta quitar los listeners agregados (esto no funciona correctamente por el uso de bind)
    form?.removeEventListener("submit", this.handleSubmit.bind(this));
    loginLink?.removeEventListener("click", this.handleLoginClick.bind(this));
  }
}


//^ Exporta el componente para poder usarlo en otros archivos
export default RegisterForm;
