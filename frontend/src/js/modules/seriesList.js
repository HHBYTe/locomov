import { createElement } from '../utils/dom.js';

export class SeriesList {
    constructor(api) {
        this.api = api;
        this.container = document.getElementById('seriesList');
        this.loadingSpinner = document.getElementById('seriesLoadingSpinner');
        this.errorMessage = document.getElementById('seriesErrorMessage');
        this.sectionTitle = document.getElementById('seriesSectionTitle');
        this.seriesCount = document.getElementById('seriesCount');
        this.seriesSection = document.getElementById('seriesSection');
        
        this.onSeriesSelectCallback = null;
    }
    
    async loadSeries() {
        this.showLoading();
        this.sectionTitle.textContent = 'All Series';
        
        try {
            const data = await this.api.getSeries();
            this.renderSeries(data.series, data.total);
        } catch (error) {
            this.showError();
        }
    }
    
    async searchSeries(query) {
        this.showLoading();
        this.sectionTitle.textContent = `Search Results for "${query}"`;
        
        try {
            const data = await this.api.searchSeries(query);
            this.renderSeries(data.series, data.total);
        } catch (error) {
            this.showError();
        }
    }
    
    renderSeries(series, total) {
        this.hideLoading();
        this.hideError();
        this.container.innerHTML = '';
        
        this.seriesCount.textContent = `${total} series`;
        
        if (series.length === 0) {
            this.showEmptyState();
            return;
        }
        
        series.forEach(s => {
            const card = this.createSeriesCard(s);
            this.container.appendChild(card);
        });
    }
    
    createSeriesCard(series) {
        const card = createElement('div', { className: 'item-card' });
        
        card.innerHTML = `
            <div class="item-thumbnail">
                📺
                <div class="item-overlay">
                    <span class="play-icon">▶</span>
                </div>
            </div>
            <div class="item-details">
                <h3 class="item-title">${this.escapeHtml(series.title)}</h3>
                ${series.year ? `<p class="item-year">${series.year}</p>` : ''}
                <div class="item-meta">
                    <span>${series.seasons.length} Season${series.seasons.length !== 1 ? 's' : ''}</span>
                    <span>${series.total_episodes} Episode${series.total_episodes !== 1 ? 's' : ''}</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            if (this.onSeriesSelectCallback) {
                this.onSeriesSelectCallback(series);
            }
        });
        
        return card;
    }
    
    showEmptyState() {
        this.container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No series found</h3>
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
        this.seriesSection.style.display = 'block';
    }
    
    hide() {
        this.seriesSection.style.display = 'none';
    }
    
    onSeriesSelect(callback) {
        this.onSeriesSelectCallback = callback;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
