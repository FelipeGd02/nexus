import { appState } from "../../Flux/store"; // Estado global de la app
import { navigate , createPost } from "../../Flux/action"; // Funciones para cambiar pantalla y crear un post nuevo
import { Screens } from "../../types/navigation"; // Pantallas definidas en la app
import createPostStyles from "./CreatePost.css"; // Estilos CSS para este componente

class CreatePost extends HTMLElement {
  constructor() {
    super();
    // Creamos un Shadow DOM para que el componente tenga su propio espacio sin interferir con otros estilos
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render(); // Dibuja el formulario o mensaje según si el usuario está logueado

    // Buscamos el formulario y el enlace para login dentro del Shadow DOM
    const form = this.shadowRoot?.querySelector("form");
    const loginLink = this.shadowRoot?.querySelector("#login-link");
    
    // Cuando envíen el formulario, ejecuta handleSubmit
    form?.addEventListener("submit", this.handleSubmit.bind(this));
    // Si el usuario no está logueado y hace click en "log in", lo mandamos a la pantalla de login
    loginLink?.addEventListener("click", () => navigate(Screens.LOGIN));
  }

  // Esta función se activa cuando envían el formulario para crear un post
  async handleSubmit(e: Event) {
    e.preventDefault(); // Evita que la página recargue al enviar el formulario
    
    const state = appState.get(); // Sacamos el usuario actual del estado global
    if (!state.currentUser) return; // Si no hay usuario logueado, no hacemos nada
    
    const formData = new FormData(e.target as HTMLFormElement);
    const content = formData.get("content") as string; // Contenido del post
    const imageUrl = formData.get("imageUrl") as string; // URL de la imagen (opcional)
    
    if (content.trim()) { // Solo creamos el post si hay texto
      createPost(content.trim(), imageUrl.trim() || undefined); // Creamos el post, si no hay imagen enviamos undefined
      (e.target as HTMLFormElement).reset(); // Limpiamos el formulario para que quede vacío
    }
  }

  // Dibuja el formulario para crear posts o el mensaje para iniciar sesión si no están logueados
  render() {
    const state = appState.get(); // Estado actual para saber si el usuario está autenticado
    
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${createPostStyles}</style>
        ${state.isAuthenticated ? `
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
          <div class="create-post">
            <div class="login-prompt">
              <p>Please <a id="login-link">log in</a> to create a post</p>
            </div>
          </div>
        `}
      `;
    }
  }

  disconnectedCallback() {
    // Cuando el componente desaparece, quitamos el evento para evitar problemas
    const form = this.shadowRoot?.querySelector("form");
    form?.removeEventListener("submit", this.handleSubmit.bind(this));
  }
}

export default CreatePost;
