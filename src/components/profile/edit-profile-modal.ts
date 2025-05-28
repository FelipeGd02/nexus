import { appState } from "../../store";
import { updateProfile } from "../../store/action";
import { firebaseService } from "../../services/firebase";

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
      profilePicture,
    };

    try {
      await firebaseService.updateProfile(state.currentUser.id, updatedProfile);
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

    const styles = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(18, 15, 38, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal {
        background-color: var(--color-darker);
        border-radius: 10px;
        padding: 2rem;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        position: relative;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .modal-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--color-white);
        margin: 0;
      }

      .close-button {
        background: none;
        border: none;
        color: var(--color-white);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        transition: color 0.3s ease;
      }

      .close-button:hover {
        color: var(--color-primary);
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--color-white);
        font-size: 0.9rem;
        font-weight: 500;
      }

      input, textarea {
        width: 100%;
        padding: 0.8rem 1rem;
        border: 2px solid var(--color-secondary);
        background-color: var(--color-dark);
        color: var(--color-white);
        border-radius: 6px;
        font-size: 1rem;
        font-family: inherit;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }

      textarea {
        min-height: 100px;
        resize: vertical;
      }

      input:focus, textarea:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(191, 52, 103, 0.2);
      }

      .save-button {
        width: 100%;
        padding: 1rem;
        background-color: var(--color-primary);
        color: var(--color-white);
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        margin-top: 1rem;
      }

      .save-button:hover {
        background-color: #a62d57;
        transform: translateY(-2px);
      }

      .save-button:active {
        transform: translateY(0);
      }

      @media (max-width: 480px) {
        .modal {
          padding: 1.5rem;
        }

        .modal-title {
          font-size: 1.3rem;
        }

        input, textarea {
          padding: 0.7rem 0.9rem;
          font-size: 0.95rem;
        }

        .save-button {
          padding: 0.8rem;
        }
      }
    `;

    this.shadowRoot!.innerHTML = `
      <style>${styles}</style>
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

  disconnectedCallback() {
    const form = this.shadowRoot?.querySelector("form");
    const closeButton = this.shadowRoot?.querySelector(".close-button");

    form?.removeEventListener("submit", this.handleSubmit.bind(this));
    closeButton?.removeEventListener("click", this.handleClose.bind(this));
  }
}

export default EditProfileModal;
