class ImageInfoComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const response = await fetch('/data/Threads.json');
    const data = await response.json();

    this.render(data.threads);
  }

  render(threads: {
    image: string;
    likes: number;
    shares: number;
    saves: number;
    comments: number;
  }[]) {
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

        .grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
          margin-top: 2rem;
        }

        .card {
          background: #f0f0f0;
          border-radius: 10px;
          padding: 1rem;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .card img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 8px;
        }

        .info {
          margin-top: 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
          justify-content: space-between;
        }

        .info div {
          flex: 1 1 45%;
          font-size: 1rem;
          color: #333;
        }

        strong {
          font-weight: bold;
          color: #3498db;
        }

        @media (max-width: 1024px) {
          h1 {
            font-size: 2rem;
          }

          .card {
            max-width: 340px;
          }
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 1.8rem;
          }

          p {
            font-size: 1rem;
          }

          .grid {
            gap: 1rem;
          }

          .card {
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

          .grid {
            flex-direction: column;
            align-items: center;
          }

          .card {
            width: 100%;
          }

          .info div {
            flex: 1 1 100%;
          }
        }
      </style>

      <div class="container">
        <h1><span>Thread</span></h1>
        <p>Threads only for you</p>
        <div class="grid">
          ${threads
            .map(
              (data) => `
              <div class="card">
                <img src="${data.image}" alt="Imagen">
                <div class="info">
                  <div><strong>❤ Likes:</strong> ${data.likes}</div>
                  <div><strong>🔗 Shares:</strong> ${data.shares}</div>
                  <div><strong>📌 Saves:</strong> ${data.saves}</div>
                  <div><strong>💭 Comments:</strong> ${data.comments}</div>
                </div>
              </div>
            `
            )
            .join('')}
        </div>
      </div>
    `;
  }
}

customElements.define("image-info", ImageInfoComponent);
export default ImageInfoComponent;
