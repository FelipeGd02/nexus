import { appState } from "../../Flux/store"; // Estado global de la app
import "../../components/post/PostCard"; // Componente para mostrar posts individuales
import "../../components/post/CreatePost"; // Componente para crear un nuevo post
import threadsStyles from "./ThreadsScreen.css"; // Estilos para esta pantalla

class ThreadsScreen extends HTMLElement {
  constructor() {
    super();
    // Creamos un Shadow DOM para que el componente tenga su propio estilo y estructura aislada
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render(); // Cuando el componente se añade al DOM, dibujamos su contenido
  }

  // Método para generar el HTML con todos los posts filtrados para mostrar
  renderPosts() {
    const state = appState.get();
    const posts = state.filteredPosts;

    // Si no hay posts, mostramos un mensaje invitando a crear uno
    if (posts.length === 0) {
      return `
        <div class="no-posts">
          <p>No posts found. Be the first to create a post!</p>
        </div>
      `;
    }

    // Si hay posts, creamos un <post-card> para cada uno con sus datos
    return posts
      .map(
        (post) => `
      <post-card
        postid="${post.id}"
        userid="${post.userId}"
        username="${post.username}"
        pfp="${post.profilePicture}"
        content="${post.content}"
        ${post.imageUrl ? `imageurl="${post.imageUrl}"` : ""}
        likes="${post.likes}"
        reposts="${post.reposts}"
        comments="${post.comments}"
        saves="${post.saves}"
        timestamp="${post.timestamp}"
        ${post.gameId ? `gameid="${post.gameId}"` : ""}
        isliked="${post.isLiked || false}"
        issaved="${post.isSaved || false}">
      </post-card>
    `
      )
      .join("");
  }

  render() {
    if (this.shadowRoot) {
      // Armamos la estructura principal: encabezado, formulario para crear posts y lista de posts
      this.shadowRoot.innerHTML = `
        <style>${threadsStyles}</style>
        <div class="threads-container">
          <div class="threads-header">
            <h2>Latest Threads</h2>
            <p>Join the conversation and share your gaming experiences.</p>
          </div>
          
          <create-post></create-post> <!-- Formulario para crear nuevo post -->
          
          <div class="threads-feed">
            ${this.renderPosts()} <!-- Lista de posts existentes -->
          </div>
        </div>
      `;
    }
  }

  disconnectedCallback() {
    // Aquí se podrían limpiar eventos o recursos si fuera necesario
  }
}

export default ThreadsScreen;
