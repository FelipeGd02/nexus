import { appState } from "../../Flux/store";
import { navigate , createPost } from "../../Flux/action";
import { Screens } from "../../types/navigation";
import createPostStyles from "./CreatePost.css";

class CreatePost extends HTMLElement {
  private boundHandleSubmit = this.handleSubmit.bind(this); //! Guarda la referencia del método ligado para usarla en add/removeEventListener

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    
    const form = this.shadowRoot?.querySelector("form");
    const loginLink = this.shadowRoot?.querySelector("#login-link");
    
    form?.addEventListener("submit", this.handleSubmit.bind(this));
    loginLink?.addEventListener("click", () => navigate(Screens.LOGIN));
  }

  // Esta función se activa cuando envían el formulario para crear un post
  async handleSubmit(e: Event) {
    e.preventDefault();
    
    const state = appState.get();
    if (!state.currentUser) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const content = formData.get("content") as string;
    const imageUrl = formData.get("imageUrl") as string;
    
    if (content.trim()) {
      createPost(content.trim(), imageUrl.trim() || undefined);
      (e.target as HTMLFormElement).reset();
    }
  }

  // Dibuja el formulario para crear posts o el mensaje para iniciar sesión si no están logueados
  render() {
    const state = appState.get();
    
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
    const form = this.shadowRoot?.querySelector("form");
    form?.removeEventListener("submit", this.handleSubmit.bind(this));
  }
}

export default CreatePost;