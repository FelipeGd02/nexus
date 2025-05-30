import { appState } from "../../Flux/store"; //^ Importa el estado global de la aplicación desde el store de Flux
import { toggleLikeComment } from "../../Flux/action"; //^ Importa la acción para alternar el "like" en un comentario
import commentCardStyles from "./CommentCard.css"; //^ Importa los estilos CSS para el componente

//& Define los atributos personalizados que el componente puede observar y utilizar
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
  //& Propiedades del componente, mapeadas desde los atributos HTML
  commentid?: string;
  postid?: string;
  userid?: string;
  username?: string;
  pfp?: string;
  content?: string;
  likes?: string;
  timestamp?: string;

  //& Lista de atributos que serán observados por el componente
  static get observedAttributes() {
    return Object.values(CommentAttributes); //! Devuelve todos los atributos definidos en el enum
  }

  //! Se ejecuta cuando un atributo observado cambia
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      (this as any)[name] = newValue; //* Actualiza la propiedad correspondiente al nuevo valor
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" }); //* Crea un Shadow DOM aislado para encapsular el contenido y estilos
  }

  connectedCallback() {
    this.render(); //* Renderiza el contenido del componente

    //* Configura el botón de "like"
    const likeBtn = this.shadowRoot?.querySelector(".like-btn");

    likeBtn?.addEventListener("click", () => {
      if (this.commentid && appState.get().isAuthenticated) { //! Solo permite dar like si el usuario está autenticado
        toggleLikeComment(this.commentid); //! Ejecuta la acción de alternar el like
        this.render(); //! Vuelve a renderizar el componente para reflejar los cambios
      }
    });
  }

  //* Método auxiliar para formatear la fecha en una forma legible
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
      return `${Math.floor(diffInSeconds / 3600)}h ago`;  //^Si han pasado menos de 24 horas, convierte el tiempo a horas y lo muestra: 2h ago.
    } else {
      return date.toLocaleDateString(); //! Devuelve la fecha completa si es mayor a un día
    }
  }

  render() {
    if (this.shadowRoot) {
      const state = appState.get(); //! Obtiene el estado global actual
      const comment = state.comments.find(c => c.id === this.commentid); //! Busca el comentario en el estado usando el id
      const isLiked = comment?.isLiked || false; //! Determina si el comentario fue marcado como "like"

      //^ Define el contenido HTML del componente con los datos del comentario
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
    //! Se podría usar para eliminar event listeners si se implementara más adelante
  }
}


export default CommentCard; //^ Exporta el componente para que pueda usarse en otras partes del proyecto
