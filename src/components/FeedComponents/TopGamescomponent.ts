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
        :host {
          display: block;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          box-sizing: border-box;
          padding: 1rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        h1 span {
          color: #3498db;
        }

        p {
          font-size: 1.2rem;
          color: #666;
        }

        button {
          margin: 1rem 0;
          padding: 0.7rem 1.4rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .games {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .game {
          background: #f0f0f0;
          border-radius: 10px;
          padding: 1rem;
          width: 250px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }

        .game:hover {
          transform: translateY(-5px);
        }

        .game img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .game p {
          margin-top: 0.5rem;
          font-weight: bold;
          color: #333;
        }

        /* Media Queries */
        @media (max-width: 1024px) {
          h1 {
            font-size: 2rem;
          }

          .game {
            width: 220px;
          }
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 1.8rem;
          }

          p {
            font-size: 1rem;
          }

          .games {
            gap: 1rem;
          }

          .game {
            width: 45%;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 1.5rem;
          }

          p {
            font-size: 0.9rem;
          }

          button {
            width: 100%;
          }

          .games {
            flex-direction: column;
            align-items: center;
          }

          .game {
            width: 100%;
          }
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

    this.shadowRoot!.getElementById("reloadBtn")!
      .addEventListener("click", () => this.loadAndRenderGames());
  }

  renderError() {
    this.shadowRoot!.innerHTML = `<p style="color: red;">Failed to load games.</p>`;
  }
}

export default TopGamesComponent;
