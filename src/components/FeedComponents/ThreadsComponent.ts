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
          transition: transform 0.2s ease;
        }

        .card:hover {
          transform: translateY(-5px);
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
          justify-content: space-around;
          align-items: center;
          gap: 1rem;
          flex-wrap: nowrap;
        }

        .info button {
          flex: 1;
          font-size: 1rem;
          background: none;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
          transition: transform 0.2s ease, color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          color: #666;
        }

        .info button:hover {
          color: #3498db;
          transform: scale(1.05);
        }

        .info button.clicked {
          animation: pop 0.3s ease;
        }

        svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
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

          .info {
            gap: 0.5rem;
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

          .info {
            flex-direction: column;
            align-items: stretch;
          }

          .info button {
            width: 100%;
          }
        }
      </style>

      <div class="container">
        <h1><span>Thread</span></h1>
        <p>Threads only for you</p>
        <div class="grid">
          ${threads.map((data, index) => `
            <div class="card">
              <img src="${data.image}" alt="Imagen">
              <div class="info">
                <button data-index="${index}" data-type="likes">
                  ${this.heartIcon()} ${data.likes}
                </button>
                <button data-index="${index}" data-type="shares">
                  ${this.shareIcon()} ${data.shares}
                </button>
                <button data-index="${index}" data-type="saves">
                  ${this.saveIcon()} ${data.saves}
                </button>
                <button data-index="${index}" data-type="comments">
                  ${this.commentIcon()} ${data.comments}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.setupClickAnimations();
  }

  setupClickAnimations() {
    const buttons = this.shadowRoot!.querySelectorAll("button[data-type]");
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        button.classList.add("clicked");
        setTimeout(() => button.classList.remove("clicked"), 300);
      });
    });
  }

  heartIcon() {
    return `
      <svg viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
                 C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5 
                 c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>`;
  }

  shareIcon() {
    return `
      <svg viewBox="0 0 24 24">
        <path d="M18 16.08c-0.76 0-1.44 0.3-1.96 0.77L8.91 
                 12.7c0.05-0.23 0.09-0.47 0.09-0.7s-0.03-0.47-0.09-0.7l7.02-4.11c0.54 
                 0.5 1.25 0.81 2.07 0.81 1.66 0 3-1.34 3-3s-1.34-3-3-3 
                 -3 1.34-3 3c0 0.23 0.03 0.47 0.09 0.7L8.91 9.81C8.37 
                 9.31 7.66 9 6.84 9 5.18 9 3.84 10.34 3.84 12s1.34 
                 3 3 3c0.82 0 1.53-0.31 2.07-0.81l7.12 4.18c-0.06 
                 0.22-0.1 0.45-0.1 0.7 0 1.66 1.34 3 3 3s3-1.34 
                 3-3-1.34-3-3-3z"/>
      </svg>`;
  }

  saveIcon() {
    return `
      <svg viewBox="0 0 24 24">
        <path d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 
                 3V5a2 2 0 0 0-2-2z"/>
      </svg>`;
  }

  commentIcon() {
  return `
    <svg viewBox="0 0 24 24">
      <path d="M21 6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5l4 3v-3h5a2 2 0 0 0 2-2V6z"/>
    </svg>`;
}

}

export default ImageInfoComponent;
