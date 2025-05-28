import AppHeader from './components/header/Header';
import { AppContainer } from './components/root/Root';
import AuthScreen from './screens/auth/AuthScreen';
import CategoriesScreen from './screens/categories/CategoriesScreen';
import CommunityScreen from './screens/community/community-screen';
import LandingScreen from './screens/landing/landing-screen';
import ProfileScreen from './screens/profile/profile-screen';
import ThreadDetailScreen from './screens/threadsdetail/threads-detail-screen';
import ThreadsScreen from './screens/threads/threads-screen';
import EditProfileModal from './components/profile/EditProfileModal';
import CreatePost from './components/post/CreatePost';

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