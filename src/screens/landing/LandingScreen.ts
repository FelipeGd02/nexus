//^ Importa el estado global y funciones de navegación desde Flux
import { appState } from "../../Flux/store";
import { navigate } from "../../Flux/action";

//^ Importa las rutas disponibles en la app
import { Screens } from "../../types/navigation";

//^ Importa los componentes visuales reutilizables
import "../../components/game/GameCard";
import "../../components/post/PostCard";

//^ Importa los estilos CSS específicos de esta pantalla
import landingStyles from "./LandingScreen.css";

//! Define un nuevo Web Component llamado LandingScreen
class LandingScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }); //& Habilita el Shadow DOM para encapsular el contenido
  }

  //* Método que se ejecuta cuando el componente se agrega al DOM
  connectedCallback() {
    this.render(); //* Renderiza el contenido inicial

    //* Referencias a botones/modales en el shadow DOM
    const exploreBtn = this.shadowRoot?.querySelector("#explore-btn");
    const welcomeModal = this.shadowRoot?.querySelector("#welcome-modal");
    const closeModal = this.shadowRoot?.querySelector("#close-modal");
    const learnMoreBtn = this.shadowRoot?.querySelector("#learn-more");

    //* Redirige a la pantalla de hilos al hacer clic en "Explore Now"
    exploreBtn?.addEventListener("click", () => {
      navigate(Screens.THREADS);
    });

    //* Abre el modal informativo
    learnMoreBtn?.addEventListener("click", () => {
      welcomeModal?.classList.add("active");
      document.body.style.overflow = "hidden"; //* Evita scroll en el fondo
    });

    // Cierra el modal
    closeModal?.addEventListener("click", () => {
      welcomeModal?.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  //! Renderiza los juegos mejor calificados (Top 4)
  renderTopGames() {
    const state = appState.get(); //! Obtiene el estado actual
    const topGames = [...state.games]
      .sort((a, b) => b.rating - a.rating) //! Ordena por calificación
      .slice(0, 4); //& Toma solo los primeros 4

    //! Crea elementos <game-card> para cada juego
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

  //! Renderiza las publicaciones más recientes (Top 4)
  renderRecentThreads() {
    const state = appState.get();
    const recentPosts = [...state.posts]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 4);

    //! Crea elementos <post-card> para cada publicación
    return recentPosts.map(post => `
      <div class="thread-item">
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
          preview="true">
        </post-card>
      </div>
    `).join("");
  }

  //! Renderiza la interfaz completa
  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${landingStyles}</style> <!-- Aplica estilos CSS -->

        <div class="landing-container">
          <!-- Hero: título principal -->
          <section class="hero">
            <div class="hero-content">
              <h1 class="hero-title">Nexus</h1>
              <p class="hero-subtitle">Connect with gamers. Share your passion.</p>
              <button id="explore-btn" class="explore-btn">Explore Now</button>
            </div>
            <div class="hero-image"></div>
          </section>

          <!-- Sección de bienvenida con botón para saber más -->
          <section class="welcome-section">
            <h2 class="section-title">Welcome to Nexus</h2>
            <p class="section-description">
              Nexus is a social platform dedicated to gamers...
            </p>
            <button id="learn-more" class="learn-more-btn">Learn More</button>
          </section>

          <!-- Sección de mejores juegos -->
          <section class="top-games-section">
            <h2 class="section-title">Top Games</h2>
            <p class="section-description">Discover the most popular games...</p>
            <div class="games-grid">
              ${this.renderTopGames()} <!-- Inserta tarjetas de juegos -->
            </div>
          </section>

          <!-- Sección de funcionalidades destacadas -->
          <section class="features-section">
            <h2 class="section-title">Features</h2>
            <div class="features-grid">
              <!-- Muestra tarjetas con íconos SVG y descripciones -->
              <div class="feature-card">...</div>
              <div class="feature-card">...</div>
              <div class="feature-card">...</div>
              <div class="feature-card">...</div>
            </div>
          </section>
        </div>

        <!-- Sección de hilos recientes -->
        <section class="threads-section">
          <h2 class="section-title">Recent Discussions</h2>
          <p class="section-description">Join the conversation...</p>
          <div class="threads-grid">
            ${this.renderRecentThreads()} <!-- Inserta tarjetas de posts -->
          </div>
        </section>

        <!-- Modal de bienvenida con detalles -->
        <div id="welcome-modal" class="modal">
          <div class="modal-content">
            <span id="close-modal" class="close">&times;</span>
            <h2>Welcome to Nexus - The Gaming Community</h2>
            <p>...</p>
            <h3>Our Mission</h3>
            <p>...</p>
            <h3>Key Features</h3>
            <ul>
              <li>Interactive posts...</li>
              <li>Game categorization...</li>
              ...
            </ul>
            <p>Join Nexus today...</p>
            <button id="close-btn" class="modal-btn">Got it!</button>
          </div>
        </div>
      `;

      //* Cierra el modal desde el botón inferior
      const closeBtn = this.shadowRoot.querySelector("#close-btn");
      const welcomeModal = this.shadowRoot.querySelector("#welcome-modal");

      closeBtn?.addEventListener("click", () => {
        welcomeModal?.classList.remove("active");
        document.body.style.overflow = "";
      });
    }
  }

  //& Método opcional para limpiar recursos al quitar el componente
  disconnectedCallback() {
    //& Aquí podrías remover event listeners si agregaste listeners externos
  }
}

//^ Exporta el componente para que pueda ser usado en HTML o por otros módulos
export default LandingScreen;
