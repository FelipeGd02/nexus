export type Game = {
    title: string;
    imgSrc: string;
  };
  
  class TopGamesComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    connectedCallback() {
      this.loadAndRenderGames();
    }
  
    async loadAndRenderGames() {
      try {
        const response = await fetch("/lista.json"); // Asegúrate que esta ruta esté disponible
        const games: Game[] = await response.json();
        this.render(games);
      } catch (error) {
        this.renderError();
        console.error("Failed to load games:", error);
      }
    }
  
    render(games: Game[]) {
      this.shadowRoot!.innerHTML = `
        <style>
          .container {
            background-color: #1e40af;
            color: white;
            padding: 2rem;
            font-family: Arial, sans-serif;
          }
          h1 {
            font-size: 2.5rem;
            font-weight: bold;
          }
          h1 span {
            color: #bfdbfe;
          }
          p {
            margin-top: 0.5rem;
            font-size: 0.875rem;
          }
          button {
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
          }
          button:hover {
            background-color: #2563eb;
          }
          .games {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
          }
          .game {
            border-radius: 1rem;
            overflow: hidden;
          }
          .game img {
            width: 100%;
            height: auto;
            object-fit: cover;
            display: block;
          }
        </style>
  
        <div class="container">
          <h1>top <span>games</span></h1>
          <p>Here you will find a list of games which may be to your liking</p>
          <button id="reloadBtn">Reload Games</button>
          <div class="games">
            ${games.map(game => `
              <div class="game">
                <img src="${game.imgSrc}" alt="${game.title}" />
                <p>${game.title}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
  
      // Agregar listener al botón
      this.shadowRoot!.getElementById("reloadBtn")!
        .addEventListener("click", () => this.loadAndRenderGames());
    }
  
    renderError() {
      this.shadowRoot!.innerHTML = `<p style="color: red;">Failed to load games.</p>`;
    }
  }
  
  customElements.define("top-games", TopGamesComponent);
  export default TopGamesComponent;
  