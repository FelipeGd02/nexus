import { appState } from "../../Flux/store"; //^ Estado global de la app
import { navigate , toggleLikePost , toggleSavePost } from "../../Flux/action"; //^ Funciones para cambiar pantalla, dar like y guardar posts
import { Screens } from "../../types/navigation"; //^ Nombres de pantallas disponibles
import postCardStyles from "./PostCard.css"; //^ Estilos CSS para el componente

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
  IS_SAVED = "issaved"
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
      (this as any)[name] = newValue; //! Asignación dinámica usando el nombre del atributo
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

    //* Cuando se hace click en el contenido del post
    postContent?.addEventListener("click", () => {
      if (this.postid) {
        navigate(Screens.THREAD_DETAIL, this.postid); //* Navega al detalle del hilo
        console.log('navigate from post');
      }
    });

    //! Al hacer clic en like
    likeBtn?.addEventListener("click", (e) => {
      e.stopPropagation(); //! Evita que el evento afecte al contenedor
      if (this.postid && appState.get().isAuthenticated) {
        toggleLikePost(this.postid); //! Cambia el estado de like
        likeBtn.classList.add('animating'); //! Agrega animación
        setTimeout(() => likeBtn.classList.remove('animating'), 300); //! Remueve la animación luego de 300ms
        this.render(); //! Vuelve a dibujar la tarjeta
      } else if (!appState.get().isAuthenticated) {
        navigate(Screens.LOGIN); //! Si no está autenticado, lo manda al login
      }
    });

    //& Al hacer clic en guardar
    saveBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.postid && appState.get().isAuthenticated) {
        toggleSavePost(this.postid); //& Cambia el estado de guardado
        this.render(); //& Actualiza el componente
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
    const updatedPost = state.posts.find(p => p.id === this.postid); // &Busca el post actualizado

    const isLiked = updatedPost?.isLiked || this.isliked === "true"; //& Verifica si está likeado
    const isSaved = updatedPost?.isSaved || this.issaved === "true"; // &Verifica si está guardado

    if (this.shadowRoot) {
      //! Construye el HTML del componente con datos dinámicos
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
    //! Aquí podrías remover listeners si lo hubiera guardado con .bind()
  }
}

export default PostCard; //^ Exporta el componente para que pueda ser usado en otros archivos

//! Desde linea 154 a 167 son los iconos SVG que se usan en los botones de acción

//^ Este archivo define un Web Component llamado <post-card> que representa 
//^una tarjeta de publicación (post) dentro de una red social o aplicación Que es Nexus
//^tipo foro. Muestra el contenido del post, la imagen del usuario, y 
//^permite interactuar con él mediante botones de like, comentario y guardado, usando acciones definidas en el sistema Flux. El componente reacciona a cambios de atributos, se conecta con el estado global, y encapsula su estructura y estilo usando Shadow DOM.