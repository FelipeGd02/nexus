type GameJson = {
  titulo: string;
  imagen: string;
};


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
      const response = await fetch("/data/games.json"); 
      const data = await response.json();

      
      const games: Game[] = data.topGames.map((game: GameJson) => ({
        title: game.titulo,
        imgSrc: game.imagen
      }));

      this.render(games);
    } catch (error) {
      this.renderError();
      console.error("Failed to load games:", error);
    }
  }

  render(games: Game[]) {
    this.shadowRoot!.innerHTML = `
      <style>
        /* ... tus estilos aquí (omitidos para claridad) ... */
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

    this.shadowRoot!.getElementById("reloadBtn")!
      .addEventListener("click", () => this.loadAndRenderGames());
  }

  renderError() {
    this.shadowRoot!.innerHTML = `<p style="color: red;">Failed to load games.</p>`;
  }
}

customElements.define("top-games", TopGamesComponent);
export default TopGamesComponent;
