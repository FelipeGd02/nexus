import { appState } from "../../Flux/store"; //^ Importa el estado global de la app
import { navigate , createPost } from "../../Flux/action"; //^ Importa funciones para navegar y crear publicaciones
import { Screens } from "../../types/navigation"; //^ Importa las constantes que representan las distintas pantallas
import createPostStyles from "./CreatePost.css"; //^ Importa los estilos CSS específicos de este componente

class CreatePost extends HTMLElement {
  private boundHandleSubmit = this.handleSubmit.bind(this); //! Guarda la referencia del método ligado para usarla en add/removeEventListener

  constructor() {
    super();
    this.attachShadow({ mode: "open" }); //! Crea un Shadow DOM para encapsular el HTML y los estilos
  }

  connectedCallback() {
    this.render(); //* Renderiza el contenido del componente

    const form = this.shadowRoot?.querySelector("form"); //* Selecciona el formulario del Shadow DOM
    const loginLink = this.shadowRoot?.querySelector("#login-link"); //* Selecciona el enlace de login si el usuario no está autenticado

    //* Asigna el evento de envío del formulario a handleSubmit usando la referencia ligada
    form?.addEventListener("submit", this.boundHandleSubmit);

    //! Si el usuario no ha iniciado sesión, permite que el enlace lo lleve a la pantalla de login
    loginLink?.addEventListener("click", () => navigate(Screens.LOGIN));
  }

  async handleSubmit(e: Event) {
    e.preventDefault(); //* Previene la recarga de página al enviar el formulario

    const state = appState.get(); //* Obtiene el estado global actual
    if (!state.currentUser) return; //* Si no hay usuario autenticado, no permite publicar

    const formData = new FormData(e.target as HTMLFormElement); //& Extrae los datos del formulario
    const content = formData.get("content") as string; //& Obtiene el contenido del post
    const imageUrl = formData.get("imageUrl") as string; //& Obtiene la URL de imagen, si existe

    //! Si el contenido no está vacío, crea una nueva publicación
    if (content.trim()) {
      createPost(content.trim(), imageUrl.trim() || undefined); //! Llama a la función para crear el post
      (e.target as HTMLFormElement).reset(); //! Limpia el formulario después de publicar
    }
  }

  render() {
    const state = appState.get(); //* Obtiene el estado actual (para saber si el usuario está autenticado)

    if (this.shadowRoot) {
      //* Renderiza dos interfaces distintas dependiendo si el usuario está autenticado o no
      this.shadowRoot.innerHTML = `
        <style>${createPostStyles}</style>
        ${
          state.isAuthenticated ? `
            <!-- Si el usuario ha iniciado sesión, muestra el formulario de creación de post -->
            <div class="create-post">
              <div class="create-post-header">
                <img src="${state.currentUser?.profilePicture}" alt="${state.currentUser?.username}" class="user-avatar">
              </div>
              <form class="post-form">
                <div class="input-group">
                  <textarea name="content" placeholder="What's on your mind?" required></textarea>
                </div>
                <div class="input-group">
                  <input type="url" name="imageUrl" placeholder="Image URL (optional)">
                </div>
                <div class="post-actions">
                  <button type="reset" class="post-button secondary">Clear</button>
                  <button type="submit" class="post-button primary">Post</button>
                </div>
              </form>
            </div>
          ` : `
            <!-- Si el usuario no ha iniciado sesión, muestra un mensaje para iniciar sesión -->
            <div class="create-post">
              <div class="login-prompt">
                <p>Please <a id="login-link">log in</a> to create a post</p>
              </div>
            </div>
          `
        }
      `;
    }
  }

  disconnectedCallback() {
    //! Limpia el event listener cuando el componente se elimina del DOM
    const form = this.shadowRoot?.querySelector("form"); //* Selecciona el elemento <form> dentro del Shadow DOM del componente
    form?.removeEventListener("submit", this.boundHandleSubmit); //* Elimina correctamente el listener usando la misma referencia
  }
}

export default CreatePost; //! Exporta el componente para que pueda usarse en otros módulos
