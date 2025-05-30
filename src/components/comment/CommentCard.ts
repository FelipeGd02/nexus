//^ Importa el estado global de la aplicación (store)
import { appState } from "../../Flux/store";

//^ Importa la acción para dar/quitar like a un comentario
import { toggleLikeComment } from "../../Flux/action";

//! Importa los estilos CSS del componente
import commentCardStyles from "./CommentCard.css";

//! Enumera los atributos que puede tener un <comment-card>
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

//* Define el Web Component personalizado <comment-card>
class CommentCard extends HTMLElement {
  //* Define las propiedades que recibirá como atributos HTML
  commentid?: string;
  postid?: string;
  userid?: string;
  username?: string;
  pfp?: string;
  content?: string;
  likes?: string;
  timestamp?: string;

  //* Lista de atributos que el componente observará para detectar cambios
  static get observedAttributes() {
    return Object.values(CommentAttributes); //! Devuelve todos los atributos definidos en el enum
  }

  //& Se llama automáticamente cuando uno de los atributos observados cambia
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      (this as any)[name] = newValue; //* Actualiza la propiedad correspondiente al nuevo valor
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" }); //& Crea un shadow DOM
  }

  //& Se ejecuta cuando el componente entra al DOM
  connectedCallback() {
    this.render(); //! Dibuja el contenido del componente

    const likeBtn = this.shadowRoot?.querySelector(".like-btn"); //! Referencia al botón de like
    
    likeBtn?.addEventListener("click", () => {
      if (this.commentid && appState.get().isAuthenticated) {
        toggleLikeComment(this.commentid); //* Cambia el estado de like del comentario
        this.render(); //* Vuelve a renderizar el componente para reflejar los cambios
      }
    });
  }

  //& Función auxiliar para formatear la fecha como tiempo relativo (ej. "2h ago")
  formatDate(dateString?: string): string {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    //! Devuelve el tiempo relativo (por ejemplo: "5m ago", "2h ago", etc.)
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`; //^ Si han pasado menos de 60 segundos, muestra los segundos
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`; //^ Si han pasado menos de 60 minutos, muestra los minutos
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`; //^ Si han pasado menos de 24 horas, muestra las horas
    } else {
      return date.toLocaleDateString(); //* Si ha pasado más tiempo, muestra la fecha normal
    }
  }

  //* Aquí armamos todo el contenido que se va a ver en la tarjeta del comentario
  render() {
    if (this.shadowRoot) {
      const state = appState.get(); //! Obtiene el estado global
      const comment = state.comments.find(c => c.id === this.commentid); //! Busca el comentario actual
      const isLiked = comment?.isLiked || false; //! Verifica si el comentario tiene like

      this.shadowRoot.innerHTML = `
        <style>${commentCardStyles}</style> <!-- Aplica los estilos CSS -->
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
              <span class="likes-count">${this.likes}</span> <!-- Muestra la cantidad de likes -->
            </div>
          </div>
        </div>
      `;
    }
  }

  //& Se ejecuta cuando el componente se elimina del DOM
  disconnectedCallback() {
    //& se limpian los eventlisterners si es necesario
  }
}


//^ Exporta el componente para usarlo en otros archivos
export default CommentCard;


