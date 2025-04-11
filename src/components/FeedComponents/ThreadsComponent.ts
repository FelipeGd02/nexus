class ImageInfoComponent extends HTMLElement {
  private threads: {
    image: string;
    likes: number;
    shares: number;
    saves: number;
    comments: number;
  }[] = [];

  private visibleCount = 4;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const response = await fetch('/data/threads.json');
    const data = await response.json();
    this.threads = data.threads;
    this.render();
    this.attachButtonListeners();
  }

  attachButtonListeners() {
    const buttons = this.shadowRoot!.querySelectorAll('button[data-type]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const type = (e.currentTarget as HTMLElement).dataset.type;
        const id = (e.currentTarget as HTMLElement).dataset.id;
        btn.classList.add('clicked');
        setTimeout(() => btn.classList.remove('clicked'), 300);
        alert(`Button "${type}" clicked on thread ID: ${id}`);
      });
    });

    const toggleBtn = this.shadowRoot!.getElementById('toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isShowingAll = this.visibleCount >= this.threads.length;
        if (isShowingAll) {
          this.visibleCount = 4;
        } else {
          this.visibleCount = Math.min(this.visibleCount + 4, this.threads.length);
        }
        this.render();
        this.attachButtonListeners();
      });
    }
  }

  render() {
    const visibleThreads = this.threads.slice(0, this.visibleCount);
    const isAllVisible = this.visibleCount >= this.threads.length;

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

      .subtitle {
        font-size: 1.2rem;
        color: #cbd5e1;
        margin-bottom: 3rem;
        max-width: 1000px;
        text-align: left;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr); 
        gap: 1.5rem;
        justify-items: center;
      }

      .card {
        background-color: #BF3467;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        width: 100%;
        max-width: 900px;
        color: #ffffff;
        display: flex;
        flex-direction: column;
      }

      .card:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
      }

      .card img {
        width: 100%;
        height: 350px;
        object-fit: cover;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
      }

      .buttons {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        gap: 1rem;
        background-color: #BF3467;
        margin-top: auto;
        flex-wrap: nowrap;
      }

      .btn-action {
        flex: 1 1 auto;
        background: #ffffff20;
        color: #ffffff;
        border: none;
        font-size: 1.1rem;
        border-radius: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.3s ease, background-color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem 1.2rem;
        min-width: 100px;
      }

.btn-action:hover {
  background-color: #ffffff30;
  transform: translateY(-2px) scale(1.05);
}


      .btn-action:hover {
        color: #f1f1f1;
        transform: scale(1.05);
      }

      .btn-action.clicked {
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

      .toggle-container {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
      }

      .toggle-btn {
        background-color: #BF3467;
        color: #ffff;
        border: none;
        padding: 0.8rem 1.5rem;
        font-size: 1rem;
        border-radius: 12px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .toggle-btn:hover {
        background-color: #ffff;
        color:#BF3467 ;
      }

      @media (max-width: 768px) {
        h1 {
          font-size: 2rem;
        }

        .subtitle {
          font-size: 1rem;
        }

        .grid {
          grid-template-columns: 1fr;
        }

        .btn-action {
          font-size: 0.9rem;
          padding: 0.6rem;
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


      @media (max-width: 768px) {
        .buttons {
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.7rem;
          padding: 0.8rem;
        }

        .btn-action {
          font-size: 0.9rem;
          padding: 0.7rem 1rem;
          min-width: 90px;
          flex: 1 1 40%;
        }
      }

      @media (max-width: 480px) {
        .buttons {
          flex-direction: column;
          align-items: stretch;
          gap: 0.5rem;
        }

        .btn-action {
          font-size: 0.85rem;
          padding: 0.6rem 0.9rem;
          min-width: unset;
          width: 100%;
          flex: 1 1 auto;
        }
      }

    </style>

    <h1>Threads</h1>
    <p class="subtitle">Here you will find a list of games which Users can create short posts of up to 280 characters, where they can share thoughts, news, opinions, or updates about video games...</p>
    <div class="grid">
      ${visibleThreads
        .map(
          (data, index) => `
            <div class="card">
              <img src="${data.image}" alt="Thread Image">
              <div class="buttons">
                <button class="btn-action" data-type="like" data-id="${index}">
                  ${this.heartIcon()} ${data.likes}
                </button>
                <button class="btn-action" data-type="share" data-id="${index}">
                  ${this.shareIcon()} ${data.shares}
                </button>
                <button class="btn-action" data-type="save" data-id="${index}">
                  ${this.saveIcon()} ${data.saves}
                </button>
                <button class="btn-action" data-type="comment" data-id="${index}">
                  ${this.commentIcon()} ${data.comments}
                </button>
              </div>
            </div>
          `
        )
        .join('')}
    </div>

    <div class="toggle-container">
      <button id="toggle-btn" class="toggle-btn">
        ${isAllVisible ? 'Less Info' : 'More Info'}
      </button>
    </div>
    `;
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

customElements.define("image-info", ImageInfoComponent);
export default ImageInfoComponent;