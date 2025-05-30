import { login } from "../../Flux/action"; //^ Importa la función login desde el sistema Flux para manejar el estado de sesión
import { defaultUser } from "../../data/Users"; //^ Importa un usuario por defecto como base para crear nuevos usuarios
import { firebaseService } from "../../services/firebase"; //^ Importa el servicio de Firebase (simulado o real) para manejar el registro
import registerFormStyles from "./RegisterForm.css"; //^ Importa los estilos CSS del formulario de registro

class RegisterForm extends HTMLElement { //! Crea un nuevo Web Component personalizado llamado RegisterForm
  constructor() {
    super();
    this.attachShadow({ mode: "open" }); //! Crea un Shadow DOM aislado para encapsular estilos y estructura
  }

  connectedCallback() {
    this.render(); //! Renderiza la estructura HTML del componente

    const form = this.shadowRoot?.querySelector("form"); //& Selecciona el formulario dentro del shadow DOM
    const loginLink = this.shadowRoot?.querySelector("#login-link"); //& Selecciona el link para redirigir al login

    //& Asigna los eventos al formulario y al enlace de login
    form?.addEventListener("submit", this.handleSubmit.bind(this)); //* Escucha el envío del formulario
    loginLink?.addEventListener("click", this.handleLoginClick.bind(this)); //* Escucha el clic en el link de login
  }

  async handleSubmit(e: Event) {
    e.preventDefault(); //! Previene el comportamiento por defecto del formulario

    const formData = new FormData(e.target as HTMLFormElement); //& Extrae los datos del formulario
    const email = formData.get("email") as string; //& Obtiene el email
    const username = formData.get("username") as string; //& Obtiene el nombre de usuario
    const password = formData.get("password") as string; //& Obtiene la contraseña
    const confirmPassword = formData.get("confirmPassword") as string; //& Obtiene la confirmación de contraseña

    if (password !== confirmPassword) { //! Verifica si las contraseñas coinciden
      alert("Passwords don't match!"); //! Muestra alerta si no coinciden
      return;
    }

    if (username && email && password) { //! Verifica que todos los campos estén completos
      try {
        //* Llama al servicio de Firebase para registrar al usuario (simulado por ahora)
        await firebaseService.signUp(email, password);

        //! Crea un nuevo objeto de usuario con los datos ingresados
        const newUser = {
          ...defaultUser, //& Copia las propiedades del usuario por defecto
          id: `user_${Date.now()}`, //& Genera un ID único basado en la fecha actual
          username: username, //& Asigna el nombre de usuario
          email: email //& Asigna el correo electrónico
        };

        //! Inicia sesión automáticamente con el nuevo usuario
        login(newUser);
      } catch (error) {
        console.error("Registration error:", error); //! Muestra el error en consola
        alert("Failed to register. Please try again."); //! Muestra alerta al usuario si falla el registro
      }
    }
  }

  handleLoginClick(e: Event) {
    e.preventDefault(); //* Previene el comportamiento por defecto del enlace
    const loginEvent = new CustomEvent("login"); //* Crea un evento personalizado 'login'
    this.dispatchEvent(loginEvent); //* Emite el evento para que pueda ser escuchado externamente
  }

  render() {
    if (this.shadowRoot) {
      //^ Define el HTML y los estilos del formulario de registro que se ponen en el css
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
    //! Limpia los event listeners al remover el componente del DOM
    const form = this.shadowRoot?.querySelector("form");
    const loginLink = this.shadowRoot?.querySelector("#login-link");

    form?.removeEventListener("submit", this.handleSubmit.bind(this));
    loginLink?.removeEventListener("click", this.handleLoginClick.bind(this));
  }
}

export default RegisterForm; //^ Exporta el componente para que pueda ser usado en otras partes de la app
