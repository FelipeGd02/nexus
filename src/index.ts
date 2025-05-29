//?  IMPORTACIONES CON SUS DETALLES PARA EL APP

import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import CommentCard from './components/comment/CommentCard';

//&  Componentes de interfaz 
import AppHeader from './components/header/Header';
import { AppContainer } from './components/root/root';

//!  Pantallas principales 
import AuthScreen from './screens/auth/AuthScreen';
import CategoriesScreen from './screens/categories/CategoriesScreen';
import CommunityScreen from './screens/community/CommunityScreen';
import LandingScreen from './screens/landing/LandingScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import ThreadDetailScreen from './screens/threadsdetail/ThreadDetailScreen';
import ThreadsScreen from './screens/threads/ThreadsScreen';

//*  Componentes específicos 
import EditProfileModal from './components/profile/EditProfileModal';
import CreatePost from './components/post/CreatePost';
import PostCard from './components/post/PostCard';
import GameCard from './components/game/GameCard';

//*  INICIO DE LA APLICACIÓN 
console.log('App started');

//& REGISTRO DE CUSTOM ELEMENTS 

if (!customElements.get('app-container')) {
  customElements.define('app-container', AppContainer);
}

if (!customElements.get('app-header')) {
  customElements.define('app-header', AppHeader);
}

//!  Pantallas 
if (!customElements.get('auth-screen')) {
  customElements.define('auth-screen', AuthScreen);
}

if (!customElements.get('landing-screen')) {
  customElements.define('landing-screen', LandingScreen);
}

if (!customElements.get('threads-screen')) {
  customElements.define('threads-screen', ThreadsScreen);
}

if (!customElements.get('thread-detail-screen')) {
  customElements.define('thread-detail-screen', ThreadDetailScreen);
}

if (!customElements.get('categories-screen')) {
  customElements.define('categories-screen', CategoriesScreen);
}

if (!customElements.get('community-screen')) {
  customElements.define('community-screen', CommunityScreen);
}

if (!customElements.get('profile-screen')) {
  customElements.define('profile-screen', ProfileScreen);
}

//!  Componentes funcionales 
if (!customElements.get('edit-profile-modal')) {
  customElements.define('edit-profile-modal', EditProfileModal);
}

if (!customElements.get('create-post')) {
  customElements.define('create-post', CreatePost);
}

if (!customElements.get('post-card')) {
  customElements.define('post-card', PostCard);
}

if (!customElements.get('game-card')) {
  customElements.define('game-card', GameCard);
}

if (!customElements.get('login-form')) {
  customElements.define('login-form', LoginForm);
}

if (!customElements.get('register-form')) {
  customElements.define('register-form', RegisterForm);
}

if (!customElements.get('comment-card')) {
  customElements.define('comment-card', CommentCard);
}
