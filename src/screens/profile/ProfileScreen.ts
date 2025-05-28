import { appState, AppState } from "../../store";
import { navigate } from "../../store/action";
import { Screens } from "../../types/navigation";
import "../../components/post/post-card";
import "../../components/game/game-card";
import "../../components/profile/edit-profile-modal";
import profileStyles from "./profile-screen.css";

class ProfileScreen extends HTMLElement {
  private showEditModal: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    
    // Event listeners for tabs
    const savedTab = this.shadowRoot?.querySelector("#saved-tab");
    const gamesTab = this.shadowRoot?.querySelector("#games-tab");
    const statsTab = this.shadowRoot?.querySelector("#stats-tab");
    const editProfileBtn = this.shadowRoot?.querySelector(".edit-profile-btn");
    
    const contentSections = this.shadowRoot?.querySelectorAll(".tab-content");
    
    savedTab?.addEventListener("click", () => {
      this.activateTab(savedTab, contentSections, "saved-content");
    });
    
    gamesTab?.addEventListener("click", () => {
      this.activateTab(gamesTab, contentSections, "games-content");
    });
    
    statsTab?.addEventListener("click", () => {
      this.activateTab(statsTab, contentSections, "stats-content");
    });

    editProfileBtn?.addEventListener("click", () => {
      this.showEditModal = true;
      this.render();
    });
  }

  activateTab(tab: Element, contentSections: NodeListOf<Element> | undefined, contentId: string) {
    // Update active tab
    const tabs = this.shadowRoot?.querySelectorAll(".tab-item");
    tabs?.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    
    // Update visible content
    contentSections?.forEach(section => {
      section.classList.remove("active");
      if (section.id === contentId) {
        section.classList.add("active");
      }
    });
  }

  handleEditModalClose = () => {
    this.showEditModal = false;
    this.render();
  };

  renderSavedPosts() {
    const state = appState.get();
    
    if (!state.isAuthenticated) {
      return `<p class="empty-message">Log in to save posts</p>`;
    }
    
    const savedPosts = state.posts.filter(post => post.isSaved);
    
    if (savedPosts.length === 0) {
      return `<p class="empty-message">No saved posts yet</p>`;
    }
    
    return savedPosts.map(post => `
      <post-card
        postId="${post.id}"
        userId="${post.userId}"
        username="${post.username}"
        profilePicture="${post.profilePicture}"
        content="${post.content}"
        ${post.imageUrl ? `imageUrl="${post.imageUrl}"` : ''}
        likes="${post.likes}"
        reposts="${post.reposts}"
        comments="${post.comments}"
        saves="${post.saves}"
        timestamp="${post.timestamp}"
        ${post.gameId ? `gameId="${post.gameId}"` : ''}
        isLiked="${post.isLiked || false}"
        isSaved="${post.isSaved || true}">
      </post-card>
    `).join("");
  }

  renderGames() {
    const state = appState.get();
    const games = state.games.slice(0, 4); // Just showing a few games for demo
    
    if (games.length === 0) {
      return `<p class="empty-message">No favorite games yet</p>`;
    }
    
    return `
      <div class="games-grid">
        ${games.map(game => `
          <game-card
            gameId="${game.id}"
            title="${game.title}"
            category="${game.category}"
            imageUrl="${game.imageUrl}"
            rating="${game.rating}">
          </game-card>
        `).join("")}
      </div>
    `;
  }

  renderStats() {
    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">23</div>
          <div class="stat-label">Posts Created</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">156</div>
          <div class="stat-label">Comments Made</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">78</div>
          <div class="stat-label">Likes Given</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">45</div>
          <div class="stat-label">Days Active</div>
        </div>
      </div>
    `;
  }

  render() {
    const state = appState.get();
    const user = state.currentUser;
    
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${profileStyles}</style>
        <div class="profile-container">
          ${!state.isAuthenticated 
            ? `
              <div class="login-required">
                <h2>Login Required</h2>
                <p>Please log in to view your profile</p>
                <button id="login-btn" class="login-btn">Go to Login</button>
              </div>
            `
            : `
              <div class="profile-header">
                <div class="profile-cover"></div>
                <div class="profile-info">
                  <img src="${user?.profilePicture}" alt="${user?.username}" class="profile-picture">
                  <h2 class="username">${user?.username}</h2>
                  <p class="bio">${user?.bio}</p>
                  <div class="stats">
                    <div class="stat">
                      <span class="value">${user?.followers}</span>
                      <span class="label">Followers</span>
                    </div>
                    <div class="stat">
                      <span class="value">${user?.following}</span>
                      <span class="label">Following</span>
                    </div>
                  </div>
                  <button class="edit-profile-btn">Edit Profile</button>
                </div>
              </div>
              
              <div class="profile-content">
                <div class="tabs">
                  <div id="saved-tab" class="tab-item active">Saved Posts</div>
                  <div id="games-tab" class="tab-item">Favorite Games</div>
                  <div id="stats-tab" class="tab-item">Statistics</div>
                </div>
                
                <div class="tab-contents">
                  <div id="saved-content" class="tab-content active">
                    ${this.renderSavedPosts()}
                  </div>
                  <div id="games-content" class="tab-content">
                    ${this.renderGames()}
                  </div>
                  <div id="stats-content" class="tab-content">
                    ${this.renderStats()}
                  </div>
                </div>
              </div>
              
              ${this.showEditModal ? `
                <edit-profile-modal></edit-profile-modal>
              ` : ''}
            `
          }
        </div>
      `;
      
      // Add event listeners
      const loginBtn = this.shadowRoot.querySelector("#login-btn");
      const editModal = this.shadowRoot.querySelector("edit-profile-modal");
      
      loginBtn?.addEventListener("click", () => {
        navigate(Screens.LOGIN);
      });
      
      editModal?.addEventListener("close", this.handleEditModalClose);
    }
  }

  disconnectedCallback() {
    const editModal = this.shadowRoot?.querySelector("edit-profile-modal");
    editModal?.removeEventListener("close", this.handleEditModalClose);
  }
}

export default ProfileScreen;