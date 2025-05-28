import { appState } from "../../store";
import { navigate } from "../../store/action";
import { Screens } from "../../types/navigation";
import "../../components/game/GameCard";

class LandingScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    const exploreBtn = this.shadowRoot!.querySelector("#explore-btn");
    const welcomeModal = this.shadowRoot!.querySelector("#welcome-modal");
    const closeModal = this.shadowRoot!.querySelector("#close-modal");
    const learnMoreBtn = this.shadowRoot!.querySelector("#learn-more");

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

    const closeBtn = this.shadowRoot!.querySelector("#close-btn");
    closeBtn?.addEventListener("click", () => {
      welcomeModal?.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  renderTopGames() {
    const state = appState.get();
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
    const styles = `/* CSS INTEGRATED HERE */`;

    this.shadowRoot!.innerHTML = `
      <style>${styles}</style>
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
            <!-- More features... -->
          </div>
        </section>
      </div>
      <!-- Welcome Modal -->
      <div id="welcome-modal" class="modal">
        <div class="modal-content">
          <span id="close-modal" class="close">&times;</span>
          <h2>Welcome to Nexus - The Gaming Community</h2>
          <p>Nexus is designed from the ground up to connect gamers from all around the world...</p>
          <button id="close-btn" class="modal-btn">Got it!</button>
        </div>
      </div>
    `;
  }

  disconnectedCallback() {}
}

export default LandingScreen;