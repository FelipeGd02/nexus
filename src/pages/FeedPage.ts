class FeedPage extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
   
    render() {
      this.shadowRoot!.innerHTML = `
        <image-info></image-info>
      `;
    }
  }
  
  export default FeedPage;
  