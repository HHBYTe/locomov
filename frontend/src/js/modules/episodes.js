import { createElement } from '../utils/dom.js';

export class Episodes {
    constructor(api) {
        this.api = api;
        this.episodesSection = document.getElementById('episodesSection');
        this.seriesTitle = document.getElementById('seriesTitle');
        this.seriesYear = document.getElementById('seriesYear');
        this.seasonsContainer = document.getElementById('seasonsContainer');
        this.backButton = document.getElementById('backToSeriesButton');
        
        this.currentSeries = null;
        this.onEpisodeSelectCallback = null;
        this.onBackCallback = null;
        
        this.init();
    }
    
    init() {
        this.backButton.addEventListener('click', () => {
            this.hide();
            if (this.onBackCallback) {
                this.onBackCallback();
            }
        });
    }
    
    showEpisodes(series) {
        this.currentSeries = series;
        
        // Hide other sections
        document.getElementById('moviesSection').style.display = 'none';
        document.getElementById('seriesSection').style.display = 'none';
        document.getElementById('playerSection').style.display = 'none';
        
        // Show episodes section
        this.episodesSection.style.display = 'block';
        
        // Update header
        this.seriesTitle.textContent = series.title;
        this.seriesYear.textContent = series.year || '';
        
        // Render seasons and episodes
        this.renderSeasons(series.seasons);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    renderSeasons(seasons) {
        this.seasonsContainer.innerHTML = '';
        
        seasons.forEach(season => {
            const seasonBlock = this.createSeasonBlock(season);
            this.seasonsContainer.appendChild(seasonBlock);
        });
    }
    
    createSeasonBlock(season) {
        const block = createElement('div', { className: 'season-block' });
        
        const header = createElement('h3', { className: 'season-header' });
        header.textContent = `Season ${season.season_number}`;
        block.appendChild(header);
        
        const episodesGrid = createElement('div', { className: 'episodes-grid' });
        
        season.episodes.forEach(episode => {
            const card = this.createEpisodeCard(episode);
            episodesGrid.appendChild(card);
        });
        
        block.appendChild(episodesGrid);
        
        return block;
    }
    
    createEpisodeCard(episode) {
        const card = createElement('div', { className: 'episode-card' });
        
        const number = createElement('div', { className: 'episode-number' });
        number.textContent = `Episode ${episode.episode}`;
        card.appendChild(number);
        
        if (episode.title) {
            const title = createElement('div', { className: 'episode-title' });
            title.textContent = episode.title;
            card.appendChild(title);
        }
        
        if (episode.subtitles && episode.subtitles.length > 0) {
            const subtitle = createElement('div', { className: 'episode-subtitle-indicator' });
            subtitle.textContent = `📄 ${episode.subtitles.length} subtitle${episode.subtitles.length !== 1 ? 's' : ''}`;
            card.appendChild(subtitle);
        }
        
        card.addEventListener('click', () => {
            if (this.onEpisodeSelectCallback) {
                this.onEpisodeSelectCallback(episode, this.currentSeries);
            }
        });
        
        return card;
    }
    
    show() {
        this.episodesSection.style.display = 'block';
    }
    
    hide() {
        this.episodesSection.style.display = 'none';
    }
    
    getCurrentSeries() {
        return this.currentSeries;
    }
    
    onEpisodeSelect(callback) {
        this.onEpisodeSelectCallback = callback;
    }
    
    onBack(callback) {
        this.onBackCallback = callback;
    }
}
