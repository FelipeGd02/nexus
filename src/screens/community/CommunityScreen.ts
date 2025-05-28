import { appState, AppState } from "../../store";
import { navigate } from "../../store/action";
import { Screens } from "../../types/navigation";
import "../../components/post/post-card";
import communityStyles from "./community-screen.css";

class CommunityScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    
    // Event listeners
    const topicItems = this.shadowRoot?.querySelectorAll(".topic-item");
    topicItems?.forEach(item => {
      item.addEventListener("click", () => {
        const category = item.getAttribute("data-category");
        if (category) {
          navigate(Screens.CATEGORIES, undefined, category as any);
        }
      });
    });
  }

  renderRecentPosts() {
    const state = appState.get();
    // Sort by timestamp (newest first) and take first 3
    const recentPosts = [...state.posts]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3);
    
    return recentPosts.map(post => `
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
        isSaved="${post.isSaved || false}">
      </post-card>
    `).join("");
  }

  renderTrendingTopics() {
    const topics = [
      { name: "Horror Games", category: "Horror", description: "Explore the scariest games in the community." },
      { name: "RPG Adventures", category: "RPG", description: "Discuss character builds, storylines, and strategy." },
      { name: "Racing Showdown", category: "Racing", description: "Share your best times and racing tips." },
      { name: "Strategy Masters", category: "Strategy", description: "Plan, execute, and conquer in strategy games." },
      { name: "Action Highlights", category: "Action", description: "Fast-paced action game discussions and clips." }
    ];
    
    return topics.map(topic => `
      <div class="topic-item" data-category="${topic.category}">
        <h4>${topic.name}</h4>
        <p>${topic.description}</p>
        <div class="topic-meta">
          <span class="topic-category">${topic.category}</span>
          <span class="topic-action">Explore</span>
        </div>
      </div>
    `).join("");
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${communityStyles}</style>
        <div class="community-container">
          <div class="community-header">
            <h2>Nexus Community</h2>
            <p>Connect, discuss, and share with fellow gamers</p>
          </div>
          
          <div class="community-content">
            <div class="main-content">
              <section class="community-section">
                <h3>Recent Discussions</h3>
                <div class="recent-posts">
                  ${this.renderRecentPosts()}
                </div>
              </section>
              
              <section class="community-section">
                <h3>Community Stats</h3>
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-value">2,500+</div>
                    <div class="stat-label">Members</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">10K+</div>
                    <div class="stat-label">Posts</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">30K+</div>
                    <div class="stat-label">Comments</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">100+</div>
                    <div class="stat-label">Games</div>
                  </div>
                </div>
              </section>
              
              <section class="community-section">
                <h3>Community Guidelines</h3>
                <div class="guidelines">
                  <div class="guideline-item">
                    <h4>Be Respectful</h4>
                    <p>Treat others with respect. No harassment, hate speech, or trolling.</p>
                  </div>
                  <div class="guideline-item">
                    <h4>Stay On Topic</h4>
                    <p>Keep discussions relevant to gaming and the community.</p>
                  </div>
                  <div class="guideline-item">
                    <h4>No Spoilers</h4>
                    <p>Use spoiler tags when discussing game endings or major plot points.</p>
                  </div>
                  <div class="guideline-item">
                    <h4>Be Constructive</h4>
                    <p>Aim for meaningful contributions to discussions.</p>
                  </div>
                </div>
              </section>
            </div>
            
            <div class="sidebar">
              <section class="sidebar-section">
                <h3>Trending Topics</h3>
                <div class="trending-topics">
                  ${this.renderTrendingTopics()}
                </div>
              </section>
              
              <section class="sidebar-section">
                <h3>Join the Community</h3>
                <div class="join-community">
                  <p>Connect with other gamers and share your experiences.</p>
                  <button class="join-btn">Create Account</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      `;
      
      // Additional event listeners
      const joinBtn = this.shadowRoot.querySelector(".join-btn");
      joinBtn?.addEventListener("click", () => {
        navigate(Screens.REGISTER);
      });
    }
  }

  disconnectedCallback() {
    // Cleanup event listeners if needed
  }
}

export default CommunityScreen;