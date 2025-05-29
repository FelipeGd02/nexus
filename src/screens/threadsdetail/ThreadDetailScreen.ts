import { appState } from "../../Flux/store";
import { addComment } from "../../Flux/action";
import "../../components/post/PostCard";
import "../../components/comment/CommentCard";
import threadDetailStyles from "./ThreadDetailScreen.css"
import { navigate } from "../../Flux/action";
import { Screens } from "../../types/navigation";

class ThreadDetailScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    
    // Add event listeners
    const commentForm = this.shadowRoot?.querySelector("#comment-form");
    commentForm?.addEventListener("submit", this.handleCommentSubmit.bind(this));
  }

  handleCommentSubmit(e: Event) {
    e.preventDefault();
    
    const state = appState.get();
    if (!state.currentPostId) return;
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const commentContent = formData.get("comment-content") as string;
    
    if (commentContent.trim()) {
      addComment(state.currentPostId, commentContent);
      form.reset();
      this.render(); // Re-render to show the new comment
    }
  }

  renderPost() {
    const state = appState.get();
    if (!state.currentPostId) return "";
    
    const post = state.posts.find(p => p.id === state.currentPostId);
    if (!post) return "<p>Post not found</p>";
    
    return `
      <div class="thread-post">
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
      </div>
    `;
  }

  renderComments() {
    const state = appState.get();
    if (!state.currentPostId) return "";
    
    const postComments = state.comments.filter(c => c.postId === state.currentPostId);
    
    if (postComments.length === 0) {
      return `
        <div class="no-comments">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      `;
    }
    
    return postComments.map(comment => `
      <comment-card
        commentid="${comment.id}"
        postid="${comment.postId}"
        userid="${comment.userId}"
        username="${comment.username}"
        pfp="${comment.profilePicture}"
        content="${comment.content}"
        likes="${comment.likes}"
        timestamp="${comment.timestamp}">
      </comment-card>
    `).join("");
  }

  renderCommentForm() {
    const state = appState.get();
    
    if (!state.isAuthenticated) {
      return `
        <div class="login-to-comment">
          <p>Log in to leave a comment</p>
        </div>
      `;
    }
    
    return `
      <form id="comment-form" class="comment-form">
        <div class="form-group">
          <div class="user-info">
            <img src="${state.currentUser?.profilePicture}" alt="${state.currentUser?.username}">
            <span>${state.currentUser?.username}</span>
          </div>
          <textarea name="comment-content" placeholder="Add a comment..." required></textarea>
        </div>
        <button type="submit" class="comment-btn">Post Comment</button>
      </form>
    `;
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${threadDetailStyles}</style>
        <div class="thread-detail-container">
          <div class="thread-content">
            <div class="back-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>Back to threads</span>
            </div>
            
            ${this.renderPost()}
            
            <div class="comments-section">
              <h3>Comments</h3>
              
              ${this.renderCommentForm()}
              
              <div class="comments-list">
                ${this.renderComments()}
              </div>
            </div>
          </div>
          
          <div class="related-posts">
            <h3>Related Posts</h3>
            <p>Coming soon...</p>
          </div>
        </div>
      `;
      
      // Add event listener to back button
      const backButton = this.shadowRoot.querySelector(".back-button");
      backButton?.addEventListener("click", () => {
       navigate(Screens.THREADS);
      });
    }
  }

  disconnectedCallback() {
    // Cleanup event listeners if needed
  }
}

export default ThreadDetailScreen;