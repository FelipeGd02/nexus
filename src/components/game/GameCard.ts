//^ Importa la función de navegación desde el sistema Flux
import { navigate } from "../../Flux/action";

//^ Importa las constantes de pantallas (Screens) disponibles en la app
import { Screens } from "../../types/navigation";

//^ Importa los estilos del componente GameCard
import gameCardStyles from "./GameCard.css";

//* Enumera los atributos HTML que el componente <game-card> puede recibir
export enum GameAttributes {
  ID = "gameid",
  TITLE = "title",
  CATEGORY = "category",
  IMAGE_URL = "imageurl",
  RATING = "rating",
}

//* Define el componente Web personalizado <game-card>
class GameCard extends HTMLElement {
  //* Propiedades del componente (pueden venir como atributos)
  gameid?: string;
  title: string = "";
  category?: string;
  imageurl?: string;
  rating?: string;

  //! Define qué atributos del HTML debe observar el componente
  static get observedAttributes() {
    return Object.values(GameAttributes); //& Devuelve todos los atributos del enum
  }

  //* Método que se ejecuta cuando un atributo observado cambia
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
        //! Actualiza la propiedad correspondiente usando el nombre del atributo
        (this as any)[name] = newValue;
      }
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" }); //! Crea un shadow DOM para encapsular el contenido
  }

  //! Método que se ejecuta cuando el componente entra al DOM
  connectedCallback() {
    this.render(); //! Dibuja el componente en pantalla

    //! Agrega un listener de clic para navegar al listado de juegos de esa categoría
    this.shadowRoot?.querySelector(".game-card")?.addEventListener("click", () => {
      if (this.category) {
        navigate(Screens.CATEGORIES, undefined, this.category as any); //* Navega enviando la categoría como parámetro
      }
    });
  }

  //* Genera las estrellas visuales de acuerdo al rating (de 0 a 5)
  generateStars(rating?: string) {
    if (!rating) return ""; //* Si no hay rating, no muestra nada

    const ratingValue = parseFloat(rating); //* Convierte a número
    let starsHtml = "";

    for (let i = 1; i <= 5; i++) {
      if (i <= ratingValue) {
        starsHtml += '<span class="star filled">★</span>'; //* Estrella llena
      } else if (i - 0.5 <= ratingValue) {
        starsHtml += '<span class="star half">★</span>'; //* Estrella a medias (opcional si se estiliza)
      } else {
        starsHtml += '<span class="star">★</span>'; //* Estrella vacía
      }
    }

    return starsHtml; //& Devuelve el HTML con estrellas
  }

  //& Dibuja el contenido HTML del componente dentro del shadow DOM
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

//^ Exporta el componente para poder usarlo en otros archivos
export default GameCard;
