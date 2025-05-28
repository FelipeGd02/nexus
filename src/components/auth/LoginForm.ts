import { login } from "../../store/action"; //^ Importa la función de login para actualizar el estado global
import { users, defaultUser } from "../../data/Users"; //^ Importa una lista de usuarios ficticios y un usuario por defecto
import loginFormStyles from "./LoginForm.css"; //^ Importa los estilos CSS del componente


class LoginForm extends HTMLElement { //& Define un nuevo Web Component llamado <login-form>
  constructor() {
    super(); //& Llama al constructor de HTMLElement
    this.attachShadow({ mode: "open" }); //& Activa el Shadow DOM para encapsular HTML/CSS
  }

  connectedCallback() { //! Se ejecuta cuando el componente se inserta en el DOM
    this.render(); //! Llama al método render para pintar la interfaz

    //! Añade event listeners a los elementos del formulario
    const form = this.shadowRoot?.querySelector("form"); //~ Selecciona el formulario
    const registerLink = this.shadowRoot?.querySelector("#register-link"); //~ Enlace de registro

    form?.addEventListener("submit", this.handleSubmit.bind(this)); //~ Maneja el envío del formulario
    registerLink?.addEventListener("click", this.handleRegisterClick.bind(this)); //~ Maneja clic en “Register now”
  }

  handleSubmit(e: Event) { //~ Maneja el envío del formulario de login
    e.preventDefault(); //~ Previene el comportamiento por defecto (recarga de página)

    const formData = new FormData(e.target as HTMLFormElement); //! Obtiene los datos del formulario
    const username = formData.get("username") as string; //! Obtiene el valor del campo "username"
    const password = formData.get("password") as string; //! Obtiene el valor del campo "password"

    if (username && password) { //! Verifica que ambos campos estén diligenciados
      //! Simula una autenticación sencilla (mock)
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase()); //! Busca el usuario por nombre

      if (user) {
        login(user); //! Si existe, realiza el login (sin validar password en esta demo)
      } else {
        //! Si no existe, crea un nuevo usuario con datos por defecto
        const newUser = {
          ...defaultUser, //& Copia las propiedades del usuario por defecto
          id: `user_${Date.now()}`, //& Genera un ID único basado en timestamp
          username: username //& Usa el nombre que ingresó el usuario
        };
        login(newUser); //& Hace login con el nuevo usuario creado
      }
    }
  }

  handleRegisterClick(e: Event) { //~ Maneja clic en el enlace de “Register now”
    e.preventDefault(); //~ Previene que el enlace navegue
    const registerEvent = new CustomEvent("register"); //~ Crea un evento personalizado llamado "register"
    this.dispatchEvent(registerEvent); //~ Emite el evento para que el padre (otro componente) lo maneje
  }

  render() { //! Dibuja el contenido HTML del componente
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = ` // Inserta el HTML en el shadow DOM
        <style>${loginFormStyles}</style> <!-- Aplica los estilos CSS importados -->
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

  disconnectedCallback() { //! Se ejecuta cuando el componente es removido del DOM
    //! Limpieza de event listeners
    const form = this.shadowRoot?.querySelector("form");
    const registerLink = this.shadowRoot?.querySelector("#register-link");

    //~ ¡IMPORTANTE! Este código no remueve los event listeners correctamente
    //~ porque bind crea una nueva referencia. Habría que almacenar las funciones como propiedades si se quiere limpiar bien.
    form?.removeEventListener("submit", this.handleSubmit.bind(this));
    registerLink?.removeEventListener("click", this.handleRegisterClick.bind(this));
  }
}


export default LoginForm; //^ Exporta el componente para que pueda ser usado en otros archivos
