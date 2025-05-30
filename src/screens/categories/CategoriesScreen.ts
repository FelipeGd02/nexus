import { appState } from "../../Flux/store"; // Estado global de la app
import { filterByCategory } from "../../Flux/action"; // Acción para filtrar posts por categoría
import { Category } from "../../types/models"; // Tipos para categorías
import "../../components/post/PostCard"; // Componente para mostrar posts
import categoriesStyles from "./CategoriesScreen.css"; 

class CategoriesScreen extends HTMLElement {
  constructor() {
    super();
    //* Creamos un Shadow DOM para que el componente tenga su propio espacio separado
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render(); // Dibujamos la pantalla cuando aparece

    //* Buscamos todos los elementos que representan categorías para agregarles evento de click
    const categoryItems = this.shadowRoot?.querySelectorAll(".category-item");
    categoryItems?.forEach(item => {
      item.addEventListener("click", () => {
        //* Cuando hacen click, sacamos la categoría de ese elemento
        const category = item.getAttribute("data-category") as Category | null;
        //+ Disparamos la acción para filtrar posts por esa categoría
        filterByCategory(category);
        // Volvemos a renderizar la pantalla para actualizar los posts mostrados
        this.render();
      });
    });
  }

  // Genera el HTML para mostrar todas las categorías disponibles
  renderCategories() {
    const state = appState.get();
    const categories = Object.values(Category);

    return categories.map(category => `
      <div class="category-item ${state.currentCategoryFilter === category ? 'active' : ''}" data-category="${category}">
        <span>${category}</span>
      </div>
    `).join("");
  }

  // Genera el HTML para mostrar los posts filtrados según la categoría
  renderPosts() {
    const state = appState.get();
    const posts = state.filteredPosts;

    // Si no hay posts, mostramos un mensaje
    if (posts.length === 0) {
      return `
        <div class="no-posts">
          <p>No posts found in this category.</p>
        </div>
      `;
    }

    // Por cada post, creamos un componente <post-card> con sus datos
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
      // Construimos el HTML general de la pantalla, con header, lista de categorías y posts
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

      // Re-ponemos los eventos a las categorías para que funcionen después de renderizar
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
    // Aquí podrías limpiar eventos si fuera necesario
  }
}

export default CategoriesScreen;
