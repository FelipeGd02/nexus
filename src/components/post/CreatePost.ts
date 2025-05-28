import { appState } from "../../store";
import { navigate } from "../../store/actions";
import { Screens } from "../../types/navigation";
import { firebaseService } from "../../services/firebase";
import createPostStyles from "./CreatePost.css";

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
    const form = this.shadowRoot?.querySelector("form");
    form?.removeEventListener("submit", this.handleSubmit.bind(this));
  }
}

export default CreatePost;