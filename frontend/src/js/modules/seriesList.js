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
        this.series = [];
        this.focusedIndex = -1;
    }
    
    async loadSeries() {
        this.showLoading();
        this.updateSectionHeader('SERIES', '');
        
        try {
            const data = await this.api.getSeries();
            this.renderSeries(data.series, data.total);
        } catch (error) {
            console.error('Error loading series:', error);
            this.showError();
        }
    }
    
    async searchSeries(query) {
        this.showLoading();
        this.updateSectionHeader(`SEARCH: "${query.toUpperCase()}"`, '');
        
        try {
            const data = await this.api.searchSeries(query);
            this.renderSeries(data.series, data.total);
        } catch (error) {
            console.error('Error searching series:', error);
            this.showError();
        }
    }
    
    updateSectionHeader(title, count) {
        const sectionHeader = document.querySelector('#seriesSection .section-header');
        sectionHeader.innerHTML = `
            <div class="section-header-title">
                <h2>${title}<span id="seriesCount" class="item-count">${count}</span></h2>
            </div>
            <div class="section-header-columns">
                <div class="column-label-title">TITLE</div>
                <div class="column-label-year">YEAR</div>
                <div class="column-label-meta">SEASONS / EPISODES</div>
            </div>
        `;
        this.seriesCount = document.getElementById('seriesCount');
    }
    
    renderSeries(series, total) {
        this.hideLoading();
        this.hideError();
        this.container.innerHTML = '';
        this.series = series;
        this.focusedIndex = -1;
        
        if (this.seriesCount) {
            this.seriesCount.textContent = ` [${total}]`;
        }
        
        if (series.length === 0) {
            this.showEmptyState();
            return;
        }
        
        series.forEach((s, index) => {
            const row = this.createSeriesRow(s, index);
            this.container.appendChild(row);
        });
    }
    
    createSeriesRow(series, index) {
        const row = createElement('div', { className: 'item-row' });
        row.dataset.index = index;
        
        const info = createElement('div', { className: 'item-info' });
        
        const title = createElement('div', { className: 'item-title' });
        title.textContent = series.title.toUpperCase();
        info.appendChild(title);
        
        if (series.year) {
            const year = createElement('div', { className: 'item-year' });
            year.textContent = series.year;
            info.appendChild(year);
        }
        
        const seasons = createElement('div', { className: 'item-seasons' });
        const seasonCount = series.seasons ? series.seasons.length : 0;
        const episodeCount = series.total_episodes || 0;
        seasons.textContent = `${seasonCount} SEASON${seasonCount !== 1 ? 'S' : ''} / ${episodeCount} EP`;
        info.appendChild(seasons);
        
        row.appendChild(info);
        
        row.addEventListener('click', () => {
            if (this.onSeriesSelectCallback) {
                this.onSeriesSelectCallback(series);
            }
        });
        
        return row;
    }
    
    focusItem(index) {
        const rows = this.container.querySelectorAll('.item-row');
        
        rows.forEach(row => row.classList.remove('focused'));
        
        if (index >= 0 && index < rows.length) {
            this.focusedIndex = index;
            rows[index].classList.add('focused');
            rows[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    selectFocusedItem() {
        if (this.focusedIndex >= 0 && this.focusedIndex < this.series.length) {
            if (this.onSeriesSelectCallback) {
                this.onSeriesSelectCallback(this.series[this.focusedIndex]);
            }
        }
    }
    
    moveFocusUp() {
        if (this.focusedIndex > 0) {
            this.focusItem(this.focusedIndex - 1);
        }
    }
    
    moveFocusDown() {
        if (this.focusedIndex < this.series.length - 1) {
            this.focusItem(this.focusedIndex + 1);
        } else if (this.focusedIndex === -1 && this.series.length > 0) {
            this.focusItem(0);
        }
    }
    
    showEmptyState() {
        this.container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">[X]</div>
                <h3>NO SERIES FOUND</h3>
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
        if (this.seriesSection) this.seriesSection.style.display = 'block';
    }
    
    hide() {
        if (this.seriesSection) this.seriesSection.style.display = 'none';
    }
    
    onSeriesSelect(callback) {
        this.onSeriesSelectCallback = callback;
    }
}