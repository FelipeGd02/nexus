class LandingComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const data = await this.loadData();
    this.render(data);
    this.addEventListeners();
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

  addEventListeners() {
    const button = this.shadowRoot?.querySelector('.see-more');
    const modal = this.shadowRoot?.querySelector('.popup');
    const closeBtn = this.shadowRoot?.querySelector('.close-popup');
    const popupContent = this.shadowRoot?.querySelector('.popup-content');
  
    button?.addEventListener('click', () => {
      modal?.classList.add('show');
    });
  
    closeBtn?.addEventListener('click', () => {
      modal?.classList.remove('show');
    });
  
    // Cerrar al hacer clic fuera del contenido del popup
    modal?.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.classList.remove('show');
      }
    });
  }

  render(games: { titulo: string; imagen: string }[]) {
    if (!this.shadowRoot) return;

    if (games.length < 3) {
      this.shadowRoot.innerHTML = `<p>Error: Not enough images to render landing page.</p>`;
      return;
    }

    const mainImage = games[0];
    const sideImages = games.slice(1, 3);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #2450A6;
          color: white;
          padding: 2rem;
        }

        .landing-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 3rem;
          max-width: 100%;
          margin: auto;
        }

        .text-content {
          flex: 1;
          color:#cbd5e1;
          max-width: 1000px;
        }

        .text-content h1 {
          font-size: 3rem;
          margin: 0;
          color: white;
          font-size: 5rem;
        }

        .text-content span {
          color:white;
          font-size: 5rem;
        }

        .text-content p {
          font-size: 1.2rem;
          line-height: 1.6;
          margin: 1rem 0;
        }

        .see-more {
          background-color: #BF3467;
          color: white;
          border: none;
          padding: 0.7rem 1.5rem;
          border-radius: 999px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button.see-more {
            width: 400px;
        }

        .see-more:hover {
          background-color: #a62d5a;
        }

        .image-grid {
          flex: 0;
          display: grid;
          grid-template-columns: 0fr 1fr;
          gap: 1rem;
        }

        .main-image {
          width: 450px;
          height: 615px;
          object-fit: cover;
          border-radius: 20px;
        }

        .side-images {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .side-images img {
          width: 400px;
          height: 300px;
          object-fit: cover;
          border-radius: 20px;
        }

        .popup {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .popup.show {
          display: flex;
        }

        .popup-content {
          background-color: #2450A6;
          color: white;
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          width: 600px;
          max-width: 90vw;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 0 20px rgba(0,0,0,0.3);
          position: relative;
        }

        .close-popup {
          position: absolute;
          top: 0.5rem;
          right: 0.8rem;
          background: #BF3467;
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .close-popup:hover {
          background-color: #a62d5a;
        }

        @media (max-width: 900px) {
          .landing-container {
            flex-direction: column;
          }

          .image-grid {
          flex: 0;
          display: grid;
          grid-template-columns: 0fr 1fr;
          gap: 1rem;
        }
          .main-image {
          width: 200px;
          height: 315px;
          object-fit: cover;
          border-radius: 20px;
        }

        .side-images {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
            .side-images img {
        width: 100%;
        height: 100%;
        }
         

          

          .popup-content {
            width: 90vw;
            max-height: 70vh;
          }
        }
      </style>

      <section class="landing-container">
        <div class="text-content">
          <h1>Welcome to Nexus <br></h1>
          <p>Your ultimate meeting point for all things gaming. Here you'll find the latest news, updates, and updates on your favorite games.</p>
          <p>But that's not all: on Nexus, you not only stay informed, but you can also connect with other gamers, share experiences, discuss strategies, and be part of a community that is passionate about gaming.</p>
          <button class="see-more">see more</button>
        </div>
        <div class="image-grid">
          <img class="main-image" src="${mainImage.imagen}" alt="${mainImage.titulo}" />
          <div class="side-images">
            ${sideImages
              .map(
                (img) =>
                  `<img src="${img.imagen}" alt="${img.titulo}" title="${img.titulo}" />`
              )
              .join("")}
          </div>
        </div>
      </section>

      <div class="popup">
        <div class="popup-content">
          <button class="close-popup">&times;</button>
          <p>
            Your ultimate meeting point for all things gaming.<br><br>
            Here you'll find the latest news, exclusive announcements, in-depth reviews, and real-time updates on your favorite games—from blockbuster titles to indie gems.<br><br>
            But that’s not all: on Nexus, you’re not just staying informed—you’re becoming part of something bigger.
            Connect with gamers from around the world, share your experiences, trade tips and strategies, and engage in meaningful conversations with a passionate, ever-growing community.<br><br>
            Whether you're a casual player or a hardcore competitor, Nexus is where your gaming journey truly levels up.
          </p>
        </div>
      </div>
    `;
  }
}

customElements.define('landing-page', LandingComponent);
export default LandingComponent;
