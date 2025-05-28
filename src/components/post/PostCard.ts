// Importa el estado de la aplicación (store centralizado)
import { appState } from "../../store";

// Importa funciones para navegar y alternar estados de "like" y "save" en un post
import { navigate, toggleLikePost, toggleSavePost } from "../../store/action";

// Importa las pantallas disponibles (enumeración)
import { Screens } from "../../types/navigation";

// Importa los estilos CSS del componente
import postCardStyles from "./PostCard.css";

// Define un enum con los atributos que el componente va a observar y manejar como propiedades HTML
export enum PostAttributes {
  ID = "postid",
  USER_ID = "userid",
  USERNAME = "username",
  PROFILE_PICTURE = "pfp",
  CONTENT = "content",
  IMAGE_URL = "imageurl",
  LIKES = "likes",
  REPOSTS = "reposts",
  COMMENTS = "comments",
  SAVES = "saves",
  TIMESTAMP = "timestamp",
  GAME_ID = "gameid",
  IS_LIKED = "isliked",
  IS_SAVED = "issaved"
}

// Crea un Web Component personalizado llamado PostCard
class PostCard extends HTMLElement {
  // Define las propiedades que el componente va a manejar
  postid?: string;
  userid?: string;
  username?: string;
  pfp?: string;
  content?: string;
  imageurl?: string;
  likes?: string;
  reposts?: string;
  comments?: string;
  saves?: string;
  timestamp?: string;
  gameid?: string;
  isliked?: string;
  issaved?: string;

  // Especifica qué atributos debe observar el componente para reaccionar a sus cambios
  static get observedAttributes() {
    return Object.values(PostAttributes);
  }

  // Se ejecuta cuando cambia alguno de los atributos observados
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      (this as any)[name] = newValue;
    }
  }

  // Constructor del componente: crea un shadow DOM
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  // Se ejecuta cuando el componente se añade al DOM
  connectedCallback() {
    this.render(); // Llama a render para construir el HTML

    // Busca los elementos interactivos dentro del Shadow DOM
    const postContent = this.shadowRoot?.querySelector(".post-content");
    const likeBtn = this.shadowRoot?.querySelector(".like-btn");
    const saveBtn = this.shadowRoot?.querySelector(".save-btn");
    const commentBtn = this.shadowRoot?.querySelector(".comment-btn");

    // Evento: al hacer click en el contenido, navega al detalle del post
    postContent?.addEventListener("click", () => {
      if (this.postid) {
        navigate(Screens.THREAD_DETAIL, this.postid);
        console.log('navigate from post');
      }
    });

    // Evento: al hacer click en "like", alterna el estado si el usuario está autenticado
    likeBtn?.addEventListener("click", (e) => {
      e.stopPropagation(); // Evita que se propague al postContent
      if (this.postid && appState.get().isAuthenticated) {
        toggleLikePost(this.postid);
        likeBtn.classList.add('animating'); // Añade animación
        setTimeout(() => likeBtn.classList.remove('animating'), 300);
        this.render(); // Vuelve a renderizar para actualizar visualmente
      } else if (!appState.get().isAuthenticated) {
        navigate(Screens.LOGIN);
      }
    });

    // Evento: al hacer click en "save", alterna el estado de guardado si está autenticado
    saveBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.postid && appState.get().isAuthenticated) {
        toggleSavePost(this.postid);
        this.render(); // Re-renderiza para reflejar cambios
      } else if (!appState.get().isAuthenticated) {
        navigate(Screens.LOGIN);
      }
    });

    // Evento: al hacer click en "comentar", navega al detalle del post
    commentBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.postid) {
        navigate(Screens.THREAD_DETAIL, this.postid);
      }
    });
  }

  // Formatea la fecha en formato relativo (ej. "2m ago", "3h ago", etc.)
  formatDate(dateString?: string): string {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    else if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    else if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    else return date.toLocaleDateString();
  }

  // Método para renderizar el HTML del componente
  render() {
    // Obtiene el estado actual de la aplicación
    const state = appState.get();

    // Busca el post actual por su ID en el estado
    const updatedPost = state.posts.find(p => p.id === this.postid);

    // Determina si el post está "likeado" o "guardado"
    const isLiked = updatedPost?.isLiked || this.isliked === "true";
    const isSaved = updatedPost?.isSaved || this.issaved === "true";

    // Renderiza el contenido en el shadow DOM
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${postCardStyles}</style>
        <div class="post-card">
          <div class="post-header">
            <img class="profile-picture" src="${this.pfp}" alt="${this.username}">
            <div class="post-info">
              <h3 class="username">${this.username}</h3>
              <span class="timestamp">${this.formatDate(this.timestamp)}</span>
            </div>
          </div>
          
          <div class="post-content">
            <p class="content-text">${this.content}</p>
            ${this.imageurl ? `<img class="content-image" src="${this.imageurl}" alt="Post image">` : ""}
          </div>
          
          <div class="post-actions">
            <div class="action-btn like-btn ${isLiked ? 'active' : ''}">
              <!-- Icono de like -->
              <svg ...></svg>
              <span>${this.likes}</span>
            </div>
            <div class="action-btn comment-btn">
              <!-- Icono de comentario -->
              <svg ...></svg>
              <span>${this.comments}</span>
            </div>
            <div class="action-btn repost-btn">
              <!-- Icono de repost -->
              <svg ...></svg>
              <span>${this.reposts}</span>
            </div>
            <div class="action-btn save-btn ${isSaved ? 'active' : ''}">
              <!-- Icono de guardar -->
              <svg ...></svg>
              <span>${this.saves}</span>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Se ejecuta cuando el componente se remueve del DOM (por si hay que limpiar listeners)
  disconnectedCallback() {
    // Aquí podrías remover listeners si fueran persistentes
  }
}

// Registra el Web Component con la etiqueta <post-card>
customElements.define("post-card", PostCard);

// Exporta el componente para poder usarlo en otros módulos
export default PostCard;
