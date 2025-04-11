type GameJson = {
  titulo: string;
  imagen: string;
};

export type Game = {
  title: string;
  imgSrc: string;
};

//? Cuando el componente se monta al DOM, llama a LoadRenderGames() para cargar los datos y renderizar

class TopGamesComponent extends HTMLElement { //*Crea una clase que extiende HTMLElement para crear un Web Component personalizado
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  //*Se llama al constructor de HTMLelemment (super())
  //* Se crea un Shadow DOM en modo abierto, permitido encapsular estilos y contenido

  connectedCallback() {
    this.loadAndRenderGames();
  }
//?cuando el componente se monta al DOM, llama a loadAndRenderGames() para cargar los datos y renderizar
  
  async loadAndRenderGames() {
    try {
      const response = await fetch("/data/games.json");
      const data = await response.json();

      const games: Game[] = data.topGames.map((game: GameJson) => ({
        title: game.titulo,
        imgSrc: game.imagen,
      }));

      //*Se hace un fetch a un archivo local JSON
      //!Se transforma el arreglo de GameJson a objetos Game con los nombres esperados por el componente (title, imgSrc) :V
      this.render(games);
    } catch (error) {
      this.renderError(); //*si ocurre un error al cargar los juegos, se muestran un mensaje de error estilizado .-. 
      console.error("Failed to load games:", error);
    }
  }

  render(games: Game[]) { //*pues usa el innerhtml para meter los estilos y los juegos se renderizan con una tarjeta .game con una imagen y el tiitulo y pues el @media pal responsive
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #2450A6;
          color: #ffffff;
          padding: 1rem 1rem;
        }

        h1 {
          font-size: 3.8rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        h1 span {
          color: #BF3467;
        }

        .subtitle {
          font-size: 1.2rem;
          color: #cbd5e1;
          margin-bottom: 3rem;
          max-width: 1000px; 
          text-align: left; 
        }

        .games {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          justify-items: center;
        }

        .game {
          background-color: #BF3467;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          width: 100%;
          max-width: 350px;
        }

        .game:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
        }

        .game img {
          width: 100%;
          height: 320px;
          object-fit: cover;
          display: block;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
        }

        .game p {
          text-align: center;
          padding: 0.5rem;
          font-weight: 600;
          font-size: 1.05rem;
          color: #ffffff;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 1.7rem;
          }

          .subtitle {
            font-size: 0.95rem;
          }
        }
      </style>

      <h1><span>top</span> games</h1>
      <p class="subtitle">Here you will find a list of games which may be to your liking. Each title has been carefully selected based on your preferences, offering a mix of genres, aesthetics, and gameplay experiences. Whether you're looking for fast-paced action, immersive storytelling, or creative puzzles, there's something here for everyone. Feel free to explore, and don't hesitate to dive deeper into the ones that catch your eye — your next favorite game might be just a scroll away.</p>
      <div class="games">
        ${games
          .map(
            (game) => `
          <div class="game">
            <img src="${game.imgSrc}" alt="${game.title}" />
            <p>${game.title}</p>
          </div>
        `
          )
          .join("")} //* se usa para convertir un array en un solo string, uniendo todos los elementos del array con el separador que pongas entre los paréntesis. Si usas "" (una cadena vacía), los une sin espacios ni símbolos entre ellos.
      </div>
    `;
  }

  renderError() {
    this.shadowRoot!.innerHTML = `<p style="color: red; text-align: center;">Failed to load games.</p>`;
  }
}


export default TopGamesComponent;
//!Permite usarlos en otros archivos XD