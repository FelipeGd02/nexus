import { appState } from "../../Flux/store"; // Aquí traemos el estado global de la app
import { toggleLikeComment } from "../../Flux/action"; // Acción para darle like o quitar like a un comentario
import commentCardStyles from "./CommentCard.css"; 

// Estos son los nombres de los atributos que el componente usará
export enum CommentAttributes {
  ID = "commentid",
  POST_ID = "postid",
  USER_ID = "userid",
  USERNAME = "username",
  PROFILE_PICTURE = "pfp",
  CONTENT = "content",
  LIKES = "likes",
  TIMESTAMP = "timestamp"
}

class CommentCard extends HTMLElement {
  // Propiedades del comentario que vamos a usar
  commentid?: string;
  postid?: string;
  userid?: string;
  username?: string;
  pfp?: string;
  content?: string;
  likes?: string;
  timestamp?: string;

  // Esto dice qué atributos debe estar pendiente de cambios
  static get observedAttributes() {
    return Object.values(CommentAttributes);
  }

  // Cuando alguno de esos atributos cambia, actualizamos la propiedad correspondiente
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      (this as any)[name] = newValue;
    }
  }

  constructor() {
    super();
    // Aquí creamos un Shadow DOM para que el componente tenga su propio espacio
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render(); // Cuando el componente aparece, lo dibujamos
    
    // Buscamos el botón de "me gusta" para agregarle un evento
    const likeBtn = this.shadowRoot?.querySelector(".like-btn");
    
    // Cuando le das click al botón de like
    likeBtn?.addEventListener("click", () => {
      // Si hay un id y el usuario está autenticado
      if (this.commentid && appState.get().isAuthenticated) {
        toggleLikeComment(this.commentid); // Cambiamos el estado de like para este comentario
        this.render(); // Volvemos a dibujar para actualizar la interfaz
      }
    });
  }

  // Este método toma una fecha y la convierte en algo fácil de leer como "5m ago"
  formatDate(dateString?: string): string {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return date.toLocaleDateString(); // Si es más viejo, muestra la fecha normal
    }
  }

  // Aquí armamos todo el contenido que se va a ver en la tarjeta del comentario
  render() {
    if (this.shadowRoot) {
      const state = appState.get(); // Sacamos el estado actual
      const comment = state.comments.find(c => c.id === this.commentid); // Buscamos el comentario que corresponde
      const isLiked = comment?.isLiked || false; // Vemos si el comentario ya está likeado
      
      // Ponemos el HTML con los datos que tenemos
      this.shadowRoot.innerHTML = `
        <style>${commentCardStyles}</style>
        <div class="comment-card">
          <div class="comment-header">
            <img class="profile-picture" src="${this.pfp}" alt="${this.username}">
            <div class="comment-info">
              <h4 class="username">${this.username}</h4>
              <span class="timestamp">${this.formatDate(this.timestamp)}</span>
            </div>
          </div>
          <div class="comment-content">
            <p>${this.content}</p>
          </div>
          <div class="comment-actions">
            <div class="action-btn like-btn ${isLiked ? 'active' : ''}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span class="likes-count">${this.likes}</span>
            </div>
          </div>
        </div>
      `;
    }
  }

  disconnectedCallback() {
  }
}

customElements.define("comment-card", CommentCard);
export default CommentCard;
