class ImageInfoComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    async connectedCallback() {
      const response = await fetch('./data.json');
      const data = await response.json();
  
      this.render(data);
    }
  
    render(data: {
      image: string;
      likes: number;
      shares: number;
      saves: number;
      comments: number;
    }) {
      this.shadowRoot!.innerHTML = `
        <style>
          .container {
            font-family: Arial, sans-serif;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            max-width: 400px;
          }
  
          img {
            width: 100%;
            border-radius: 8px;
          }
  
          .info {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
          }
  
          .info div {
            flex: 1 1 45%;
            margin: 5px 0;
          }
  
          strong {
            display: inline-block;
            width: 80px;
          }
        </style>
  
        <div class="container">
          <img src="${data.image}" alt="Imagen">
          <div class="info">
            <div><strong>👍 Me gusta:</strong> ${data.likes}</div>
            <div><strong>🔁 Compartir:</strong> ${data.shares}</div>
            <div><strong>💾 Guardar:</strong> ${data.saves}</div>
            <div><strong>💬 Comentarios:</strong> ${data.comments}</div>
          </div>
        </div>
      `;
    }
  }
  
  export default ImageInfoComponent;
  