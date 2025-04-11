class Navbar extends HTMLElement {
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

customElements.define("navbar", Navbar);
export default Navbar;
