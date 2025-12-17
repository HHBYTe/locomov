import { API } from './modules/api.js';
import { MovieList } from './modules/movieList.js';
import { SeriesList } from './seriesList.js';
import { Episodes } from './modules/episodes.js';
import { Search } from './modules/search.js';
import { Player } from './modules/player.js';

class App {
    constructor() {
        this.api = new API();
        this.movieList = new MovieList(this.api);
        this.seriesList = new SeriesList(this.api);
        this.episodes = new Episodes(this.api);
        this.search = new Search(this.api);
        this.player = new Player(this.api);
        
        this.currentView = 'movies'; // 'movies' or 'series'
        
        this.init();
    }
    
    init() {
        // Setup tabs
        this.setupTabs();
        
        // Load all movies on startup
        this.movieList.loadMovies();
        
        // Setup search - works for both movies and series based on current view
        this.search.onSearch((query) => {
            if (this.currentView === 'movies') {
                if (query.trim()) {
                    this.movieList.searchMovies(query);
                } else {
                    this.movieList.loadMovies();
                }
            } else if (this.currentView === 'series') {
                if (query.trim()) {
                    this.seriesList.searchSeries(query);
                } else {
                    this.seriesList.loadSeries();
                }
            }
        });
        
        // Setup movie selection
        this.movieList.onMovieSelect((movie) => {
            this.player.playMovie(movie);
        });
        
        // Setup series selection
        this.seriesList.onSeriesSelect((series) => {
            this.episodes.showEpisodes(series);
        });
        
        // Setup episode selection
        this.episodes.onEpisodeSelect((episode, series) => {
            this.player.playEpisode(episode, series);
        });
        
        // Setup back buttons
        this.player.onBack(() => {
            if (this.currentView === 'movies') {
                this.showMovies();
            } else if (this.episodes.getCurrentSeries()) {
                // If we were watching a series episode, go back to episodes view
                const series = this.episodes.getCurrentSeries();
                this.episodes.showEpisodes(series);
            } else {
                this.showSeries();
            }
        });
        
        this.episodes.onBack(() => {
            this.showSeries();
        });
    }
    
    setupTabs() {
        const moviesTab = document.getElementById('moviesTab');
        const seriesTab = document.getElementById('seriesTab');
        
        moviesTab.addEventListener('click', () => {
            this.switchToMovies();
        });
        
        seriesTab.addEventListener('click', () => {
            this.switchToSeries();
        });
    }
    
    switchToMovies() {
        this.currentView = 'movies';
        
        // Update tab active state
        document.getElementById('moviesTab').classList.add('active');
        document.getElementById('seriesTab').classList.remove('active');
        
        // Clear search
        this.search.clear();
        
        // Show movies view
        this.showMovies();
        
        // Load movies if not already loaded
        this.movieList.loadMovies();
    }
    
    switchToSeries() {
        this.currentView = 'series';
        
        // Update tab active state
        document.getElementById('seriesTab').classList.add('active');
        document.getElementById('moviesTab').classList.remove('active');
        
        // Clear search
        this.search.clear();
        
        // Show series view
        this.showSeries();
        
        // Load series if not already loaded
        this.seriesList.loadSeries();
    }
    
    showMovies() {
        document.getElementById('moviesSection').style.display = 'block';
        document.getElementById('seriesSection').style.display = 'none';
        document.getElementById('episodesSection').style.display = 'none';
        document.getElementById('playerSection').style.display = 'none';
    }
    
    showSeries() {
        document.getElementById('moviesSection').style.display = 'none';
        document.getElementById('seriesSection').style.display = 'block';
        document.getElementById('episodesSection').style.display = 'none';
        document.getElementById('playerSection').style.display = 'none';
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
