import { AppState } from "../../store";
import { filterByCategory } from "../../store/action";
import { Category } from "../../types/models";
import "../../components/post/post-card";
import categoriesStyles from "./categories-screen.css";

class CategoriesScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    // Event listeners
    const categoryItems = this.shadowRoot?.querySelectorAll(".category-item");
    categoryItems?.forEach(item => {
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
    
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${categoriesStyles}</style>
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
      
      // Re-attach event listeners
      const categoryItems = this.shadowRoot.querySelectorAll(".category-item");
      categoryItems.forEach(item => {
        item.addEventListener("click", () => {
          const category = item.getAttribute("data-category");
          filterByCategory(category ? category as Category : null);
          this.render();
        });
      });
    }
  }

  disconnectedCallback() {
    // Cleanup event listeners if needed
  }
}

export default CategoriesScreen;