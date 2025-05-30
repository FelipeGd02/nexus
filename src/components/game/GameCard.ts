import { navigate } from "../../Flux/action";
import { Screens } from "../../types/navigation";
import gameCardStyles from "./GameCard.css";

export enum GameAttributes {
  ID = "gameid",
  TITLE = "title",
  CATEGORY = "category",
  IMAGE_URL = "imageurl",
  RATING = "rating",
}

class GameCard extends HTMLElement {
  // Properties
  gameid?: string;
  title: string = "";
  category?: string;
  imageurl?: string;
  rating?: string;

  // Observed attributes
  static get observedAttributes() {
    return Object.values(GameAttributes); //& Devuelve todos los atributos del enum
  }

  // Handle attribute changes
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    //! Verifica si el nuevo valor es diferente al anterior
    if (oldValue !== newValue) {
      if (
        name === GameAttributes.ID ||
        name === GameAttributes.TITLE ||
        name === GameAttributes.CATEGORY ||
        name === GameAttributes.IMAGE_URL ||
        name === GameAttributes.RATING
      ) {
        //! Actualiza la propiedad del componente correspondiente al atributo
        //! Usa [name] como índice dinámico y "as any" para evitar errores de tipos
        (this as any)[name] = newValue;
      }
    }
  }


  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    
    // Event listeners
    this.shadowRoot?.querySelector(".game-card")?.addEventListener("click", () => {
      if (this.category) {
        navigate(Screens.CATEGORIES, undefined, this.category as any);
      }
    });
  }

  generateStars(rating?: string) {
    if (!rating) return "";
    
    const ratingValue = parseFloat(rating);
    let starsHtml = "";
    
    for (let i = 1; i <= 5; i++) {
      if (i <= ratingValue) {
        starsHtml += '<span class="star filled">★</span>';
      } else if (i - 0.5 <= ratingValue) {
        starsHtml += '<span class="star half">★</span>';
      } else {
        starsHtml += '<span class="star">★</span>';
      }
    }
    
    return starsHtml;
  }

  // Aquí creamos el contenido visible de la tarjeta con los datos que tenemos
  render() {
    if (this.shadowRoot) {
      //& Define el HTML del componente usando las propiedades actuales
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