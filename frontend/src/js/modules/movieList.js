import { createElement } from '../utils/dom.js';

export class MovieList {
    constructor(api) {
        this.api = api;
        this.container = document.getElementById('moviesList');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.sectionTitle = document.getElementById('sectionTitle');
        this.movieCount = document.getElementById('movieCount');
        this.moviesSection = document.getElementById('moviesSection');
        
        this.onMovieSelectCallback = null;
    }
    
    async loadMovies() {
        this.showLoading();
        this.sectionTitle.textContent = 'All Movies';
        
        try {
            const data = await this.api.getMovies();
            this.renderMovies(data.movies, data.total);
        } catch (error) {
            this.showError();
        }
    }
    
    async searchMovies(query) {
        this.showLoading();
        this.sectionTitle.textContent = `Search Results for "${query}"`;
        
        try {
            const data = await this.api.searchMovies(query);
            this.renderMovies(data.movies, data.total);
        } catch (error) {
            this.showError();
        }
    }
    
    renderMovies(movies, total) {
        this.hideLoading();
        this.hideError();
        this.container.innerHTML = '';
        
        this.movieCount.textContent = `${total} movie${total !== 1 ? 's' : ''}`;
        
        if (movies.length === 0) {
            this.showEmptyState();
            return;
        }
        
        movies.forEach(movie => {
            const card = this.createMovieCard(movie);
            this.container.appendChild(card);
        });
    }
    
    createMovieCard(movie) {
        const card = createElement('div', { className: 'movie-card' });
        
        card.innerHTML = `
            <div class="movie-thumbnail">
                🎬
                <div class="movie-overlay">
                    <span class="play-icon">▶</span>
                </div>
            </div>
            <div class="movie-details">
                <h3 class="movie-title">${this.escapeHtml(movie.title)}</h3>
                ${movie.year ? `<p class="movie-year">${movie.year}</p>` : ''}
            </div>
        `;
        
        card.addEventListener('click', () => {
            if (this.onMovieSelectCallback) {
                this.onMovieSelectCallback(movie);
            }
        });
        
        return card;
    }
    
    showEmptyState() {
        this.container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No movies found</h3>
                <p>Try a different search term</p>
            </div>
        `;
    }
    
    showLoading() {
        this.loadingSpinner.style.display = 'flex';
        this.container.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }
    
    hideLoading() {
        this.loadingSpinner.style.display = 'none';
        this.container.style.display = 'grid';
    }
    
    showError() {
        this.loadingSpinner.style.display = 'none';
        this.container.style.display = 'none';
        this.errorMessage.style.display = 'block';
    }
    
    hideError() {
        this.errorMessage.style.display = 'none';
    }
    
    show() {
        this.moviesSection.style.display = 'block';
    }
    
    hide() {
        this.moviesSection.style.display = 'none';
    }
    
    onMovieSelect(callback) {
        this.onMovieSelectCallback = callback;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
