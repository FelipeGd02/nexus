import commentCardStyles from "./CommentCard.css";

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
  // Properties
  commentId?: string;
  postId?: string;
  userId?: string;
  username?: string;
  profilePicture?: string;
  content?: string;
  likes?: string;
  timestamp?: string;

  // Observed attributes
  static get observedAttributes() {
    return Object.values(CommentAttributes);
  }

  // Handle attribute changes
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
    
    // Event listeners
    const likeBtn = this.shadowRoot?.querySelector(".like-btn");
    
    likeBtn?.addEventListener("click", () => {
      // In a real app, we would update the like count in the store
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
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${commentCardStyles}</style>
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
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
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
  }

  disconnectedCallback() {
    // Cleanup event listeners if needed
  }
}

customElements.define("comment-card", CommentCard);
export default CommentCard;