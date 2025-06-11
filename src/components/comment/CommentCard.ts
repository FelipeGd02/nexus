import { appState } from "../../Flux/store";

import commentCardStyles from "./CommentCard.css";
import { likeComment } from "../../services/supabase";

export enum CommentAttributes {
  ID = "commentid",
  POST_ID = "postid",
  USER_ID = "userid",
  USERNAME = "username",
  PROFILE_PICTURE = "pfp",
  CONTENT = "content",
  LIKES = "likes",
  TIMESTAMP = "timestamp",
}

class CommentCard extends HTMLElement {
  commentid?: string;
  postid?: string;
  userid?: string;
  username?: string;
  pfp?: string;
  content?: string;
  likes?: string;
  timestamp?: string;

  static get observedAttributes() {
    return Object.values(CommentAttributes);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      (this as Record<CommentAttributes, string | undefined>)[
        name as CommentAttributes
      ] = newValue;
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    const likeBtn = this.shadowRoot?.querySelector(".like-btn");

    const state = appState.get();

    likeBtn?.addEventListener("click", () => {
      if (this.commentid && state.isAuthenticated && state.currentUser) {
        likeComment(this.commentid, state.currentUser.id);
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
      const state = appState.get();
      const comment = state.comments.find((c) => c.id === this.commentid);
      const isLiked = comment?.isLiked || false;

      this.shadowRoot.innerHTML = `
        <style>${commentCardStyles}</style> <!-- Aplica los estilos CSS -->
        <div class="comment-card">
          <div class="comment-header">
            <img class="profile-picture" src="${this.pfp}" alt="${
        this.username
      }">
            <div class="comment-info">
              <h4 class="username">${this.username}</h4>
              <span class="timestamp">${this.formatDate(this.timestamp)}</span>
            </div>
          </div>
          <div class="comment-content">
            <p>${this.content}</p>
          </div>
          <div class="comment-actions">
            <div class="action-btn like-btn ${isLiked ? "active" : ""}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span class="likes-count">${
                this.likes
              }</span> <!-- Muestra la cantidad de likes -->
            </div>
          </div>
        </div>
      `;
    }
  }

  disconnectedCallback() {}
}

export default CommentCard;
