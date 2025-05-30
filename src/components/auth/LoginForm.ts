import { login } from "../../Flux/action"; //^ Importa la función 'login' desde el sistema de manejo de estados Flux
import { defaultUser, users } from "../../data/Users"; //^ Importa los datos de usuarios (mock) y un usuario por defecto
import loginFormStyles from "./LoginForm.css"; //^ Importa los estilos CSS para este componente

class LoginForm extends HTMLElement { //! Define una nueva clase que extiende de HTMLElement (componente personalizado)
  constructor() {
    super();
    this.attachShadow({ mode: "open" }); //! Crea un Shadow DOM aislado para encapsular estilos y estructura
  }

  connectedCallback() {
    this.render(); //! Llama al método que renderiza el contenido HTML del componente

    //& Agrega los event listeners al formulario y al enlace de registro
    const form = this.shadowRoot?.querySelector("form"); //& Selecciona el formulario dentro del shadow DOM
    const registerLink = this.shadowRoot?.querySelector("#register-link"); //& Selecciona el link de registro

    form?.addEventListener("submit", this.handleSubmit.bind(this)); //! Asocia el evento de envío del formulario al método handleSubmit
    registerLink?.addEventListener("click", this.handleRegisterClick.bind(this)); //! Asocia el clic en el link de registro al método handleRegisterClick
  }

  handleSubmit(e: Event) {
    e.preventDefault(); //* Previene el comportamiento por defecto del formulario (recarga la página)

    const formData = new FormData(e.target as HTMLFormElement); //* Obtiene los datos del formulario
    const username = formData.get("username") as string; //* Extrae el nombre de usuario
    const password = formData.get("password") as string; //* Extrae la contraseña

    if (username && password) { //* Verifica que ambos campos tengan valor
      //* Autenticación simulada (mock)
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase()); //* Busca si el usuario existe en la lista mock

      if (user) {
        //! En una app real aquí se validaría también la contraseña
        login(user); //! Inicia sesión con el usuario existente
      } else {
        //! Si el usuario no existe, crea uno nuevo con un ID generado
        const newUser = {
          ...defaultUser, //& Usa el template del usuario por defecto
          id: `user_${Date.now()}`, //& Genera un ID único basado en la hora actual
          username: username //& Asigna el nombre de usuario proporcionado
        };
        login(newUser); //& Inicia sesión con el nuevo usuario
      }
    }
  }

  handleRegisterClick(e: Event) {
    e.preventDefault(); //! Previene el comportamiento por defecto del enlace
    const registerEvent = new CustomEvent("register"); //! Crea un nuevo evento personalizado llamado 'register'
    this.dispatchEvent(registerEvent); //! Despacha el evento para que pueda ser escuchado desde fuera del componente
  }

  render() {
    if (this.shadowRoot) {
      //^ Define el HTML y los estilos del formulario de Login que se ponen en el css
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
    //! Limpia los event listeners cuando el componente se elimina del DOM
    const form = this.shadowRoot?.querySelector("form");
    const registerLink = this.shadowRoot?.querySelector("#register-link");

    form?.removeEventListener("submit", this.handleSubmit.bind(this));
    registerLink?.removeEventListener("click", this.handleRegisterClick.bind(this));
  }
}


export default LoginForm; //^ Exporta el componente para que pueda ser usado en otros archivos
