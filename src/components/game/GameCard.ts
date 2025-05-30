import { navigate } from "../../Flux/action"; //^ Importa la función de navegación para cambiar de pantalla
import { Screens } from "../../types/navigation"; //^ Importa las constantes que representan las diferentes pantallas
import gameCardStyles from "./GameCard.css"; //^ Importa los estilos CSS del componente GameCard

// Enum que define los atributos HTML que este componente puede observar y utilizar
export enum GameAttributes {
  ID = "gameid",
  TITLE = "title",
  CATEGORY = "category",
  IMAGE_URL = "imageurl",
  RATING = "rating",
}

class GameCard extends HTMLElement {
  //! Propiedades que serán asignadas desde atributos HTML
  gameid?: string;
  title: string = ""; //& Título del juego
  category?: string; //& Categoría del juego (ej: acción, estrategia...)
  imageurl?: string; //& URL de la imagen del juego
  rating?: string; //& Calificación del juego (ej: 4.5)

  //& Especifica qué atributos del HTML observar para detectar cambios
  static get observedAttributes() {
    return Object.values(GameAttributes); //& Devuelve todos los atributos del enum
  }
   //* Se ejecuta cuando alguno de los atributos observados cambia
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    //! Verifica si el nuevo valor es diferente al anterior
    if (oldValue !== newValue) {
      //* Si el atributo que cambió es uno de los definidos en GameAttributes
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
    this.attachShadow({ mode: "open" }); //* Crea un Shadow DOM para encapsular HTML y CSS
  }

  connectedCallback() {
    this.render(); //& Renderiza el componente

    //& Añade un listener al contenedor de la tarjeta para manejar clics
    this.shadowRoot?.querySelector(".game-card")?.addEventListener("click", () => {
      if (this.category) {
        //& Si el juego tiene categoría, navega a la pantalla de categorías
        navigate(Screens.CATEGORIES, undefined, this.category as any);
      }
    });
  }

  //& Genera visualmente las estrellas de la calificación en base al valor numérico (string)
  generateStars(rating?: string) {
    if (!rating) return ""; //& Si no hay calificación, retorna vacío

    const ratingValue = parseFloat(rating); //& Convierte la calificación a número
    let starsHtml = "";

    for (let i = 1; i <= 5; i++) {
      if (i <= ratingValue) {
        starsHtml += '<span class="star filled">★</span>'; //! Estrella llena
      } else if (i - 0.5 <= ratingValue) {
        starsHtml += '<span class="star half">★</span>'; //! Media estrella (si aplica)
      } else {
        starsHtml += '<span class="star">★</span>'; //! Estrella vacía
      }
    }

    return starsHtml; //& Devuelve el HTML con las estrellas generadas
  }

  render() {
    if (this.shadowRoot) {
      //& Define el HTML del componente usando las propiedades actuales
      this.shadowRoot.innerHTML = `
        <style>${gameCardStyles}</style>
        <div class="game-card">
          <div class="game-image-container">
            <img src="${this.imageurl}" alt="${this.title}" class="game-image">
            <div class="game-overlay">
              <span class="view-more">View Games</span>
            </div>
          </div>
          <div class="game-info">
            <h3 class="game-title">${this.title}</h3>
            <div class="game-meta">
              <span class="game-category">${this.category}</span>
              <div class="game-rating">${this.generateStars(this.rating)}</div>
            </div>
          </div>
        </div>
      `;
    }
  }
}

export default GameCard; //^ Exporta el componente para usarlo en otros lugares del proyecto
