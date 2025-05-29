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
    return Object.values(GameAttributes);
  }

  // Handle attribute changes
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
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

  render() {
    if (this.shadowRoot) {
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


export default GameCard;