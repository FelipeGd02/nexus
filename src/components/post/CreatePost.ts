import { appState } from "../../Flux/store"; //^ Importa el estado global de la app
import { navigate } from "../../Flux/action"; //^ Importa funciones para navegar y crear publicaciones
import { Screens } from "../../types/navigation"; //^ Importa las constantes que representan las distintas pantallas
import createPostStyles from "./CreatePost.css"; //^ Importa los estilos CSS específicos de este componente
import { uploadPost, uploadPostPicture } from "../../services/supabase";
import { games } from "../../data/Games";

class CreatePost extends HTMLElement {
  private boundHandleSubmit = this.handleSubmit.bind(this); //! Guarda la referencia del método ligado para usarla en add/removeEventListener

  constructor() {
    super();
    this.attachShadow({ mode: "open" }); //! Crea un Shadow DOM para encapsular el HTML y los estilos
  }

  uploadedImageUrl: string | null = null;
  selectedGameId: string | null = null;

  connectedCallback() {
    this.render();

    const form = this.shadowRoot?.querySelector("form");
    const loginLink = this.shadowRoot?.querySelector("#login-link");
    const fileInput =
      this.shadowRoot?.querySelector<HTMLInputElement>("#profilePicture");

    form?.addEventListener("submit", this.boundHandleSubmit);
    loginLink?.addEventListener("click", () => navigate(Screens.LOGIN));

    fileInput?.addEventListener("change", this.handleFileChange.bind(this));

    const input = this.shadowRoot?.getElementById(
      "game-input"
    ) as HTMLInputElement;
    const suggestions = this.shadowRoot?.getElementById("game-suggestions");

    console.log(input, suggestions); //! Muestra los elementos de entrada y sugerencias en la consola

    input?.addEventListener("input", () => {
      const query = input.value.toLowerCase().trim();

      console.log("Search query:", query); //! Muestra la consulta de búsqueda en la consola

      if (!query || !suggestions) return;

      suggestions.innerHTML = "";

      const matches = games
        .filter((game) => game.title.toLowerCase().includes(query))
        .slice(0, 3); // max 3 items

      matches.forEach((game) => {
        const li = document.createElement("li");
        li.textContent = game.title;
        li.dataset.id = game.id;
        li.classList.add("suggestion-item");
        suggestions.appendChild(li);
      });
    });

    if (suggestions) {
      suggestions?.addEventListener("click", (e) => {
        const target = e.target as HTMLLIElement;
        if (target.classList.contains("suggestion-item")) {
          this.selectedGameId = target.dataset.id || null;
          input.value = target.textContent || "";
          suggestions.innerHTML = "";
        }
      });
    }
  }

  async handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    try {
      const url = await uploadPostPicture(file);
      this.uploadedImageUrl = url;
      console.log("Uploaded to:", url);
      this.renderImage();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image.");
    }
  }

  renderImage() {
    const imagePreview = this.shadowRoot?.querySelector(
      ".image"
    ) as HTMLDivElement;
    if (imagePreview) {
      imagePreview.style.backgroundImage = `linear-gradient(to top, rgba(191, 52, 103, 0.05), rgba(191, 52, 103, 0.05)), url(${this.uploadedImageUrl})`;
    }
  }

  handleGameChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.selectedGameId = target.value;
  }

  async handleSubmit(e: Event) {
    e.preventDefault(); //* Previene la recarga de página al enviar el formulario

    const state = appState.get(); //* Obtiene el estado global actual
    if (!state.currentUser) return; //* Si no hay usuario autenticado, no permite publicar

    const formData = new FormData(e.target as HTMLFormElement); //& Extrae los datos del formulario
    const content = formData.get("content") as string; //& Obtiene el contenido del post

    if (content.trim()) {
      try {
        await uploadPost({
          content: content,
          url: this.uploadedImageUrl || undefined,
          gameId: this.selectedGameId || undefined,
        });
      } catch (error) {
        console.error("Error creating post:", error);
        alert("Failed to create post. Please try again.");
      }
    }
  }

  render() {
    const state = appState.get(); //* Obtiene el estado actual (para saber si el usuario está autenticado)

    if (this.shadowRoot) {
      //* Renderiza dos interfaces distintas dependiendo si el usuario está autenticado o no
      this.shadowRoot.innerHTML = `
        <style>${createPostStyles}</style>
        ${
          state.isAuthenticated
            ? `
            <!-- Si el usuario ha iniciado sesión, muestra el formulario de creación de post -->
            <div class="create-post">
              <div class="create-post-header">
                <img src="${state.currentUser?.profilePicture}" alt="${state.currentUser?.username}" class="user-avatar">
              </div>
              <form class="post-form">
                <div class="input-group">
                  <textarea name="content" placeholder="What's on your mind?" required></textarea>
                </div>
                <div class="optional-wrapper">
                
                <div class="input-group image">
                  <label class="custom-file-upload" for="profilePicture">
                  <input type="file"  id="profilePicture" name="profilePicture" accept="image/*">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                  </label>
                </div>

                <div class="input-group game">
                    <input type="text" id="game-input" name="game-input" placeholder="Search a game..." autocomplete="off" />
                    <ul id="game-suggestions" class="suggestions-list"></ul>
                </div>
                </div>
                
                <div class="post-actions">
                  <button type="reset" class="post-button secondary">Clear</button>
                  <button type="submit" class="post-button primary">Post</button>
                </div>
              </form>
            </div>
          `
            : `
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
