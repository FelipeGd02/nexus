import { login } from "../../store/action"; //^ Importa la función para hacer login en el estado global
import { defaultUser } from "../../data/Users"; //^ Importa el objeto base para nuevos usuarios
import { firebaseService } from "../../services/firebase"; //^ Importa el servicio de Firebase (simulado)
import registerFormStyles from "./RegisterForm.css"; //^ Importa los estilos CSS del componente


class RegisterForm extends HTMLElement { //! Define un Web Component <register-form>
  constructor() {
    super(); //! Llama al constructor del HTMLElement
    this.attachShadow({ mode: "open" }); //& Activa el Shadow DOM para encapsular contenido
  }

  connectedCallback() { //& Se ejecuta cuando el componente se añade al DOM
    this.render(); //& Renderiza el contenido HTML del formulario

    const form = this.shadowRoot?.querySelector("form"); //! Selecciona el formulario del Shadow DOM
    const loginLink = this.shadowRoot?.querySelector("#login-link"); //! Enlace para ir a login

    form?.addEventListener("submit", this.handleSubmit.bind(this)); //~ Maneja el envío del formulario
    loginLink?.addEventListener("click", this.handleLoginClick.bind(this)); //~ Maneja el clic en “Login”
  }

  async handleSubmit(e: Event) { //! Método que maneja el evento submit (envío del formulario)
    e.preventDefault(); //! Previene el comportamiento por defecto del formulario

    const formData = new FormData(e.target as HTMLFormElement); //~ Extrae los datos del formulario
    const email = formData.get("email") as string; //~ Obtiene el email ingresado
    const username = formData.get("username") as string; //~ Obtiene el nombre de usuario
    const password = formData.get("password") as string; //~ Obtiene la contraseña
    const confirmPassword = formData.get("confirmPassword") as string; //~ Obtiene la confirmación de contraseña

    if (password !== confirmPassword) { //& Verifica si las contraseñas coinciden
      alert("Passwords don't match!"); //& Muestra alerta si no coinciden
      return; //& Detiene el proceso
    }

    if (username && email && password) { //! Verifica que los campos estén diligenciados
      try {
        await firebaseService.signUp(email, password); //* Simula registro con Firebase

        const newUser = { //* Crea el nuevo usuario
          ...defaultUser, //* Copia las propiedades del usuario por defecto
          id: `user_${Date.now()}`, //* Crea un ID único usando timestamp
          username: username, //* Asigna el nombre de usuario
          email: email //* Asigna el email
        };

        login(newUser); //* Hace login automático del nuevo usuario
      } catch (error) {
        console.error("Registration error:", error); //* Muestra el error en consola
        alert("Failed to register. Please try again."); //* Alerta al usuario
      }
    }
  }

  handleLoginClick(e: Event) { //! Maneja clic en el enlace “Login”
    e.preventDefault(); //! Previene que el enlace recargue o cambie la página
    const loginEvent = new CustomEvent("login"); //! Crea un evento personalizado llamado “login”
    this.dispatchEvent(loginEvent); //! Emite el evento hacia el componente padre
  }

  render() { //& Método que renderiza el HTML del formulario
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = ` // Inserta el HTML dentro del Shadow DOM
        <style>${registerFormStyles}</style> <!-- Aplica los estilos al componente -->
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

  disconnectedCallback() { //& Se llama cuando el componente se elimina del DOM
    const form = this.shadowRoot?.querySelector("form"); //& Referencia al formulario
    const loginLink = this.shadowRoot?.querySelector("#login-link"); //& Referencia al enlace de login

    //& Estos removeEventListener no funcionarán correctamente por el uso de bind inline,
    //& idealmente se deberían guardar los handlers como propiedades para limpiarlos bien
    form?.removeEventListener("submit", this.handleSubmit.bind(this)); //& Intenta remover el event listener del formulario
    loginLink?.removeEventListener("click", this.handleLoginClick.bind(this)); //& Intenta remover el event listener del enlace
  }
}


export default RegisterForm; //^ Exporta el componente para usarlo en otras partes del proyecto
