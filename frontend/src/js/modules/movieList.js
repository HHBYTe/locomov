import { createElement } from '../utils/dom.js';

export class MovieList {
    constructor(api) {
        this.api = api;
        this.container = document.getElementById('moviesList');
        this.loadingSpinner = document.getElementById('moviesLoadingSpinner');
        this.errorMessage = document.getElementById('moviesErrorMessage');
        this.sectionTitle = document.getElementById('moviesSectionTitle');
        this.movieCount = document.getElementById('moviesCount');
        this.moviesSection = document.getElementById('moviesSection');
        
        // Check if all elements exist
        if (!this.container || !this.loadingSpinner || !this.errorMessage) {
            console.error('MovieList: Required DOM elements not found', {
                container: !!this.container,
                loadingSpinner: !!this.loadingSpinner,
                errorMessage: !!this.errorMessage,
                sectionTitle: !!this.sectionTitle,
                movieCount: !!this.movieCount,
                moviesSection: !!this.moviesSection
            });
        }
        
        this.onMovieSelectCallback = null;
    }
    
    async loadMovies() {
        this.showLoading();
        if (this.sectionTitle) this.sectionTitle.textContent = 'All Movies';
        
        try {
            const data = await this.api.getMovies();
            this.renderMovies(data.movies, data.total);
        } catch (error) {
            console.error('Error loading movies:', error);
            this.showError();
        }
    }
    
    async searchMovies(query) {
        this.showLoading();
        if (this.sectionTitle) this.sectionTitle.textContent = `Search Results for "${query}"`;
        
        try {
            const data = await this.api.searchMovies(query);
            this.renderMovies(data.movies, data.total);
        } catch (error) {
            console.error('Error searching movies:', error);
            this.showError();
        }
    }
    
    renderMovies(movies, total) {
        this.hideLoading();
        this.hideError();
        if (this.container) this.container.innerHTML = '';
        
        if (this.movieCount) {
            this.movieCount.textContent = `${total} movie${total !== 1 ? 's' : ''}`;
        }
        
        if (movies.length === 0) {
            this.showEmptyState();
            return;
        }
        
        movies.forEach(movie => {
            const card = this.createMovieCard(movie);
            if (this.container) this.container.appendChild(card);
        });
    }
    
    createMovieCard(movie) {
        const card = createElement('div', { className: 'item-card' });
        
        const subtitleIndicator = movie.subtitles && movie.subtitles.length > 0 
            ? `<div class="item-meta"><span>📄 ${movie.subtitles.length} subtitle${movie.subtitles.length !== 1 ? 's' : ''}</span></div>`
            : '';
        
        card.innerHTML = `
            <div class="item-thumbnail">
                🎬
                <div class="item-overlay">
                    <span class="play-icon">▶</span>
                </div>
            </div>
            <div class="item-details">
                <h3 class="item-title">${this.escapeHtml(movie.title)}</h3>
                ${movie.year ? `<p class="item-year">${movie.year}</p>` : ''}
                ${subtitleIndicator}
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
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No movies found</h3>
                <p>Try a different search term</p>
            </div>
        `;
    }
    
    showLoading() {
        if (this.loadingSpinner) this.loadingSpinner.style.display = 'flex';
        if (this.container) this.container.style.display = 'none';
        if (this.errorMessage) this.errorMessage.style.display = 'none';
    }
    
    hideLoading() {
        if (this.loadingSpinner) this.loadingSpinner.style.display = 'none';
        if (this.container) this.container.style.display = 'grid';
    }
    
    showError() {
        if (this.loadingSpinner) this.loadingSpinner.style.display = 'none';
        if (this.container) this.container.style.display = 'none';
        if (this.errorMessage) this.errorMessage.style.display = 'block';
    }
    
    hideError() {
        if (this.errorMessage) this.errorMessage.style.display = 'none';
    }
    
    show() {
        if (this.moviesSection) this.moviesSection.style.display = 'block';
    }
    
    hide() {
        if (this.moviesSection) this.moviesSection.style.display = 'none';
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
