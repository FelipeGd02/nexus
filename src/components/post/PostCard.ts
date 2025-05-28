//!Importa el estado global de la aplicacion
import { appState } from "../../store";
//! Importa funciones que permiten navegar entre pantallas y cambiar el estado de like/save
import { navigate ,toggleLikePost ,toggleSavePost } from "../../store/action";
//! Importa el enum de pantallas disponibles
import { Screens } from "../../types/navigation";
//! Importa los estilos CSS aplicables a este componente
import postCardStyles from "./PostCard.css";

//~ Enum que define los atributos que puede recibir el componente desde el HTML
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
//~ Define un nuevo Web Component llamado PostCard
class PostCard extends HTMLElement {
  //! Propiedades internas del componente (coinciden con los atributos HTML)
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

  //! Establece qué atributos HTML debe observar el componente 
  static get observedAttributes() {
    return Object.values(PostAttributes);
  }

  //& Se llama cuando uno de los atributoos observados cambi
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      //~Actualliza la propiedad del componente con el nuevo valor
      (this as any)[name] = newValue;
    }
  }
  //! Constructor del componente que activa el Shadow DOM
  constructor() {
    super();
    this.attachShadow({ mode: "open" }); //& Crea un Shadow DOM abierto para encapsular el estilo y la estructura del componente
  }

  //~ Se ejecuta cuando el componente se inserta en el DOM
  connectedCallback() {
    this.render(); //! rENDERIZa el contendo del componente
    
    //! Obtiene referencias a los elementos del Shadow DOM
    const postContent = this.shadowRoot?.querySelector(".post-content");
    const likeBtn = this.shadowRoot?.querySelector(".like-btn");
    const saveBtn = this.shadowRoot?.querySelector(".save-btn");
    const commentBtn = this.shadowRoot?.querySelector(".comment-btn");
      
    //? Añade un evento de click al contenido del post para navegar a los detalles del hilo
    postContent?.addEventListener("click", () => {
      if (this.postid) {
        navigate(Screens.THREAD_DETAIL, this.postid);
        console.log('navigate from post')
      }
    });
    
    //? Añade eventos de click a los botones de acción
    //! Si el usuario hace click en el botón de like, se alterna el estado de like del post
    likeBtn?.addEventListener("click", (e) => {
      e.stopPropagation(); //~ Evita que el evento se propague al contenedor del contendeor del post

      //!Si el usuario esta autenticado y el post tiene ID
      if (this.postid && appState.get().isAuthenticated) {
        toggleLikePost(this.postid); //!Cambia el estado de like del post
        likeBtn.classList.add('animating');//~Agrega la animacion
        setTimeout(() => likeBtn.classList.remove('animating'), 300); //&La quita luego de 300ms
        this.render(); //~Renderiza el componente con el nuevo estado
      } else if (!appState.get().isAuthenticated) {
        //~ Si el usuario no ha iniciado sesion, redirige a la pantalla de login
        navigate(Screens.LOGIN);
      }
    });
    
    //! Evento click en el boton de comentario lo hace navegar por el detalle
    saveBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.postid && appState.get().isAuthenticated) {
        toggleSavePost(this.postid);
        this.render();
      } else if (!appState.get().isAuthenticated) {
        navigate(Screens.LOGIN);
      }
    });
    
    //! Si el usuario hace click en el boton de comentario hace que  navege a los detalles del hilo
    commentBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.postid) {
        navigate(Screens.THREAD_DETAIL, this.postid);
      }
    });
  }
  
  //&Funcion que convierte  un timestamp en un texto que se pueda leer como 5s ago 3m as ,etc
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

  //! Renderiza el contenido HTML del componente
  render() {
    const state = appState.get(); //! Coge el estado global de la aplicacion
    const updatedPost = state.posts.find(p => p.id === this.postid); //! Busca el post actualizado por el ID del usuario
    
    //~Evalua si el post tiene like o esta guardado
    const isLiked = updatedPost?.isLiked || this.isliked === "true";
    const isSaved = updatedPost?.isSaved || this.issaved === "true";
    
    //~ Si existe el shadowRoot, renderiza el contenido del componente
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
            <div class="action-btn repost-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path d="M23 20a2 2 0 01-2 2h-4a2 2 0 110-4h4a2 2 0 012 2zm-2-4H7a6 6 0 01-6-6 6 6 0 016-6h14"/>
                <path d="M18 8l3-3-3-3"/>
              </svg>
              <span>${this.reposts}</span>
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
     //!Se llamma cuando el componente se elimina del DOM
  disconnectedCallback() {
    //! Y aqui se podria limpiar  los event listeners si se hubieran almmacenado como propiedades
  }
}

//^ Exporta el componente para que pueda ser utilizado en otras partes de la aplicacion
export default PostCard;

