import { appState } from "../../Flux/store"; // Estado global de la app
import { navigate } from "../../Flux/action"; // Acción para cambiar de pantalla
import { Screens } from "../../types/navigation"; // Constantes con nombres de pantallas
import "../../components/post/PostCard"; // Componente para mostrar posts
import "../../components/game/GameCard"; // Componente para mostrar juegos
import "../../components/profile/EditProfileModal"; // Modal para editar perfil
import profileStyles from "./ProfileScreen.css"; // Estilos para esta pantalla

class ProfileScreen extends HTMLElement {
  private showEditModal: boolean = false; // Controla si se muestra el modal de edición

  constructor() {
    super();
    // Creamos el Shadow DOM para aislar estilos y estructura
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render(); // Cuando el componente se agrega al DOM, dibujamos la pantalla

    // Seleccionamos los tabs y botón para edición
    const savedTab = this.shadowRoot?.querySelector("#saved-tab");
    const gamesTab = this.shadowRoot?.querySelector("#games-tab");
    const statsTab = this.shadowRoot?.querySelector("#stats-tab");
    const editProfileBtn = this.shadowRoot?.querySelector(".edit-profile-btn");

    const contentSections = this.shadowRoot?.querySelectorAll(".tab-content");

    // Configuramos evento para activar el tab de posts guardados
    savedTab?.addEventListener("click", () => {
      this.activateTab(savedTab, contentSections, "saved-content");
    });

    // Evento para activar el tab de juegos favoritos
    gamesTab?.addEventListener("click", () => {
      this.activateTab(gamesTab, contentSections, "games-content");
    });

    // Evento para activar el tab de estadísticas
    statsTab?.addEventListener("click", () => {
      this.activateTab(statsTab, contentSections, "stats-content");
    });

    // Mostrar modal de edición cuando se presiona el botón
    editProfileBtn?.addEventListener("click", () => {
      this.showEditModal = true;
      this.render();
    });
  }

  // Cambia la pestaña activa y el contenido visible
  activateTab(tab: Element, contentSections: NodeListOf<Element> | undefined, contentId: string) {
    const tabs = this.shadowRoot?.querySelectorAll(".tab-item");
    tabs?.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    contentSections?.forEach(section => {
      section.classList.remove("active");
      if (section.id === contentId) {
        section.classList.add("active");
      }
    });
  }

  // Cuando el modal de edición se cierra, actualizamos estado y redibujamos
  handleEditModalClose = () => {
    this.showEditModal = false;
    this.render();
  };

  // Muestra los posts guardados por el usuario
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

  // Muestra algunos juegos favoritos del usuario
  renderGames() {
    const state = appState.get();
    const games = state.games.slice(0, 4); // Solo mostramos 4 juegos para ejemplo

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

  // Muestra algunas estadísticas ficticias del usuario
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

      // Eventos para botón de login y modal de edición
      const loginBtn = this.shadowRoot.querySelector("#login-btn");
      const editModal = this.shadowRoot.querySelector("edit-profile-modal");

      loginBtn?.addEventListener("click", () => {
        navigate(Screens.LOGIN);
      });

      editModal?.addEventListener("close", this.handleEditModalClose);
    }
  }

  disconnectedCallback() {
    // Limpiamos el evento del modal para evitar memory leaks
    const editModal = this.shadowRoot?.querySelector("edit-profile-modal");
    editModal?.removeEventListener("close", this.handleEditModalClose);
  }
}

export default ProfileScreen;
