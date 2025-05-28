import AppHeader from './components/header/Header';
import { AppContainer } from './components/root/Root';
import AuthScreen from './screens/auth/AuthScreen';
import CategoriesScreen from './screens/categories/CategoriesScreen';
import CommunityScreen from './screens/community/CommunityScreen';
import LandingScreen from './screens/landing/LandingScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import ThreadDetailScreen from './screens/threadsdetail/ThreadDetailScreen';
import ThreadsScreen from './screens/threads/ThreadsScreen';
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