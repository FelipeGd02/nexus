import ImageInfoComponent from './components/FeedComponents/ThreadsComponent'
import FeedPage from './pages/FeedPage'
import TopGamesComponent from './components/FeedComponents/TopGamescomponent';
import NavBarComponent from './components/navBarComponent/NavBarComponent';
import LandingComponent from './components/landingComponent/landingComponent';

customElements.define('navbar-page', NavBarComponent);
customElements.define('landing-page', LandingComponent);
customElements.define('topgames-info' , TopGamesComponent)
customElements.define('image-info', ImageInfoComponent);
customElements.define('feed-page', FeedPage);