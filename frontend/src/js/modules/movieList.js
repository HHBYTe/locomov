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
        
        this.onMovieSelectCallback = null;
        this.movies = [];
        this.focusedIndex = -1;
    }
    
    async loadMovies() {
        this.showLoading();
        this.updateSectionHeader('MOVIES', '');
        
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
        this.updateSectionHeader(`SEARCH: "${query.toUpperCase()}"`, '');
        
        try {
            const data = await this.api.searchMovies(query);
            this.renderMovies(data.movies, data.total);
        } catch (error) {
            console.error('Error searching movies:', error);
            this.showError();
        }
    }
    
    updateSectionHeader(title, count) {
        const sectionHeader = document.querySelector('#moviesSection .section-header');
        sectionHeader.innerHTML = `
            <div class="section-header-title">
                <h2>${title}<span id="moviesCount" class="item-count">${count}</span></h2>
            </div>
            <div class="section-header-columns">
                <div class="column-label-title">TITLE</div>
                <div class="column-label-year">YEAR</div>
                <div class="column-label-meta">LENGTH</div>
            </div>
        `;
        this.movieCount = document.getElementById('moviesCount');
    }
    
    renderMovies(movies, total) {
        this.hideLoading();
        this.hideError();
        this.container.innerHTML = '';
        this.movies = movies;
        this.focusedIndex = -1;
        
        if (this.movieCount) {
            this.movieCount.textContent = ` [${total}]`;
        }
        
        if (movies.length === 0) {
            this.showEmptyState();
            return;
        }
        
        movies.forEach((movie, index) => {
            const row = this.createMovieRow(movie, index);
            this.container.appendChild(row);
        });
    }
    
    createMovieRow(movie, index) {
        const row = createElement('div', { className: 'item-row' });
        row.dataset.index = index;
        
        const info = createElement('div', { className: 'item-info' });
        
        const title = createElement('div', { className: 'item-title' });
        title.textContent = movie.title.toUpperCase();
        info.appendChild(title);
        
        if (movie.year) {
            const year = createElement('div', { className: 'item-year' });
            year.textContent = movie.year;
            info.appendChild(year);
        }
        
        if (movie.length) {
            const length = createElement('div', { className: 'item-length' });
            length.textContent = movie.length;
            info.appendChild(length);
        }
        
        row.appendChild(info);
        
        row.addEventListener('click', () => {
            if (this.onMovieSelectCallback) {
                this.onMovieSelectCallback(movie);
            }
        });
        
        return row;
    }
    
    focusItem(index) {
        const rows = this.container.querySelectorAll('.item-row');
        
        // Remove previous focus
        rows.forEach(row => row.classList.remove('focused'));
        
        // Add new focus
        if (index >= 0 && index < rows.length) {
            this.focusedIndex = index;
            rows[index].classList.add('focused');
            rows[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    selectFocusedItem() {
        if (this.focusedIndex >= 0 && this.focusedIndex < this.movies.length) {
            if (this.onMovieSelectCallback) {
                this.onMovieSelectCallback(this.movies[this.focusedIndex]);
            }
        }
    }
    
    moveFocusUp() {
        if (this.focusedIndex > 0) {
            this.focusItem(this.focusedIndex - 1);
        }
    }
    
    moveFocusDown() {
        if (this.focusedIndex < this.movies.length - 1) {
            this.focusItem(this.focusedIndex + 1);
        } else if (this.focusedIndex === -1 && this.movies.length > 0) {
            this.focusItem(0);
        }
    }
    
    showEmptyState() {
        this.container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">[X]</div>
                <h3>NO MOVIES FOUND</h3>
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
        if (this.container) this.container.style.display = 'flex';
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
}