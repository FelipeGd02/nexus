import { appState } from "../../Flux/store";
import editProfileModalStyles from "./EditProfileModal.css";
import { User } from "../../types/models";
import {
  updateProfileInDatabase,
  uploadProfilePicture,
} from "../../services/supabase"; // `uploadProfilePicture` must return a public URL

class EditProfileModal extends HTMLElement {
  uploadedProfilePictureUrl: string | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    const form = this.shadowRoot?.querySelector("form");
    const closeButton = this.shadowRoot?.querySelector(".close-button");
    const overlay = this.shadowRoot?.querySelector(".modal-overlay");
    const fileInput =
      this.shadowRoot?.querySelector<HTMLInputElement>("#profilePicture");

    form?.addEventListener("submit", this.handleSubmit.bind(this));
    closeButton?.addEventListener("click", this.handleClose.bind(this));
    overlay?.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.handleClose();
      }
    });

    fileInput?.addEventListener("change", this.handleFileChange.bind(this));
  }

  async handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    try {
      const url = await uploadProfilePicture(file);
      this.uploadedProfilePictureUrl = url;
      console.log("Uploaded to:", url);
      this.renderImage();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image.");
    }
  }

  renderImage() {
    const imagePreview = this.shadowRoot?.querySelector(".image-preview");
    if (imagePreview) {
      imagePreview.innerHTML = "";
      const img = document.createElement("img");
      img.src = this.uploadedProfilePictureUrl || "";
      img.alt = "Profile Picture Preview";
      img.className = "profile-picture-preview";
      imagePreview.appendChild(img);
    }
  }

  async handleSubmit(e: Event) {
    e.preventDefault();
    const state = appState.get();
    if (!state.currentUser) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const bio = formData.get("bio") as string;

    const updatedProfile: User = {
      ...state.currentUser,
      username,
      bio,
      profilePicture:
        this.uploadedProfilePictureUrl || state.currentUser.profilePicture,
    };

    console.log("Updating profile with:", updatedProfile);

    try {
      await updateProfileInDatabase(state.currentUser.id, updatedProfile);
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
                <input type="text" id="username" name="username" value="${
                  user?.username || ""
                }" required>
              </div>
              <div class="form-group">
                <label for="bio">Bio</label>
                <textarea id="bio" name="bio">${user?.bio || ""}</textarea>
              </div>
              <div class="form-group">
                <label class="custom-file-upload" for="profilePicture">Profile Picture
                <input type="file" id="profilePicture" name="profilePicture" accept="image/*">
                </label>
                <small>Leave empty to keep current picture.</small>
                <div class="image-preview"></div>
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
    const fileInput = this.shadowRoot?.querySelector("#profilePicture");

    form?.removeEventListener("submit", this.handleSubmit.bind(this));
    closeButton?.removeEventListener("click", this.handleClose.bind(this));
    fileInput?.removeEventListener("change", this.handleFileChange.bind(this));
  }
}

export default EditProfileModal;
