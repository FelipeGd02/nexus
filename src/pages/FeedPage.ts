import Navbar from "../components/navBarComponent/NavBarComponent";
class FeedPage extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
   
    render() {
      this.shadowRoot!.innerHTML = `
        <navBar></navBar>
        <image-info></image-info>
      `;
    }
  }
  
  export default FeedPage;
  customElements.define('feed-page', FeedPage);