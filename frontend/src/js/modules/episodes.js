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
        this.episodes = [];
        this.focusedIndex = -1;
        
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
        
        document.getElementById('moviesSection').style.display = 'none';
        document.getElementById('seriesSection').style.display = 'none';
        document.getElementById('playerSection').style.display = 'none';
        
        this.episodesSection.style.display = 'block';
        
        this.seriesTitle.textContent = series.title.toUpperCase();
        this.seriesYear.textContent = series.year || '';
        
        this.renderSeasons(series.seasons);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    renderSeasons(seasons) {
        this.seasonsContainer.innerHTML = '';
        this.episodes = [];
        this.focusedIndex = -1;
        
        seasons.forEach(season => {
            const seasonBlock = this.createSeasonBlock(season);
            this.seasonsContainer.appendChild(seasonBlock);
            
            season.episodes.forEach(ep => {
                this.episodes.push(ep);
            });
        });
    }
    
    createSeasonBlock(season) {
        const block = createElement('div', { className: 'season-block' });
        
        const header = createElement('h3', { className: 'season-header' });
        header.textContent = `SEASON ${season.season_number}`;
        block.appendChild(header);
        
        const episodesList = createElement('div', { className: 'episodes-list' });
        
        season.episodes.forEach((episode, idx) => {
            const row = this.createEpisodeRow(episode, idx);
            episodesList.appendChild(row);
        });
        
        block.appendChild(episodesList);
        
        return block;
    }
    
    createEpisodeRow(episode, index) {
        const row = createElement('div', { className: 'episode-row' });
        row.dataset.index = index;
        
        const info = createElement('div', { className: 'episode-info' });
        
        const number = createElement('div', { className: 'episode-number' });
        number.textContent = `EP ${episode.episode}`;
        info.appendChild(number);
        
        if (episode.title) {
            const title = createElement('div', { className: 'episode-title' });
            title.textContent = episode.title.toUpperCase();
            info.appendChild(title);
        }
        
        if (episode.subtitles && episode.subtitles.length > 0) {
            const subtitle = createElement('div', { className: 'episode-subtitle-indicator' });
            subtitle.textContent = `[${episode.subtitles.length} SUB]`;
            info.appendChild(subtitle);
        }
        
        row.appendChild(info);
        
        row.addEventListener('click', () => {
            if (this.onEpisodeSelectCallback) {
                this.onEpisodeSelectCallback(episode, this.currentSeries);
            }
        });
        
        return row;
    }
    
    focusItem(index) {
        const rows = this.episodesSection.querySelectorAll('.episode-row');
        
        rows.forEach(row => row.classList.remove('focused'));
        
        if (index >= 0 && index < rows.length) {
            this.focusedIndex = index;
            rows[index].classList.add('focused');
            rows[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    selectFocusedItem() {
        if (this.focusedIndex >= 0 && this.focusedIndex < this.episodes.length) {
            if (this.onEpisodeSelectCallback) {
                this.onEpisodeSelectCallback(this.episodes[this.focusedIndex], this.currentSeries);
            }
        }
    }
    
    moveFocusUp() {
        if (this.focusedIndex > 0) {
            this.focusItem(this.focusedIndex - 1);
        }
    }
    
    moveFocusDown() {
        if (this.focusedIndex < this.episodes.length - 1) {
            this.focusItem(this.focusedIndex + 1);
        } else if (this.focusedIndex === -1 && this.episodes.length > 0) {
            this.focusItem(0);
        }
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