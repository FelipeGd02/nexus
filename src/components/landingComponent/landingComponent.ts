class LandingComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    async connectedCallback() {
      const data = await this.loadData();
      this.render(data);
    }
  
    async loadData() {
      try {
        const response = await fetch("../../../public/data/games.json");
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
        <link rel="stylesheet" href="landing.css">
        <section class="landing-container">
          <div class="text-content">
            <h1>Welcome to <br><span>Nexus</span></h1>
            <p>Your ultimate meeting point for all things gaming. Here you'll find the latest news, updates, and updates on your favorite games.</p>
            <p>But that's not all: on Nexus, you not only stay informed, but you can also connect with other gamers, share experiences, discuss strategies, and be part of a community that is passionate about gaming.</p>
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
  
  customElements.define("landing-page", LandingComponent);
  export default LandingComponent;
  