export enum CommentAttributes {
  ID = "commentId",
  POST_ID = "postId",
  USER_ID = "userId",
  USERNAME = "username",
  PROFILE_PICTURE = "profilePicture",
  CONTENT = "content",
  LIKES = "likes",
  TIMESTAMP = "timestamp"
}

class CommentCard extends HTMLElement {
  commentId?: string;
  postId?: string;
  userId?: string;
  username?: string;
  profilePicture?: string;
  content?: string;
  likes?: string;
  timestamp?: string;

  static get observedAttributes() {
    return Object.values(CommentAttributes);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      (this as any)[name] = newValue;
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    const likeBtn = this.shadowRoot?.querySelector(".like-btn");
    likeBtn?.addEventListener("click", () => {
      const likesSpan = this.shadowRoot?.querySelector(".likes-count");
      if (likesSpan && this.likes) {
        const currentLikes = parseInt(this.likes);
        const newLikes = currentLikes + 1;
        this.likes = newLikes.toString();
        likesSpan.textContent = newLikes.toString();
        likeBtn.classList.add("active");
      }
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;

    return date.toLocaleDateString();
  }

  render() {
    const styles = `
      :host {
        display: block;
        font-family: 'Inter', sans-serif;
      }

      .comment-card {
        background-color: #282828;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .comment-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .comment-header {
        display: flex;
        align-items: center;
        margin-bottom: 0.8rem;
      }

      .profile-picture {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 0.8rem;
        border: 2px solid #7e57c2;
        transition: transform 0.3s ease;
      }

      .profile-picture:hover {
        transform: scale(1.1);
      }

      .comment-info {
        display: flex;
        flex-direction: column;
      }

      .username {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 600;
        color: #e0e0e0;
      }

      .timestamp {
        font-size: 0.7rem;
        color: #9e9e9e;
      }

      .comment-content {
        margin-bottom: 0.8rem;
      }

      .comment-content p {
        margin: 0;
        font-size: 0.95rem;
        line-height: 1.4;
        color: #e0e0e0;
      }

      .comment-actions {
        display: flex;
        gap: 1rem;
        padding-top: 0.5rem;
        border-top: 1px solid #333;
      }

      .action-btn {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        color: #bdbdbd;
        transition: color 0.3s ease;
        cursor: pointer;
        padding: 0.3rem;
        border-radius: 4px;
        font-size: 0.8rem;
      }

      .action-btn:hover {
        color: #7e57c2;
        background-color: rgba(126, 87, 194, 0.1);
      }

      .action-btn svg {
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        transition: fill 0.3s ease, stroke 0.3s ease;
      }

      .like-btn.active {
        color: #ff5252;
      }

      .like-btn.active svg {
        fill: #ff5252;
        stroke: #ff5252;
      }

      @media (max-width: 768px) {
        .comment-card {
          padding: 0.8rem;
        }

        .profile-picture {
          width: 32px;
          height: 32px;
        }

        .username {
          font-size: 0.85rem;
        }

        .comment-content p {
          font-size: 0.9rem;
        }
      }

      @media (max-width: 480px) {
        .comment-card {
          padding: 0.7rem;
        }

        .action-btn {
          font-size: 0.75rem;
        }
      }
    `;

    this.shadowRoot!.innerHTML = `
      <style>${styles}</style>
      <div class="comment-card">
        <div class="comment-header">
          <img class="profile-picture" src="${this.profilePicture}" alt="${this.username}">
          <div class="comment-info">
            <h4 class="username">${this.username}</h4>
            <span class="timestamp">${this.formatDate(this.timestamp)}</span>
          </div>
        </div>
        <div class="comment-content">
          <p>${this.content}</p>
        </div>
        <div class="comment-actions">
          <div class="action-btn like-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                       2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                       C13.09 3.81 14.76 3 16.5 3
                       19.58 3 22 5.42 22 8.5
                       c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="likes-count">${this.likes}</span>
          </div>
          <div class="action-btn reply-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
            <span>Reply</span>
          </div>
        </div>
      </div>
    `;
  }

  disconnectedCallback() {
    // Cleanup logic here if needed
  }
}

customElements.define("comment-card", CommentCard);
export default CommentCard;
