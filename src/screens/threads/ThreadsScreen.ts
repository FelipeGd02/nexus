import { appState, AppState } from "../../store";
import "../../components/post/post-card";
import "../../components/post/create-post";
import threadsStyles from "./threads-screen.css";

class ThreadsScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  renderPosts() {
    const state = appState.get();
    const posts = state.filteredPosts;
    
    if (posts.length === 0) {
      return `
        <div class="no-posts">
          <p>No posts found. Be the first to create a post!</p>
        </div>
      `;
    }
    
    return posts.map(post => `
      <post-card
        postid="${post.id}"
        userid="${post.userId}"
        username="${post.username}"
        pfp="${post.profilePicture}"
        content="${post.content}"
        ${post.imageUrl ? `imageurl="${post.imageUrl}"` : ''}
        likes="${post.likes}"
        reposts="${post.reposts}"
        comments="${post.comments}"
        saves="${post.saves}"
        timestamp="${post.timestamp}"
        ${post.gameId ? `gameid="${post.gameId}"` : ''}
        isliked="${post.isLiked || false}"
        issaved="${post.isSaved || false}">
      </post-card>
    `).join("");
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${threadsStyles}</style>
        <div class="threads-container">
          <div class="threads-header">
            <h2>Latest Threads</h2>
            <p>Join the conversation and share your gaming experiences.</p>
          </div>
          
          <create-post></create-post>
          
          <div class="threads-feed">
            ${this.renderPosts()}
          </div>
        </div>
      `;
    }
  }

  disconnectedCallback() {
    // Cleanup event listeners if needed
  }
}

export default ThreadsScreen;