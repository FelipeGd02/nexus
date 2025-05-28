import { appState } from "../../store";
import "../../components/post/PostCard";
import "../../components/post/CreatePost";

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
    const styles = `
      :host {
        display: block;
        font-family: 'Inter', sans-serif;
      }

      .threads-container {
        min-height: 100vh;
        padding: 90px max(2rem, calc((100% - 800px) / 2)) 2rem;
        background-color: #121212;
        color: #e0e0e0;
      }

      .threads-header {
        margin-bottom: 2rem;
        text-align: center;
      }

      .threads-header h2 {
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: #fff;
      }

      .threads-header p {
        color: #bdbdbd;
        font-size: 1rem;
        max-width: 600px;
        margin: 0 auto;
      }

      .threads-feed {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .no-posts {
        background-color: #1e1e1e;
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .no-posts p {
        color: #bdbdbd;
        font-size: 1.1rem;
        margin: 0;
      }

      @media (max-width: 768px) {
        .threads-container {
          padding: 80px 1rem 2rem;
        }

        .threads-header h2 {
          font-size: 1.8rem;
        }

        .threads-header p {
          font-size: 0.95rem;
        }
      }

      @media (max-width: 480px) {
        .threads-header h2 {
          font-size: 1.6rem;
        }

        .threads-header p {
          font-size: 0.9rem;
        }

        .no-posts {
          padding: 1.5rem;
        }

        .no-posts p {
          font-size: 1rem;
        }
      }
    `;

    this.shadowRoot!.innerHTML = `
      <style>${styles}</style>
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

  disconnectedCallback() {
    // Cleanup if needed
  }
}

export default ThreadsScreen;
