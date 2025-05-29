import { appState } from "../../Flux/store"; // Estado global de la app
import { navigate } from "../../Flux/action"; // Función para cambiar de pantalla
import { Screens } from "../../types/navigation"; // Nombres de las pantallas
import "../../components/post/PostCard"; // Componente para mostrar posts
import communityStyles from "./CommunityScreen.css"; // Estilos para esta pantalla

class CommunityScreen extends HTMLElement {
  constructor() {
    super();
    // Creamos un Shadow DOM para que el componente tenga su propio espacio sin interferir con otros estilos
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render(); // Dibujamos la pantalla cuando el componente aparece

    // Buscamos los temas para poner eventos de click y navegar a la categoría correspondiente
    const topicItems = this.shadowRoot?.querySelectorAll(".topic-item");
    topicItems?.forEach(item => {
      item.addEventListener("click", () => {
        const category = item.getAttribute("data-category");
        if (category) {
          // Navegamos a la pantalla de categorías pasando la categoría seleccionada
          navigate(Screens.CATEGORIES, undefined, category as any);
        }
      });
    });
  }

  // Muestra los 3 posts más recientes ordenados por fecha (los más nuevos primero)
  renderRecentPosts() {
    const state = appState.get();
    const recentPosts = [...state.posts]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3);
    
    // Creamos un post-card para cada post reciente
    return recentPosts.map(post => `
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

  // Muestra una lista de temas populares para que los usuarios los exploren
  renderTrendingTopics() {
    const topics = [
      { name: "Horror Games", category: "Horror", description: "Explore the scariest games in the community." },
      { name: "RPG Adventures", category: "RPG", description: "Discuss character builds, storylines, and strategy." },
      { name: "Racing Showdown", category: "Racing", description: "Share your best times and racing tips." },
      { name: "Strategy Masters", category: "Strategy", description: "Plan, execute, and conquer in strategy games." },
      { name: "Action Highlights", category: "Action", description: "Fast-paced action game discussions and clips." }
    ];
    
    // Creamos bloques HTML para cada tema popular
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
      // Armamos el contenido principal con secciones: posts recientes, estadísticas, reglas, temas y llamada a unirse
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
      
      // Agregamos evento al botón para crear cuenta y navegar a registro
      const joinBtn = this.shadowRoot.querySelector(".join-btn");
      joinBtn?.addEventListener("click", () => {
        navigate(Screens.REGISTER);
      });
    }
  }

  disconnectedCallback() {
    // Aquí se podrían limpiar eventos si fuera necesario
  }
}

export default CommunityScreen;
