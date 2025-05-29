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
customElements.define('app-container', AppContainer);
customElements.define('app-header', AppHeader);

//!  Pantallas 
customElements.define('auth-screen', AuthScreen);
customElements.define('landing-screen', LandingScreen);
customElements.define('threads-screen', ThreadsScreen);
customElements.define('thread-detail-screen', ThreadDetailScreen);
customElements.define('categories-screen', CategoriesScreen);
customElements.define('community-screen', CommunityScreen);
customElements.define('profile-screen', ProfileScreen);



//!  Componentes funcionales 
customElements.define('edit-profile-modal', EditProfileModal);
customElements.define('create-post', CreatePost);
customElements.define("post-card", PostCard);
customElements.define("game-card", GameCard);


customElements.define("login-form", LoginForm)
customElements.define("register-form", RegisterForm);
customElements.define("comment-card", CommentCard);
