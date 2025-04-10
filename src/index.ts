import ImageInfoComponent from './components/FeedComponents/ThreadsComponent'
import FeedPage from './pages/FeedPage'
import TopGamesComponent from './components/FeedComponents/TopGamescomponent';
import navBarComponent from './components/navBarComponent/NavBarComponent';

customElements.define('navBar', navBarComponent);
customElements.define('topgames-info' , TopGamesComponent)
customElements.define('image-info', ImageInfoComponent);
customElements.define('feed-page', FeedPage);
console.log("uwu")