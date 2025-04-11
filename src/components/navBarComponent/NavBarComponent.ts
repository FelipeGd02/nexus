class NavBarComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        const root = this.shadowRoot;
        if (!root) return;

        const homeBtn = root.getElementById('home');
        const searchBtn = root.getElementById('searchBtn');
        const searchInput = root.getElementById('searchInput') as HTMLInputElement;
        const navButtons = root.querySelectorAll('.nav-btn');
        const loginBtn = root.getElementById('login');
        const signinBtn = root.getElementById('signin');

        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                console.log('Logo clicked');
            });
        }

        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput.value.trim();
                if (query) console.log(`Buscando: ${query}`);
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) console.log(`Buscando (Enter): ${query}`);
                }
            });
        }

        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                console.log(`${target.textContent} button clicked`);
            });
        });

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                console.log('Login clicked');
            });
        }

        if (signinBtn) {
            signinBtn.addEventListener('click', () => {
                console.log('Sign in clicked');
            });
        }
    }

    render() {
        if (!this.shadowRoot) return;

        const logoSrc = "../src/utils/images/logoNexus.png";
        const searchButtonSrc = "https://cdn-icons-png.flaticon.com/512/3031/3031293.png";
        const hamburgerSrc = "https://cdn-icons-png.flaticon.com/512/1828/1828859.png";

        this.shadowRoot.innerHTML = `
            <style>
                        :host {
                display: block;
                width: 100%;
            }

            nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 20px;
                background-color: #2C3E8F;
                color: white;
                flex-wrap: wrap;
            }

            .nav-section {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .logo-container {
                display: flex;
                align-items: center;
            }

            .search-container {
                flex-grow: 1;
                max-width: 400px;
                margin: 0 20px;
            }

            .search-box {
                display: flex;
                align-items: center;
                background-color: #e63b7a;
                border-radius: 20px;
                padding: 5px 15px;
                width: 100%;
            }

            .search-box input {
                border: none;
                background: transparent;
                color: white;
                padding: 5px;
                width: 100%;
                outline: none;
            }

            .search-box input::placeholder {
                color: rgba(255, 255, 255, 0.7);
            }

            .search-box img {
                width: 20px;
                height: 20px;
                margin-left: 5px;
            }

            .icon-btn {
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .icon-btn:hover img {
                filter: brightness(0.85);
            }

            .nav-links {
                display: flex;
                gap: 20px;
            }

            .nav-btn {
                background: none;
                border: none;
                color: white;
                font-size: 16px;
                cursor: pointer;
                padding: 8px 12px;
                transition: background-color 0.3s;
                border-radius: 4px;
            }

            .nav-btn:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }

            .auth-buttons {
                display: flex;
                gap: 10px;
            }

            .btn {
                background-color: #e63b7a;
                color: white;
                border: none;
                border-radius: 20px;
                padding: 8px 16px;
                cursor: pointer;
                font-weight: bold;
            }

            .btn:hover {
                background-color: #d22e6a;
            }

            img {
                height: 30px;
                cursor: pointer;
            }

            /* botón hamburguesa */
            .hamburger {
                display: none;
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
            }

            .hamburger:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }

            .hamburger img {
                width: 28px;
                height: 28px;
                filter: invert(1);
            }

            /*  Responsive */
            @media (max-width: 768px) {
                nav {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .nav-section.nav-links,
                .auth-buttons {
                    width: 100%;
                    justify-content: space-around;
                    margin-top: 10px;
                    flex-wrap: wrap;
                }

                .search-container {
                    width: 100%;
                    max-width: none;
                    margin: 10px 0;
                }

                .hamburger {
                    display: block;
                    position: absolute;
                    top: 15px;
                    right: 20px;
                }
            }

            </style>
            <link rel="stylesheet" href="../src/styles/navBar.css">
            <nav>
                <div class="nav-section logo-container">
                    <img id="home" src="${logoSrc}" alt="Logo N">
                </div>

                <button class="hamburger" aria-label="Open menu">
                    <img src="${hamburgerSrc}" alt="Menu">
                </button>


                <div class="search-container">
                    <div class="search-box">
                        <input id="searchInput" type="text" placeholder="Search...">
                        <button id="searchBtn" class="icon-btn">
                            <img src="${searchButtonSrc}" alt="Search">
                        </button>
                    </div>
                </div>

                <div class="nav-section nav-links">
                    <button class="nav-btn">Home</button>
                    <button class="nav-btn">Category</button>
                    <button class="nav-btn">Community</button>
                </div>

                <div class="nav-section auth-buttons">
                    <button id="login" class="btn">Log in</button>
                    <button id="signin" class="btn">Sign in</button>
                </div>
            </nav>
        `;
    }
}

customElements.define("navbar-bar", NavBarComponent);
export default NavBarComponent;
