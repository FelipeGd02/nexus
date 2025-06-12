import { appState } from "../../Flux/store"; //^ Estado global de la app
import { navigate } from "../../Flux/action"; //^ Funciones para cambiar pantalla, dar like y guardar posts
import { Screens } from "../../types/navigation"; //^ Nombres de pantallas disponibles
import postCardStyles from "./PostCard.css"; //^ Estilos CSS para el componente
import { likePost, savePost } from "../../services/supabase";

//* Atributos que el componente va a usar y observar
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
  IS_SAVED = "issaved",
}

class PostCard extends HTMLElement {
  //* Propiedades donde guardamos la info que llega por atributos
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

  //* Indicamos qué atributos queremos escuchar cuando cambien
  static get observedAttributes() {
    return Object.values(PostAttributes); //* Devuelve todos los atributos definidos arriba
  }

  //! Cuando un atributo cambia, actualizamos la propiedad del componente
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      (this as Record<PostAttributes, string | undefined>)[
        name as PostAttributes
      ] = newValue; //! Asignación dinámica usando el nombre del atributo
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" }); //& Crea un Shadow DOM para encapsular estilos y estructura
  }

  connectedCallback() {
    this.render(); //& Dibuja la tarjeta cuando aparece en la página

    const postContent = this.shadowRoot?.querySelector(".post-content"); //! Zona de contenido del post
    const likeBtn = this.shadowRoot?.querySelector(".like-btn"); //! Botón de like
    const saveBtn = this.shadowRoot?.querySelector(".save-btn"); //! Botón de guardar
    const commentBtn = this.shadowRoot?.querySelector(".comment-btn"); //! Botón de comentarios

    const state = appState.get(); //! Obtiene el estado global de la aplicación

    //* Cuando se hace click en el contenido del post
    postContent?.addEventListener("click", () => {
      if (this.postid) {
        navigate(Screens.THREAD_DETAIL, this.postid); //* Navega al detalle del hilo
        console.log("navigate from post");
      }
    });

    //! Al hacer clic en like
    likeBtn?.addEventListener("click", (e) => {
      e.stopPropagation(); //! Evita que el evento afecte al contenedor
      if (this.postid && state.isAuthenticated && state.currentUser) {
        likePost(this.postid, state.currentUser.id); //& Cambia el estado de like
      } else if (!appState.get().isAuthenticated) {
        navigate(Screens.LOGIN); //! Si no está autenticado, lo manda al login
      }
    });

    //& Al hacer clic en guardar
    saveBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.postid && state.isAuthenticated && state.currentUser) {
        savePost(this.postid, state.currentUser.id);
      } else if (!appState.get().isAuthenticated) {
        navigate(Screens.LOGIN);
      }
    });

    //! Al hacer clic en comentar
    commentBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.postid) {
        navigate(Screens.THREAD_DETAIL, this.postid); //! Navega a detalle del hilo
      }
    });
  }

  //& Convierte la fecha en un formato relativo como "5m ago"
  formatDate(dateString?: string): string {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`; //* Segundos
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`; //* Minutos
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`; //* Horas
    } else {
      return date.toLocaleDateString(); //* Fecha normal
    }
  }

  //! Dibuja la tarjeta con toda la información del post
  render() {
    const state = appState.get(); //! Obtiene el estado global
    const updatedPost = state.posts.find((p) => p.id === this.postid); // &Busca el post actualizado
    const game = state.games.find((g) => g.id === this.gameid); // &Busca el juego asociado al post

    const isLiked = updatedPost?.isLiked || this.isliked === "true"; //& Verifica si está likeado
    const isSaved = updatedPost?.isSaved || this.issaved === "true"; // &Verifica si está guardado

    if (this.shadowRoot) {
      //! Construye el HTML del componente con datos dinámicos
      this.shadowRoot.innerHTML = `
        <style>${postCardStyles}</style>
        <div class="post-card">
          <div class="post-header">
            <img class="profile-picture" src="${this.pfp}" alt="${
        this.username
      }">
            <div class="post-info">
              <h3 class="username">${this.username}</h3>
              <span class="timestamp">${this.formatDate(this.timestamp)}</span>
            </div>
          </div>

          <div class="post-content">
            <p class="content-text">${this.content}</p>
            

            ${
              this.imageurl
                ? `<img class="content-image" src="${this.imageurl}" alt="Post image">`
                : ""
            }

            ${
              this.gameid &&
              `
              <div class="game-tag">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M2 12a10 10 0 0 1 20 0c0 3.87-2.29 7.21-5.59 8.73-.66.3-1.41-.1-1.41-.82v-.26c0-.46-.25-.87-.66-1.09a4.002 4.002 0 0 0-4.68 0c-.4.22-.66.63-.66 1.09v.26c0 .72-.75 1.12-1.41.82A9.996 9.996 0 0 1 2 12zm6-1a1 1 0 1 0 0 2H9v1a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1V10a1 1 0 1 0-2 0v1H8zm8.5 1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm2 2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="currentColor"/>
              <small>${game?.title}</small>
              </div>
            </svg>
              `
            }
          </div>

          <div class="post-actions">
            <div class="action-btn like-btn ${isLiked ? "active" : ""}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>${this.likes}</span>
            </div>
            <div class="action-btn comment-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
              </svg>
              <span>${this.comments}</span>
            </div>
            <div class="action-btn save-btn ${isSaved ? "active" : ""}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
              </svg>
              <span>${this.saves}</span>
            </div>
          </div>
        </div>
      `;
    }
  }

  disconnectedCallback() {}
}

export default PostCard;
