import { appState } from "../../store";
import { navigate, logout } from "../../store/actions";
import { Screens } from "../../types/navigation";
import headerStyles from "./Header.css";

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    // Event listeners
    const threadsLink = this.shadowRoot?.querySelector("#threads-link");
    const categoriesLink = this.shadowRoot?.querySelector("#categories-link");
    const communityLink = this.shadowRoot?.querySelector("#community-link");
    const loginLink = this.shadowRoot?.querySelector("#login-link");
    const logoLink = this.shadowRoot?.querySelector("#logo-link");
    const profileLink = this.shadowRoot?.querySelector("#profile-link");
    const logoutBtn = this.shadowRoot?.querySelector("#logout-btn");

    logoLink?.addEventListener("click", () => {
      navigate(Screens.LANDING);
    });

    threadsLink?.addEventListener("click", () => {
      navigate(Screens.THREADS);
    });

    categoriesLink?.addEventListener("click", () => {
      navigate(Screens.CATEGORIES);
    });

    communityLink?.addEventListener("click", () => {
      navigate(Screens.COMMUNITY);
    });

    loginLink?.addEventListener("click", () => {
      navigate(Screens.LOGIN);
    });

    profileLink?.addEventListener("click", () => {
      navigate(Screens.PROFILE);
    });

    logoutBtn?.addEventListener("click", () => {
      logout();
    });
  }

  render() {
    const state = appState.get();
    
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${headerStyles}</style>
        <header>
          <div class="header-container">
            <div class="logo" id="logo-link">
              <h1>Nexus</h1>
            </div>
            <nav class="nav-links">
              <ul>
                <li><a id="threads-link" class="${state.currentScreen === Screens.THREADS ? 'active' : ''}">Threads</a></li>
                <li><a id="categories-link" class="${state.currentScreen === Screens.CATEGORIES ? 'active' : ''}">Categories</a></li>
                <li><a id="community-link" class="${state.currentScreen === Screens.COMMUNITY ? 'active' : ''}">Community</a></li>
              </ul>
            </nav>
            <div class="auth-section">
              ${state.isAuthenticated && state.currentUser 
                ? `
                  <div class="user-profile" id="profile-link">
                    <img src="${state.currentUser.profilePicture}" alt="${state.currentUser.username}">
                    <span>${state.currentUser.username}</span>
                  </div>
                  <button id="logout-btn" class="logout-btn">Logout</button>
                `
                : `<button id="login-link" class="login-btn">Login</button>`
              }
            </div>
            <div class="menu-toggle">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </header>
      `;

      // Mobile menu toggle
      const menuToggle = this.shadowRoot.querySelector(".menu-toggle");
      const navLinks = this.shadowRoot.querySelector(".nav-links");
      
      menuToggle?.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        navLinks?.classList.toggle("active");
      });
    }
  }

}

export default AppHeader;