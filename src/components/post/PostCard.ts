import { appState } from "../../Flux/store"; // Estado global de la app
import { navigate , toggleLikePost , toggleSavePost } from "../../Flux/action"; // Funciones para cambiar pantalla, dar like y guardar posts
import { Screens } from "../../types/navigation"; // Nombres de pantallas disponibles
import postCardStyles from "./PostCard.css"; 

// Atributos que el componente va a usar y observar
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

class PostCard extends HTMLElement {
  // Propiedades donde guardamos la info que llega por atributos
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

  // Indicamos qué atributos queremos escuchar cuando cambien
  static get observedAttributes() {
    return Object.values(PostAttributes);
  }

  // Cuando un atributo cambia, actualizamos la propiedad del componente
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      (this as any)[name] = newValue;
    }
  }

  constructor() {
    super();
    // Creamos un Shadow DOM para que el componente tenga su propio "mundo" sin interferir con otros estilos
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render(); // Dibujamos la tarjeta cuando aparece en la página
    
    // Buscamos los botones y áreas donde pondremos eventos
    const postContent = this.shadowRoot?.querySelector(".post-content");
    const likeBtn = this.shadowRoot?.querySelector(".like-btn");
    const saveBtn = this.shadowRoot?.querySelector(".save-btn");
    const commentBtn = this.shadowRoot?.querySelector(".comment-btn");
    
    // Cuando se hace click en el contenido del post, navegamos a los detalles del hilo
    postContent?.addEventListener("click", () => {
      if (this.postid) {
        navigate(Screens.THREAD_DETAIL, this.postid);
        console.log('navigate from post')
      }
    });
    
    // Cuando le das like al post
    likeBtn?.addEventListener("click", (e) => {
      e.stopPropagation(); // Evitamos que el click se propague y active otros eventos
      if (this.postid && appState.get().isAuthenticated) {
        toggleLikePost(this.postid); // Cambiamos el estado de like en el post
        likeBtn.classList.add('animating'); // Añadimos clase para animación
        setTimeout(() => likeBtn.classList.remove('animating'), 300); // Quitamos la animación después de un rato
        this.render(); // Volvemos a dibujar para actualizar el botón
      } else if (!appState.get().isAuthenticated) {
        navigate(Screens.LOGIN); // Si no estás logueado, te mandamos a login
      }
    });
    
    // Cuando guardas o quitas guardado de un post
    saveBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.postid && appState.get().isAuthenticated) {
        toggleSavePost(this.postid);
        this.render();
      } else if (!appState.get().isAuthenticated) {
        navigate(Screens.LOGIN);
      }
    });
    
    // Cuando haces click en el botón para comentar, navegamos a detalles del hilo
    commentBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.postid) {
        navigate(Screens.THREAD_DETAIL, this.postid);
      }
    });
  }

  // Convierte la fecha en un texto como "5m ago" para mostrar cuánto tiempo pasó
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
      return date.toLocaleDateString();
    }
  }

  // Dibuja la tarjeta con toda la información del post
  render() {
    // Sacamos la última versión del post para tener los estados de like y guardado actualizados
    const state = appState.get();
    const updatedPost = state.posts.find(p => p.id === this.postid);
    
    // Determinamos si el post está likeado o guardado
    const isLiked = updatedPost?.isLiked || this.isliked === "true";
    const isSaved = updatedPost?.isSaved || this.issaved === "true";
    
    if (this.shadowRoot) {
      // Ponemos todo el HTML con los datos del post y los botones con sus estados
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
            <div class="action-btn save-btn ${isSaved ? 'active' : ''}">
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

  disconnectedCallback() {
  
  }
}

export default PostCard;
