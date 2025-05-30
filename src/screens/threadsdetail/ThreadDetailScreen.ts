import { appState } from "../../Flux/store"; // Estado global de la aplicación
import { addComment } from "../../Flux/action"; // Acción para agregar un comentario
import "../../components/post/PostCard"; // Componente para mostrar posts
import "../../components/comment/CommentCard"; // Componente para mostrar comentarios
import threadDetailStyles from "./ThreadDetailScreen.css"; // Estilos para esta pantalla
import { navigate } from "../../Flux/action"; // Acción para cambiar de pantalla
import { Screens } from "../../types/navigation"; // Constantes con nombres de pantallas

class ThreadDetailScreen extends HTMLElement {
  constructor() {
    super();
    // Creamos un Shadow DOM para aislar estilos y estructura
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render(); // Al insertar el componente en el DOM, dibujamos la pantalla

    // Buscamos el formulario de comentarios para capturar su evento submit
    const commentForm = this.shadowRoot?.querySelector("#comment-form");
    commentForm?.addEventListener("submit", this.handleCommentSubmit.bind(this));
  }

  // Maneja el envío del formulario de comentario
  handleCommentSubmit(e: Event) {
    e.preventDefault();

    const state = appState.get();
    if (!state.currentPostId) return; // Si no hay post seleccionado, no hacemos nada

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const commentContent = formData.get("comment-content") as string;

    if (commentContent.trim()) {
      // Agrega el comentario a través de la acción
      addComment(state.currentPostId, commentContent);
      form.reset(); // Limpia el formulario
      this.render(); // Redibuja para mostrar el nuevo comentario
    }
  }

  // Muestra el post seleccionado
  renderPost() {
    const state = appState.get();
    if (!state.currentPostId) return "";

    const post = state.posts.find(p => p.id === state.currentPostId);
    if (!post) return "<p>Post not found</p>";

    return `
      <div class="thread-post">
        <post-card
          postid="${post.id}"
          userid="${post.userId}"
          username="${post.username}"
          pfp="${post.profilePicture}"
          content="${post.content}"
          ${post.imageUrl ? `imageurl="${post.imageUrl}"` : ''}
          likes="${post.likes}"
          reposts="${post.reposts}"
          comments="${post.comments}"
          saves="${post.saves}"
          timestamp="${post.timestamp}"
          ${post.gameId ? `gameid="${post.gameId}"` : ''}
          isliked="${post.isLiked || false}"
          issaved="${post.isSaved || false}">
        </post-card>
      </div>
    `;
  }

  // Muestra los comentarios relacionados con el post
  renderComments() {
    const state = appState.get();
    if (!state.currentPostId) return "";

    // Filtramos solo los comentarios del post actual
    const postComments = state.comments.filter(c => c.postId === state.currentPostId);

    // Si no hay comentarios, mostramos mensaje
    if (postComments.length === 0) {
      return `
        <div class="no-comments">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      `;
    }

    // Si hay comentarios, los mostramos usando <comment-card>
    return postComments.map(comment => `
      <comment-card
        commentid="${comment.id}"
        postid="${comment.postId}"
        userid="${comment.userId}"
        username="${comment.username}"
        pfp="${comment.profilePicture}"
        content="${comment.content}"
        likes="${comment.likes}"
        timestamp="${comment.timestamp}">
      </comment-card>
    `).join("");
  }

  // Muestra el formulario para agregar comentarios solo si el usuario está autenticado
  renderCommentForm() {
    const state = appState.get();

    if (!state.isAuthenticated) {
      // Si no está autenticado, pedimos que inicie sesión para comentar
      return `
        <div class="login-to-comment">
          <p>Log in to leave a comment</p>
        </div>
      `;
    }

    // Formulario para ingresar comentario con avatar y nombre de usuario
    return `
      <form id="comment-form" class="comment-form">
        <div class="form-group">
          <div class="user-info">
            <img src="${state.currentUser?.profilePicture}" alt="${state.currentUser?.username}">
            <span>${state.currentUser?.username}</span>
          </div>
          <textarea name="comment-content" placeholder="Add a comment..." required></textarea>
        </div>
        <button type="submit" class="comment-btn">Post Comment</button>
      </form>
    `;
  }

  render() {
    if (this.shadowRoot) {
      // Armamos toda la estructura de la pantalla
      this.shadowRoot.innerHTML = `
        <style>${threadDetailStyles}</style>
        <div class="thread-detail-container">
          <div class="thread-content">
            <div class="back-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>Back to threads</span>
            </div>

            ${this.renderPost()}

            <div class="comments-section">
              <h3>Comments</h3>

              ${this.renderCommentForm()}

              <div class="comments-list">
                ${this.renderComments()}
              </div>
            </div>
          </div>

          <div class="related-posts">
            <h3>Related Posts</h3>
            <p>Coming soon...</p>
          </div>
        </div>
      `;

      // Evento para volver a la lista de threads al pulsar "Back"
      const backButton = this.shadowRoot.querySelector(".back-button");
      backButton?.addEventListener("click", () => {
       navigate(Screens.THREADS);
      });
    }
  }

  disconnectedCallback() {
    // Aquí se pueden limpiar eventos si fuera necesario para evitar fugas de memoria
  }
}

export default ThreadDetailScreen;
