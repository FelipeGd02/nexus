import { AppState } from "../../store";
import { navigate } from "../../store/action";
import { Screens } from "../../types/navigation";
import "../../components/game/game-card";
import landingStyles from "./landing-screen.css";

class LandingScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    
    // Event listeners
    const exploreBtn = this.shadowRoot?.querySelector("#explore-btn");
    const welcomeModal = this.shadowRoot?.querySelector("#welcome-modal");
    const closeModal = this.shadowRoot?.querySelector("#close-modal");
    const learnMoreBtn = this.shadowRoot?.querySelector("#learn-more");
    
    exploreBtn?.addEventListener("click", () => {
      navigate(Screens.THREADS);
    });
    
    learnMoreBtn?.addEventListener("click", () => {
      welcomeModal?.classList.add("active");
      document.body.style.overflow = "hidden";
    });
    
    closeModal?.addEventListener("click", () => {
      welcomeModal?.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  renderTopGames() {
    const state = appState.get();
    // Get top 4 games by rating
    const topGames = [...state.games]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
    
    return topGames.map(game => `
      <div class="game-item">
        <game-card
          gameid="${game.id}"
          title="${game.title}"
          category="${game.category}"
          imageurl="${game.imageUrl}"
          rating="${game.rating}">
        </game-card>
      </div>
    `).join("");
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${landingStyles}</style>
        
        <div class="landing-container">
          <!-- Hero Section -->
          <section class="hero">
            <div class="hero-content">
              <h1 class="hero-title">Nexus</h1>
              <p class="hero-subtitle">Connect with gamers. Share your passion.</p>
              <button id="explore-btn" class="explore-btn">Explore Now</button>
            </div>
            <div class="hero-image"></div>
          </section>
          
          <!-- Welcome Section -->
          <section class="welcome-section">
            <h2 class="section-title">Welcome to Nexus</h2>
            <p class="section-description">
              Nexus is a social platform dedicated to gamers, where you can share your gaming experiences, 
              discuss your favorite titles, and connect with fellow gamers from around the world.
            </p>
            <button id="learn-more" class="learn-more-btn">Learn More</button>
          </section>
          
          <!-- Top Games Section -->
          <section class="top-games-section">
            <h2 class="section-title">Top Games</h2>
            <p class="section-description">
              Discover the most popular games in the community. Click on a game to see related posts.
            </p>
            <div class="games-grid">
              ${this.renderTopGames()}
            </div>
          </section>
          
          <!-- Features Section -->
          <section class="features-section">
            <h2 class="section-title">Features</h2>
            <div class="features-grid">
              <div class="feature-card">
                <div class="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                    <path d="M17 2H7a5 5 0 00-5 5v10a5 5 0 005 5h10a5 5 0 005-5V7a5 5 0 00-5-5zM7 4h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3zm5 10a2 2 0 100-4 2 2 0 000 4z"/>
                  </svg>
                </div>
                <h3>Share Posts</h3>
                <p>Share your gaming experiences with the community through text and images.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <h3>Like & Comment</h3>
                <p>Engage with content by liking, commenting, and saving your favorite posts.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                    <path d="M17 2H7a5 5 0 00-5 5v10a5 5 0 005 5h10a5 5 0 005-5V7a5 5 0 00-5-5z"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/>
                  </svg>
                </div>
                <h3>Discover Categories</h3>
                <p>Browse content by game categories to find posts about your favorite games.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                </div>
                <h3>Build Community</h3>
                <p>Connect with other gamers, follow your favorites, and join gaming discussions.</p>
              </div>
            </div>
          </section>
        </div>
        
        <!-- Welcome Modal -->
        <div id="welcome-modal" class="modal">
          <div class="modal-content">
            <span id="close-modal" class="close">&times;</span>
            <h2>Welcome to Nexus - The Gaming Community</h2>
            <p>
              Nexus is designed from the ground up to connect gamers from all around the world. 
              Our platform allows you to share your gaming moments, discuss strategies, 
              and discover new titles based on the community's recommendations.
            </p>
            <h3>Our Mission</h3>
            <p>
              We believe gaming is more fun when shared with others. Our mission is to create
              a positive space where gamers can connect, share, and grow together.
            </p>
            <h3>Key Features</h3>
            <ul>
              <li>Interactive posts with likes, comments, and saves</li>
              <li>Game categorization for easy discovery</li>
              <li>Community discussions on popular titles</li>
              <li>Personal profile to showcase your gaming preferences</li>
              <li>Responsive design that works on all your devices</li>
            </ul>
            <p>
              Join Nexus today and become part of our growing community of passionate gamers!
            </p>
            <button id="close-btn" class="modal-btn">Got it!</button>
          </div>
        </div>
      `;
      
      // Make sure modal close button works
      const closeBtn = this.shadowRoot.querySelector("#close-btn");
      const welcomeModal = this.shadowRoot.querySelector("#welcome-modal");
      
      closeBtn?.addEventListener("click", () => {
        welcomeModal?.classList.remove("active");
        document.body.style.overflow = "";
      });
    }
  }

  disconnectedCallback() {
    // Cleanup event listeners if needed
  }
}

export default LandingScreen;