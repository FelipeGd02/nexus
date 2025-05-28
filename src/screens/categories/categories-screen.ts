import { appState } from "../../store";
import { filterByCategory } from "../../store/action";
import { Category } from "../../types/models";
import "../../components/post/PostCard";

class CategoriesScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    const categoryItems = this.shadowRoot!.querySelectorAll(".category-item");
    categoryItems.forEach(item => {
      item.addEventListener("click", () => {
        const category = item.getAttribute("data-category") as Category | null;
        filterByCategory(category);
        this.render();
      });
    });
  }

  renderCategories() {
    const state = appState.get();
    const categories = Object.values(Category);

    return categories.map(category => `
      <div class="category-item ${state.currentCategoryFilter === category ? 'active' : ''}" data-category="${category}">
        <span>${category}</span>
      </div>
    `).join("");
  }

  renderPosts() {
    const state = appState.get();
    const posts = state.filteredPosts;

    if (posts.length === 0) {
      return `
        <div class="no-posts">
          <p>No posts found in this category.</p>
        </div>
      `;
    }

    return posts.map(post => `
      <post-card
        postid="${post.id}"
        userid="${post.userId}"
        username="${post.username}"
        pfp="${post.profilePicture}"
        content="${post.content}"
        ${post.imageUrl ? `imageurl="${post.imageUrl}"` : ''}
        likes="${post.likes}"
        reposts="${post.reposts}"
        comments="${post.comments}"
        saves="${post.saves}"
        timestamp="${post.timestamp}"
        ${post.gameId ? `gameid="${post.gameId}"` : ''}
        isliked="${post.isLiked || false}"
        issaved="${post.isSaved || false}">
      </post-card>
    `).join("");
  }

  render() {
    const state = appState.get();

    const styles = `
      :host {
        display: block;
        font-family: 'Inter', sans-serif;
      }

      .categories-container {
        min-height: 100vh;
        padding: 90px max(2rem, calc((100% - 1100px) / 2)) 2rem;
        background-color: #121212;
        color: #e0e0e0;
      }

      .categories-header {
        margin-bottom: 2rem;
        text-align: center;
      }

      .categories-header h2 {
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: #fff;
      }

      .categories-header p {
        color: #bdbdbd;
        font-size: 1rem;
      }

      .categories-header p strong {
        color: #7e57c2;
      }

      .categories-list {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 2.5rem;
      }

      .category-item {
        padding: 0.7rem 1.3rem;
        background-color: #1e1e1e;
        border-radius: 30px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .category-item:hover {
        background-color: rgba(126, 87, 194, 0.2);
        transform: translateY(-2px);
      }

      .category-item.active {
        background-color: #7e57c2;
        color: white;
        box-shadow: 0 4px 10px rgba(126, 87, 194, 0.3);
      }

      .category-item span {
        font-size: 0.9rem;
        font-weight: 500;
      }

      .category-posts {
        margin-top: 2rem;
      }

      .category-posts h3 {
        font-size: 1.6rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: #e0e0e0;
        text-align: center;
      }

      .posts-grid {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        max-width: 800px;
        margin: 0 auto;
      }

      .no-posts {
        background-color: #1e1e1e;
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .no-posts p {
        color: #bdbdbd;
        font-size: 1.1rem;
        margin: 0;
      }

      @media (max-width: 768px) {
        .categories-container {
          padding: 80px 1rem 2rem;
        }

        .categories-header h2 {
          font-size: 1.8rem;
        }

        .categories-list {
          flex-wrap: nowrap;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          justify-content: flex-start;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scroll-padding: 0 1rem;
        }

        .categories-list::-webkit-scrollbar {
          height: 4px;
        }

        .categories-list::-webkit-scrollbar-thumb {
          background-color: #7e57c2;
          border-radius: 4px;
        }

        .category-item {
          flex-shrink: 0;
        }

        .category-posts h3 {
          font-size: 1.4rem;
        }
      }

      @media (max-width: 480px) {
        .categories-header h2 {
          font-size: 1.6rem;
        }

        .categories-header p {
          font-size: 0.9rem;
        }

        .category-item {
          padding: 0.6rem 1rem;
        }

        .category-item span {
          font-size: 0.85rem;
        }

        .category-posts h3 {
          font-size: 1.3rem;
        }
      }
    `;

    this.shadowRoot!.innerHTML = `
      <style>${styles}</style>
      <div class="categories-container">
        <div class="categories-header">
          <h2>Game Categories</h2>
          <p>
            ${state.currentCategoryFilter 
              ? `Showing posts in <strong>${state.currentCategoryFilter}</strong> category` 
              : 'Select a category to filter posts'}
          </p>
        </div>

        <div class="categories-list">
          <div class="category-item ${state.currentCategoryFilter === null ? 'active' : ''}" data-category="">
            <span>All Categories</span>
          </div>
          ${this.renderCategories()}
        </div>

        <div class="category-posts">
          <h3>
            ${state.currentCategoryFilter 
              ? `${state.currentCategoryFilter} Games` 
              : 'All Posts'}
          </h3>

          <div class="posts-grid">
            ${this.renderPosts()}
          </div>
        </div>
      </div>
    `;

    const categoryItems = this.shadowRoot!.querySelectorAll(".category-item");
    categoryItems.forEach(item => {
      item.addEventListener("click", () => {
        const category = item.getAttribute("data-category");
        filterByCategory(category ? category as Category : null);
        this.render();
      });
    });
  }

  disconnectedCallback() {}
}

export default CategoriesScreen;
