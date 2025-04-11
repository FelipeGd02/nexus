class LandingComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const data = await this.loadData();
    this.render(data);
  }

  async loadData() {
    try {
      const response = await fetch("data/games.json");
      const json = await response.json();
      return json.topGames || [];
    } catch (error) {
      console.error("Error loading game data:", error);
      return [];
    }
  }

  render(games: { titulo: string; imagen: string }[]) {
    if (!this.shadowRoot) return;

    if (games.length < 4) {
      this.shadowRoot.innerHTML = `<p>Error: Not enough images to render landing page.</p>`;
      return;
    }

    const mainImage = games[0];
    const sideImages = games.slice(1, 4);

    this.shadowRoot.innerHTML = `
              <style>
          :host {
              display: block;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #2450A6;
              color: #ffffff;
              padding: 1rem 1rem;
            }

          .landing-container {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            gap: 2rem;
            padding: 2rem;
            background: #2450A6;
            color: white;
          }

          .text-content {
            flex: 1;
          }

          .text-content h1 {
            font-size: 3rem;
            line-height: 1.2;
          }

          .text-content span {
            color: #BF3467;
          }

          .text-content p {
            margin: 1rem 0;
            font-size: 1.1rem;
            line-height: 1.6;
          }

          .see-more {
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background-color: #BF3467;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .image-grid {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .main-image {
            width: 100%;
            height: auto;
            border-radius: 8px;
          }

          .side-images {
            display: flex;
            gap: 0.5rem;
            justify-content: center;
          }

          .side-images img {
            width: 30%;
            height: auto;
            border-radius: 4px;
          }
        </style>

      <section class="landing-container">
        <div class="text-content">
          <h1>Welcome to <br><span>Nexus</span></h1>
          <p>Your ultimate meeting point for all things gaming...</p>
          <button class="see-more">see more</button>
        </div>
        <div class="image-grid">
          <img class="main-image" src="${mainImage.imagen}" alt="${mainImage.titulo}">
          <div class="side-images">
            ${sideImages
              .map(
                (img) => `<img src="${img.imagen}" alt="${img.titulo}" title="${img.titulo}" />`
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('landing-page', LandingComponent);
export default LandingComponent;