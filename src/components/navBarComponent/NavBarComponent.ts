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

        const logoSrc = "https://i.ibb.co/LKGVWPS/logo-Nexus.png";
        const searchButtonSrc = "https://i.ibb.co/JWFfXMdc/Vector-1.png";
        const hamburgerSrc = "https://cdn-icons-png.flaticon.com/512/1828/1828859.png";

        this.shadowRoot.innerHTML = `
<style>
            :host {
                display: block;
                width: 100%;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 32px;
                background-color: #2450A6;
                color: white;
                flex-wrap: wrap;
                gap: 12px;
            }

            .nav-section {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .logo-container img {
                height: clamp(36px, 6vw, 48px);
            }

            .search-container {
                flex-grow: 1;
                max-width: 500px;
                margin: 0 20px;
            }

            .search-box {
                display: flex;
                align-items: center;
                background-color: #e63b7a;
                border-radius: 50px;
                padding: 8px 16px;
                width: 100%;
                transition: box-shadow 0.3s ease;
            }

            .search-box:hover {
                box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
            }

            .search-box input {
                font-size: 1rem;
                border: none;
                background: transparent;
                color: white;
                padding: 8px;
                width: 100%;
                outline: none;
            }

            .search-box input::placeholder {
                color: rgba(255, 255, 255, 0.6);
            }

            .search-box img {
                width: 20px;
                height: 20px;
                margin-left: 8px;
            }

            .icon-btn {
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: filter 0.3s ease;
            }

            .icon-btn:hover img {
                filter: brightness(0.85);
            }

            .nav-links {
                display: flex;
                gap: 16px;
            }

            .nav-btn {
                background: none;
                border: none;
                color: white;
                font-size: clamp(1rem, 2.5vw, 1.3rem);
                font-weight: 500;
                letter-spacing: 0.4px;
                cursor: pointer;
                padding: 10px 40px;
                border-radius: 8px;
                transition: background-color 0.3s, transform 0.2s;
                font-size: 150%;
            }

            .nav-btn:hover {
                background-color: rgba(255, 255, 255, 0.15);
                transform: scale(1.05);
            }

            .auth-buttons {
                display: flex;
                gap: 12px;
            }

            .btn {
                background-color: #e63b7a;
                color: white;
                border: none;
                border-radius: 50px;
                padding: 10px 69px;
                cursor: pointer;
                font-size: 150%;
                transition: background-color 0.3s ease, transform 0.2s ease;
            }

            .btn:hover {
                background-color: #d22e6a;
                transform: scale(1.03);
            }

            img {
                cursor: pointer;
            }

            .hamburger {
                display: none;
                background: none;
                border: none;
                cursor: pointer;
                padding: 6px;
                border-radius: 6px;
            }

            .hamburger:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }

            .hamburger img {
                width: 28px;
                height: 28px;
                filter: invert(1);
            }

            @media (max-width: 768px) {
                nav {
                    padding: 12px 20px;
                    gap: 10px;
                }

                .nav-links {
                    display: none;
                }

                #login {
                    display: none;
                }

                .search-container {
                    margin: 0;
                    max-width: none;
                    flex-grow: 1;
                }

                .search-box {
                    background-color: transparent;
                    padding: 0;
                }

                .search-box input {
                    display: none;
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
                    font-size: 30px; 
                    letter-spacing: 0.5px;
                    cursor: pointer;
                    padding: 12px 18px; 
                    transition: background-color 0.3s, transform 0.2s;
                    border-radius: 6px;
                }

                .hamburger {
                    display: block;
                    margin-left: 8px;
                }

                .auth-buttons {

                    display: flex;
                    gap: 30px;
                    margin-right: 10px
                }

                .btn {
                    background-color: #e63b7a;
                    color: white;
                    border: none;
                    border-radius: 999px;
                    padding: 10px 20px;
                    cursor: pointer;
                    height: 50px;
                    font-size: 30px;
                    
                }

                .btn:hover {
                    background-color: #d22e6a;
                    gap: 8px;

                }

                .btn#signin {
                    font-size: 1rem;
                    padding: 8px 18px;
                }

                .logo-container img {
                    height: 38px;
                }

                .right-section {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                }
            }
        </style>


                @media (max-width: 768px) {
                    nav {
                        padding: 15px 25px;
                        flex-wrap: nowrap;
                        justify-content: space-between;
                    }
                    
                    .nav-links {
                        display: none;
                    }
                    
                    #login {
                        display: none;
                    }
                    
                    .search-container {
                        margin: 0;
                        max-width: none;
                        flex-grow: 0;
                    }
                    
                    .search-box {
                        background-color: transparent;
                        padding: 0;
                    }
                    
                    .search-box input {
                        display: none;
                    }
                    
                    .icon-btn {
                        padding: 5px;
                    }
                    
                    .hamburger {
                        display: block;
                        margin-left: 10px;
                    }
                    
                    .auth-buttons {
                        gap: 5px;
                    }
                    
                    .btn#signin {
                        height: auto;
                        font-size: 18px;
                        padding: 8px 20px;
                    }
                    
                    .logo-container img {
                        height: 40px;
                    }
                    
                    .right-section {
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                    }
                }
            </style>

            <link rel="stylesheet" href="../src/styles/navBar.css">
            <nav>
                <div class="nav-section logo-container">
                    <img id="home" src="${logoSrc}" alt="Logo N">
                </div>

                <div class="search-container">
                    <div class="search-box">
                        <input id="searchInput" type="text" placeholder="Search">
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

                <div class="right-section">
                    <div class="nav-section auth-buttons">
                        <button id="login" class="btn">Log in</button>
                        <button id="signin" class="btn">Sign in</button>
                        
                    </div>
                    
                    <button class="hamburger" aria-label="Open menu">
                        <img src="${hamburgerSrc}" alt="Menu">
                    </button>
                </div>
            </nav>
        `;
    }
}

if (!customElements.get('my-navbar')) {
    customElements.define('my-navbar', NavBarComponent);
  }
  export default NavBarComponent;