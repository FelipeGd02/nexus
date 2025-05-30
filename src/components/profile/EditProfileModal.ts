import { appState } from "../../Flux/store"; // Estado global de la app
import { updateProfile } from "../../Flux/action"; // Acción para actualizar el perfil del usuario
import { firebaseService } from "../../services/firebase"; // Servicio para interactuar con Firebase
import editProfileModalStyles from "./EditProfileModal.css"; 

class EditProfileModal extends HTMLElement {
  constructor() {
    super();
    // Creamos un Shadow DOM para aislar este componente y sus estilos
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render(); // Dibuja el modal con los datos actuales

    // Buscamos el formulario, el botón de cerrar y el fondo para agregar eventos
    const form = this.shadowRoot?.querySelector("form");
    const closeButton = this.shadowRoot?.querySelector(".close-button");
    const overlay = this.shadowRoot?.querySelector(".modal-overlay");

    // Cuando envían el formulario, llamamos a handleSubmit
    form?.addEventListener("submit", this.handleSubmit.bind(this));
    // Cuando clickean el botón de cerrar, cerramos el modal
    closeButton?.addEventListener("click", this.handleClose.bind(this));
    // Si hacen clic en el fondo oscuro (overlay), también cerramos el modal
    overlay?.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.handleClose();
      }
    });
  }

  // Función que se ejecuta cuando el usuario envía el formulario para guardar cambios
  async handleSubmit(e: Event) {
    e.preventDefault(); // Evita que la página se recargue

    const state = appState.get();
    if (!state.currentUser) return; // Si no hay usuario logueado, no hacemos nada

    // Obtenemos los datos del formulario
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const bio = formData.get("bio") as string;
    const profilePicture = formData.get("profilePicture") as string;

    // Creamos el objeto con el perfil actualizado
    const updatedProfile = {
      ...state.currentUser,
      username,
      bio,
      profilePicture
    };

    try {
      // Llamamos al servicio para actualizar el perfil en Firebase (simulado)
      await firebaseService.updateProfile(state.currentUser.id, updatedProfile);

      // Actualizamos el estado local con los nuevos datos
      updateProfile(updatedProfile);

      // Cerramos el modal luego de guardar
      this.handleClose();
    } catch (error) {
      // Si hay error, lo mostramos en consola y alertamos al usuario
      console.error("Profile update error:", error);
      alert("Failed to update profile. Please try again.");
    }
  }

  // Función para cerrar el modal y avisar al componente padre
  handleClose() {
    const closeEvent = new CustomEvent("close");
    this.dispatchEvent(closeEvent);
  }

  // Dibuja el modal con el formulario y los datos actuales del usuario
  render() {
    const state = appState.get();
    const user = state.currentUser;

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${editProfileModalStyles}</style>
        <div class="modal-overlay">
          <div class="modal">
            <div class="modal-header">
              <h2 class="modal-title">Edit Profile</h2>
              <button class="close-button">&times;</button>
            </div>
            <form>
              <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" value="${user?.username || ''}" required>
              </div>
              <div class="form-group">
                <label for="bio">Bio</label>
                <textarea id="bio" name="bio">${user?.bio || ''}</textarea>
              </div>
              <div class="form-group">
                <label for="profilePicture">Profile Picture URL</label>
                <input type="url" id="profilePicture" name="profilePicture" value="${user?.profilePicture || ''}" required>
              </div>
              <button type="submit" class="save-button">Save Changes</button>
            </form>
          </div>
        </div>
      `;
    }
  }

  disconnectedCallback() {
    // Cuando el modal desaparece, eliminamos los eventos para evitar problemas
    const form = this.shadowRoot?.querySelector("form");
    const closeButton = this.shadowRoot?.querySelector(".close-button");

    form?.removeEventListener("submit", this.handleSubmit.bind(this));
    closeButton?.removeEventListener("click", this.handleClose.bind(this));
  }
}

export default EditProfileModal;
