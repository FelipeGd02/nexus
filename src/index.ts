import AppHeader from './components/header/header';
import { AppContainer } from './components/router/router';
import AuthScreen from './screens/auth/auth-screen';
import CategoriesScreen from './screens/categories/categories-screen';
import CommunityScreen from './screens/community/community-screen';
import LandingScreen from './screens/landing/landing-screen';
import ProfileScreen from './screens/profile/profile-screen';
import ThreadDetailScreen from './screens/threadsdetail/threads-detail-screen';
import ThreadsScreen from './screens/threads/threads-screen';
import EditProfileModal from './components/profile/edit-profile-modal';
import CreatePost from './components/post/create-post';

console.log('App started');

// Register all custom elements
customElements.define('app-container', AppContainer);
customElements.define('app-header', AppHeader);
customElements.define('auth-screen', AuthScreen);
customElements.define('landing-screen', LandingScreen);
customElements.define('threads-screen', ThreadsScreen);
customElements.define('thread-detail-screen', ThreadDetailScreen);
customElements.define('categories-screen', CategoriesScreen);
customElements.define('community-screen', CommunityScreen);
customElements.define('profile-screen', ProfileScreen);
customElements.define('edit-profile-modal', EditProfileModal);
customElements.define('create-post', CreatePost);