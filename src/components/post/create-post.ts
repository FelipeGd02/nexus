import { appState } from "../../store";
import { navigate } from "../../store/action";
import { Screens } from "../../types/navigation";
import { firebaseService } from "../../services/firebase";

class CreatePost extends HTMLElement {
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

  async handleSubmit(e: Event) {
    e.preventDefault();

    const state = appState.get();
    if (!state.currentUser) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const content = formData.get("content") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (content.trim()) {
      const newPost = {
        id: `p${Date.now()}`,
        userId: state.currentUser.id,
        username: state.currentUser.username,
        profilePicture: state.currentUser.profilePicture,
        content: content.trim(),
        imageUrl: imageUrl.trim() || undefined,
        likes: 0,
        reposts: 0,
        comments: 0,
        saves: 0,
        timestamp: new Date().toISOString()
      };

      try {
        await firebaseService.createPost(newPost);
        (e.target as HTMLFormElement).reset();
      } catch (error) {
        console.error("Failed to create post:", error);
        alert("Failed to create post. Please try again.");
      }
    }
  }

  render() {
    const state = appState.get();

    const styles = `
      :host {
        display: block;
        font-family: 'Inter', sans-serif;
      }
      .create-post {
        background-color: var(--color-darker);
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      .create-post-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--color-primary);
      }
      .post-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .input-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      textarea {
        width: 100%;
        min-height: 100px;
        padding: 1rem;
        background-color: var(--color-dark);
        border: 1px solid var(--color-secondary);
        border-radius: 8px;
        color: var(--color-text-primary);
        font-size: 0.95rem;
        font-family: inherit;
        resize: vertical;
        transition: border-color 0.3s ease;
      }
      textarea:focus {
        outline: none;
        border-color: var(--color-primary);
      }
      input {
        width: 100%;
        padding: 0.8rem 1rem;
        background-color: var(--color-dark);
        border: 1px solid var(--color-secondary);
        border-radius: 8px;
        color: var(--color-text-primary);
        font-size: 0.95rem;
      }
      input:focus {
        outline: none;
        border-color: var(--color-primary);
      }
      .post-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
      }
      .post-button {
        padding: 0.8rem 1.5rem;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 6px;
      }
      .post-button.primary {
        background-color: var(--color-primary);
        color: var(--color-white);
        border: none;
      }
      .post-button.primary:hover {
        opacity: 0.9;
        transform: translateY(-2px);
      }
      .post-button.secondary {
        background-color: transparent;
        color: var(--color-text-secondary);
        border: 1px solid var(--color-secondary);
      }
      .post-button.secondary:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      .login-prompt {
        text-align: center;
        padding: 2rem;
        color: var(--color-text-secondary);
      }
      .login-prompt a {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 600;
        cursor: pointer;
      }
      .login-prompt a:hover {
        text-decoration: underline;
      }
    `;

    this.shadowRoot!.innerHTML = `
      <style>${styles}</style>
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

  disconnectedCallback() {
    const form = this.shadowRoot?.querySelector("form");
    form?.removeEventListener("submit", this.handleSubmit.bind(this));
  }
}

customElements.define("create-post", CreatePost);
export default CreatePost;
