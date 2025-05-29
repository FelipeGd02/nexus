import { navigate } from "../../Flux/action"; // Función para cambiar de pantalla en la app
import { Screens } from "../../types/navigation"; // Enum con los nombres de las pantallas disponibles
import gameCardStyles from "./GameCard.css"; 

// Estos son los atributos que el componente usará 
export enum GameAttributes {
  ID = "gameid",
  TITLE = "title",
  CATEGORY = "category",
  IMAGE_URL = "imageurl",
  RATING = "rating",
}

class GameCard extends HTMLElement {
  // Aquí guardamos la info que recibimos como atributos
  gameid?: string;
  title: string = ""; // Título del juego, empieza vacío
  category?: string;
  imageurl?: string;
  rating?: string;

  // Decimos cuáles atributos queremos que el componente vigile para saber si cambian
  static get observedAttributes() {
    return Object.values(GameAttributes);
  }

  // Cuando alguno de esos atributos cambia, actualizamos la propiedad correspondiente
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      // Solo actualizamos si es uno de los atributos que conocemos
      if (
        name === GameAttributes.ID ||
        name === GameAttributes.TITLE ||
        name === GameAttributes.CATEGORY ||
        name === GameAttributes.IMAGE_URL ||
        name === GameAttributes.RATING
      ) {
        (this as any)[name] = newValue;
      }
    }
  }

  constructor() {
    super();
    // Creamos un Shadow DOM para que el componente tenga su propio espacio, sin afectar el resto
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render(); // Cuando el componente aparece en la página, lo dibujamos
    
    // Buscamos el div principal para ponerle un click
    this.shadowRoot?.querySelector(".game-card")?.addEventListener("click", () => {
      if (this.category) {
        // Si sabemos la categoría, navegamos a la pantalla de categorías, pasando esa info
        navigate(Screens.CATEGORIES, undefined, this.category as any);
      }
    });
  }

  // Esta función crea el HTML para mostrar las estrellas según el rating que tenga el juego
  generateStars(rating?: string) {
    if (!rating) return ""; // Si no hay rating, no mostramos nada
    
    const ratingValue = parseFloat(rating); // Convertimos el rating a número
    let starsHtml = "";
    
    // Vamos a llenar 5 estrellas, llenas, medias o vacías según el rating
    for (let i = 1; i <= 5; i++) {
      if (i <= ratingValue) {
        starsHtml += '<span class="star filled">★</span>'; // Estrella llena
      } else if (i - 0.5 <= ratingValue) {
        starsHtml += '<span class="star half">★</span>'; // Estrella media
      } else {
        starsHtml += '<span class="star">★</span>'; // Estrella vacía
      }
    }
    
    return starsHtml; // Devolvemos el código HTML con las estrellas
  }

  // Aquí creamos el contenido visible de la tarjeta con los datos que tenemos
  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${gameCardStyles}</style> <!-- Aplicamos los estilos -->
        <div class="game-card">
          <div class="game-image-container">
            <img src="${this.imageurl}" alt="${this.title}" class="game-image"> <!-- Imagen del juego -->
            <div class="game-overlay">
              <span class="view-more">View Games</span> <!-- Texto que aparece encima de la imagen -->
            </div>
          </div>
          <div class="game-info">
            <h3 class="game-title">${this.title}</h3> <!-- Título del juego -->
            <div class="game-meta">
              <span class="game-category">${this.category}</span> <!-- Categoría a la que pertenece -->
              <div class="game-rating">${this.generateStars(this.rating)}</div> <!-- Las estrellas de rating -->
            </div>
          </div>
        </div>
      `;
    }
  }
}

export default GameCard;
