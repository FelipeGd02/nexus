import { appState } from "../../store";
import { updateProfile } from "../../store/actions";
import { firebaseService } from "../../services/firebase";
import editProfileModalStyles from "./EditProfileModal.css";

class EditProfileModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    
    const form = this.shadowRoot?.querySelector("form");
    const closeButton = this.shadowRoot?.querySelector(".close-button");
    const overlay = this.shadowRoot?.querySelector(".modal-overlay");
    
    form?.addEventListener("submit", this.handleSubmit.bind(this));
    closeButton?.addEventListener("click", this.handleClose.bind(this));
    overlay?.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.handleClose();
      }
    });
  }

  async handleSubmit(e: Event) {
    e.preventDefault();
    
    const state = appState.get();
    if (!state.currentUser) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const bio = formData.get("bio") as string;
    const profilePicture = formData.get("profilePicture") as string;
    
    const updatedProfile = {
      ...state.currentUser,
      username,
      bio,
      profilePicture
    };
    
    try {
      // Call Firebase service (mock for now)
      await firebaseService.updateProfile(state.currentUser.id, updatedProfile);
      
      // Update local state
      updateProfile(updatedProfile);
      
      this.handleClose();
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Failed to update profile. Please try again.");
    }
  }

  handleClose() {
    const closeEvent = new CustomEvent("close");
    this.dispatchEvent(closeEvent);
  }

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
    const form = this.shadowRoot?.querySelector("form");
    const closeButton = this.shadowRoot?.querySelector(".close-button");
    
    form?.removeEventListener("submit", this.handleSubmit.bind(this));
    closeButton?.removeEventListener("click", this.handleClose.bind(this));
  }
}

export default EditProfileModal;