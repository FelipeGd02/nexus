//! Importa el estado global de la aplicación
import { appState } from "../../store";

//! Importa la función para navegar entre pantallas
import { navigate } from "../../store/action";

//! Importa el enum con las rutas/pantallas disponibles
import { Screens } from "../../types/navigation";

//! Importa el servicio que gestiona las operaciones en Firebase
import { firebaseService } from "../../services/firebase";

//! Importa los estilos CSS del componente CreatePost
import createPostStyles from "./CreatePost.css";

//& Define un nuevo Web Component llamado CreatePost
class CreatePost extends HTMLElement {
  
  //& Constructor del componente
  constructor() {
    super(); //& Llama al constructor de HTMLElement
    this.attachShadow({ mode: "open" }); //& Adjunta un Shadow DOM abierto al componente
  }

  //? Método que se ejecuta cuando el componente se agrega al DOM
  connectedCallback() {
    this.render(); //? Renderiza el contenido del componente

    //! Obtiene referencias al formulario y al enlace de login en el Shadow DOM
    const form = this.shadowRoot?.querySelector("form");
    const loginLink = this.shadowRoot?.querySelector("#login-link");

    //! Asocia el evento de submit del formulario al método handleSubmit
    form?.addEventListener("submit", this.handleSubmit.bind(this));

    //! Si hay un enlace de login, asocia el evento de click para navegar a la pantalla de login
    loginLink?.addEventListener("click", () => navigate(Screens.LOGIN));
  }

  //! Maneja el envío del formulario para crear una nueva publicación
  async handleSubmit(e: Event) {
    e.preventDefault(); //& Previene el comportamiento por defecto del formulario

    const state = appState.get(); //& Obtiene el estado actual

    //& Si el usuario no está autenticado, termina la función
    if (!state.currentUser) return;

    //?Extrae los datos del formulario
    const formData = new FormData(e.target as HTMLFormElement);
    const content = formData.get("content") as string;
    const imageUrl = formData.get("imageUrl") as string;

    //? Si hay contenido, crea el objeto de nueva publicación
    if (content.trim()) {
      const newPost = {
        id: `p${Date.now()}`, //^ ID único basado en timestamp
        userId: state.currentUser.id, //^ ID del usuario actual
        username: state.currentUser.username, //^ Nombre de usuario
        profilePicture: state.currentUser.profilePicture, //^ Foto de perfil
        content: content.trim(), //^ Contenido del post
        imageUrl: imageUrl.trim() || undefined, //^ URL de imagen si existe
        likes: 0, //^ Contador inicial de likes
        reposts: 0, //^ Contador inicial de reposts
        comments: 0, //^ Contador inicial de comentarios
        saves: 0, //^ Contador inicial de guardados
        timestamp: new Date().toISOString() //^ Fecha y hora de creación
      };

      try {
        //& Llama al servicio de Firebase para guardar la publicación
        await firebaseService.createPost(newPost);

        //& Reinicia el formulario tras la creación exitosa
        (e.target as HTMLFormElement).reset();
      } catch (error) {
        //& Muestra errores en consola y en alerta al usuario
        console.error("Failed to create post:", error);
        alert("Failed to create post. Please try again.");
      }
    }
  }

  //! Método para renderizar el HTML del componente
  render() {
    const state = appState.get(); //& Obtiene el estado actual

    //! Si el Shadow DOM existe, genera el contenido HTML
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${createPostStyles}</style> 
        ${state.isAuthenticated ? ` 
          <div class="create-post">
            <div class="create-post-header">
              <img src="${state.currentUser?.profilePicture}" alt="${state.currentUser?.username}" class="user-avatar">
            </div>
            <form class="post-form">
              <div class="input-group">
                <textarea name="content" placeholder="What's on your mind?" required></textarea>
              </div>
              <div class="input-group">
                <input type="url" name="imageUrl" placeholder="Image URL (optional)">
              </div>
              <div class="post-actions">
                <button type="reset" class="post-button secondary">Clear</button>
                <button type="submit" class="post-button primary">Post</button>
              </div>
            </form>
          </div>
        ` : ` 
          <div class="create-post">
            <div class="login-prompt">
              <p>Please <a id="login-link">log in</a> to create a post</p>
            </div>
          </div>
        `}
      `;
    }
  }

  //^ Método que se ejecuta cuando el componente se elimina del DOM
  disconnectedCallback() {
    const form = this.shadowRoot?.querySelector("form");

    //^ Elimina el event listener del formulario (aunque esto no es del todo correcto al usar bind, lo explicamos si quieres)
    form?.removeEventListener("submit", this.handleSubmit.bind(this));
  }
}

//! Exporta el componente para su uso en otros archivos
export default CreatePost;


//* Linea 34 Para que sirve el form?.addEventListener("submit", this.handleSubmit.bind(this));
//*Cuando el usuario lo envíe (haga clic en 'Post'), llama a la función handleSubmit para manejar lo que pasa. 

//* ek .bind(this) es como si le dijera al usuario Ey, no te olvides que esta función es parte del componente CreatePost

//*asegura que la función sepa a qué componente pertenece cuando se ejecute.