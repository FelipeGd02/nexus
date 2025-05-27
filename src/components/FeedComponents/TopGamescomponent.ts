//* Tipos para definir la forma de los datos JSON que vienen del archivo externo
type GameJson = {
  titulo: string;  //&nombre del juego en español desde el JSON
  imagen: string;  //&URL de la imagen desde el JSON
};

//* Tipo usado dentro del componente, ya con nombres en inglés y consistentes
export type Game = {
  title: string;   //!nombre del juego en inglés
  imgSrc: string;  // URL de la imagen del juego
};

//! Definición del componente web personalizado <top-games-component>
class TopGamesComponent extends HTMLElement {
  constructor() {
    super(); // Llama al constructor de HTMLElement
    this.attachShadow({ mode: "open" }); 
    //* Crea un Shadow DOM abierto para encapsular estilos y estructura
  }

  //* Método del ciclo de vida del Web Component: se ejecuta cuando se agrega al DOM
  connectedCallback() {
    this.loadAndRenderGames(); // Llama a función que carga y renderiza los juegos
  }

  //* Método asíncrono que carga los juegos desde un archivo JSON y los renderiza
  async loadAndRenderGames() {
    try {
      //? Hace una petición al archivo local JSON que contiene la lista de juegos
      const response = await fetch("/data/games.json");
      const data = await response.json();

      //? Transforma cada objeto del JSON original al formato interno `Game`
      const games: Game[] = data.topGames.map((game: GameJson) => ({
        title: game.titulo,     // cambia "titulo" a "title"
        imgSrc: game.imagen     // cambia "imagen" a "imgSrc"
      }));

      this.render(games); // Llama al método para renderizar los juegos en pantalla
    } catch (error) {
      this.renderError(); // Si hay error al cargar, muestra mensaje de error
      console.error("Failed to load games:", error);
    }
  }

  //* Renderiza los juegos dentro del Shadow DOM usando innerHTML
  render(games: Game[]) {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #2450A6;
          color: #ffffff;
          padding: 1rem;
        }

        h1 {
          font-size: 3.8rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        h1 span {
          color: #BF3467; // Color especial para la palabra "top"
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
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); // diseño responsive con tarjetas
          gap: 2rem;
          justify-items: center;
        }

        .game {
          background-color: #BF3467;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          max-width: 350px;
          width: 100%;
        }

        .game:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35); // animación al hacer hover
        }

        .game img {
          width: 100%;
          height: 320px;
          object-fit: cover; // para que la imagen no se deforme
          display: block;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
        }

        .game p {
          text-align: center;
          padding: 0.5rem;
          font-weight: 600;
          font-size: 1.05rem;
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

      <p class="subtitle">
        Here you will find a list of games which may be to your liking...
        (texto descriptivo sobre los juegos)
      </p>

      <div class="games">
        ${games.map((game) => `
          <div class="game">
            <img src="${game.imgSrc}" alt="${game.title}" />
            <p>${game.title}</p>
          </div>
        `).join("")}
      </div>
    `;
  }

  //* Método para renderizar un mensaje de error si algo falla al cargar los datos
  renderError() {
    this.shadowRoot!.innerHTML = `
      <p style="color: red; text-align: center;">Failed to load games.</p>
    `;
  }
}

export default TopGamesComponent; // Permite importar el componente en otros archivos

