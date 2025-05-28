import { appState } from "../../store";
import { navigate } from "../../store/action";
import { Screens } from "../../types/navigation";

export enum GameAttributes {
  ID = "gameid",
  TITLE = "title",
  CATEGORY = "category",
  IMAGE_URL = "imageurl",
  RATING = "rating",
}

class GameCard extends HTMLElement {
  gameid?: string;
  title: string = "";
  category?: string;
  imageurl?: string;
  rating?: string;

  static get observedAttributes() {
    return Object.values(GameAttributes);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      (this as any)[name] = newValue;
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

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
    const styles = `
      :host {
        display: block;
        font-family: 'Inter', sans-serif;
      }

      .game-card {
        background-color: #1e1e1e;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .game-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
      }

      .game-image-container {
        position: relative;
        height: 180px;
        overflow: hidden;
      }

      .game-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }

      .game-card:hover .game-image {
        transform: scale(1.05);
      }

      .game-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .game-card:hover .game-overlay {
        opacity: 1;
      }

      .view-more {
        background-color: #7e57c2;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.9rem;
        font-weight: 600;
        transform: translateY(20px);
        transition: transform 0.3s ease;
      }

      .game-card:hover .view-more {
        transform: translateY(0);
      }

      .game-info {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }

      .game-title {
        margin: 0 0 0.5rem;
        color: #e0e0e0;
        font-size: 1.1rem;
        font-weight: 600;
      }

      .game-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
      }

      .game-category {
        color: #7e57c2;
        font-size: 0.85rem;
        font-weight: 500;
        padding: 0.2rem 0.6rem;
        background-color: rgba(126, 87, 194, 0.1);
        border-radius: 4px;
      }

      .game-rating {
        display: flex;
        align-items: center;
      }

      .star {
        color: #616161;
        font-size: 1rem;
        margin-left: 2px;
      }

      .star.filled {
        color: #ffd600;
      }

      .star.half {
        position: relative;
        color: #616161;
      }

      .star.half:before {
        content: '★';
        position: absolute;
        color: #ffd600;
        width: 50%;
        overflow: hidden;
      }

      @media (max-width: 768px) {
        .game-image-container {
          height: 150px;
        }

        .game-title {
          font-size: 1rem;
        }

        .game-category {
          font-size: 0.8rem;
        }

        .star {
          font-size: 0.9rem;
        }
      }

      @media (max-width: 480px) {
        .game-image-container {
          height: 130px;
        }

        .game-info {
          padding: 0.8rem;
        }

        .game-title {
          font-size: 0.95rem;
        }

        .view-more {
          font-size: 0.8rem;
          padding: 0.4rem 0.8rem;
        }
      }
    `;

    this.shadowRoot!.innerHTML = `
      <style>${styles}</style>
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

customElements.define("game-card", GameCard);
export default GameCard;
