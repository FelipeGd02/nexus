//^ Importa la función de login desde el sistema Flux
import { login } from "../../Flux/action";

//^ Importa el usuario por defecto y una lista simulada de usuarios
import { defaultUser, users } from "../../data/Users";

//^ Importa los estilos del formulario
import loginFormStyles from "./LoginForm.css";

//! Define el componente personalizado <login-form>
class LoginForm extends HTMLElement {
  //& Guarda las versiones binded de los métodos para usarlas en add/removeEventListener
  private boundHandleSubmit: (e: Event) => void;
  private boundHandleRegisterClick: (e: Event) => void;

  constructor() {
    super();
    this.attachShadow({ mode: "open" }); //& Crea Shadow DOM para encapsular el estilo

    //& Enlaza los métodos a la instancia y los guarda para poder remover los listeners después
    this.boundHandleSubmit = this.handleSubmit.bind(this);
    this.boundHandleRegisterClick = this.handleRegisterClick.bind(this);
  }

  //! Método que se ejecuta cuando el componente se agrega al DOM
  connectedCallback() {
    this.render(); //! Renderiza el contenido del formulario

    //! Obtiene las referencias a elementos del formulario
    const form = this.shadowRoot?.querySelector("form");
    const registerLink = this.shadowRoot?.querySelector("#register-link");

    //! Agrega listeners con funciones ya enlazadas (correcto)
    form?.addEventListener("submit", this.boundHandleSubmit);
    registerLink?.addEventListener("click", this.boundHandleRegisterClick);
  }

  //* Método que se ejecuta cuando el componente se elimina del DOM
  disconnectedCallback() {
    const form = this.shadowRoot?.querySelector("form");
    const registerLink = this.shadowRoot?.querySelector("#register-link");

    //* Elimina correctamente los event listeners usando las funciones binded guardadas
    form?.removeEventListener("submit", this.boundHandleSubmit);
    registerLink?.removeEventListener("click", this.boundHandleRegisterClick);
  }

  //* Maneja el envío del formulario de login
  handleSubmit(e: Event) {
    e.preventDefault(); //* Evita el comportamiento por defecto (recargar página)

    const formData = new FormData(e.target as HTMLFormElement); //* Extrae los datos del formulario
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (username && password) {
      //* Busca el usuario ingresado en la lista simulada
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

      if (user) {
        //& En una app real deberías verificar la contraseña
        login(user); //& Inicia sesión con usuario existente
      } else {
        //& Si el usuario no existe, se crea uno nuevo (modo demo)
        const newUser = {
          ...defaultUser,
          id: `user_${Date.now()}`, //* Genera un ID único con timestamp
          username: username
        };
        login(newUser); //! Inicia sesión con nuevo usuario
      }
    }
  }

  //& Emite un evento personalizado cuando el usuario quiere registrarse
  handleRegisterClick(e: Event) {
    e.preventDefault(); //& Previene comportamiento por defecto
    const registerEvent = new CustomEvent("register"); //& Crea un evento de registro
    this.dispatchEvent(registerEvent); //& Dispara el evento para que lo escuche el padre
  }

  //! Renderiza el HTML del componente dentro del shadow DOM
  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${loginFormStyles}</style> <!-- Aplica estilos -->
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
}


//^ Exporta el componente para usarlo en otros archivos
export default LoginForm;

//^ Este componente personalizado <login-form> permite a un usuario iniciar sesión 
//^ (de forma simulada) en la aplicación Nexus mmientras no utilziamos Firebase y emitir un evento cuando desea registrarse 
//^ Mejora el control de eventos para evitar errores y fugas de memoria.
