type Game = {
  title: string;
  imgSrc: string;
};

const games: Game[] = [
  {
    title: "Five Nights at Freddy's: Security Breach",
    imgSrc: "/images/fnaf.png"
  },
  {
    title: "Call of Duty: Modern Warfare",
    imgSrc: "/images/codmw.png"
  },
  {
    title: "Gaming Controller",
    imgSrc: "/images/controller.png"
  },
  {
    title: "Halo",
    imgSrc: "/images/halo.png"
  }
];

class TopGamesComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const container = document.createElement("div");
    container.innerHTML = `
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
        <div class="games">
          ${games.map(game => `
            <div class="game">
              <img src="${game.imgSrc}" alt="${game.title}" />
            </div>
          `).join('')}
        </div>
      </div>
    `;
    shadow.appendChild(container);
  }
}

export default TopGamesComponent
