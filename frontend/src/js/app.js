import { API } from './modules/api.js';
import { MovieList } from './modules/movieList.js';
import { SeriesList } from './modules/seriesList.js';
import { Episodes } from './modules/episodes.js';
import { Search } from './modules/search.js';
import { Player } from './modules/player.js';

class App {
    constructor() {
        console.log('App constructor started');
        
        // Verify all required DOM elements exist
        this.verifyDOMElements();
        
        this.api = new API();
        this.movieList = new MovieList(this.api);
        this.seriesList = new SeriesList(this.api);
        this.episodes = new Episodes(this.api);
        this.search = new Search(this.api);
        this.player = new Player(this.api);
        
        this.currentView = 'movies'; // 'movies' or 'series'
        
        console.log('App initialization complete, starting init()');
        this.init();
    }
    
    verifyDOMElements() {
        const requiredIds = [
            'moviesTab', 'seriesTab', 'searchInput',
            'playerSection', 'backButton', 'videoPlayer',
            'currentTitle', 'currentMeta', 'episodesSection',
            'backToSeriesButton', 'seriesTitle', 'seriesYear',
            'seasonsContainer', 'moviesSection', 'moviesSectionTitle',
            'moviesCount', 'moviesLoadingSpinner', 'moviesErrorMessage',
            'moviesList', 'seriesSection', 'seriesSectionTitle',
            'seriesCount', 'seriesLoadingSpinner', 'seriesErrorMessage',
            'seriesList'
        ];
        
        const missing = requiredIds.filter(id => !document.getElementById(id));
        
        if (missing.length > 0) {
            console.error('Missing DOM elements:', missing);
            alert('ERROR: Page not fully loaded. Missing elements: ' + missing.join(', '));
        } else {
            console.log('All required DOM elements found');
        }
    }
    
    init() {
        console.log('Starting init() - setting up tabs');
        
        // Setup tabs
        this.setupTabs();
        
        console.log('Loading movies...');
        // Load all movies on startup
        this.movieList.loadMovies();
        
        // Setup search - works for both movies and series based on current view
        this.search.onSearch((query) => {
            console.log('Search triggered:', query, 'Current view:', this.currentView);
            
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
            console.log('Movie selected:', movie);
            this.player.playMovie(movie);
        });
        
        // Setup series selection
        this.seriesList.onSeriesSelect((series) => {
            console.log('Series selected:', series);
            this.episodes.showEpisodes(series);
        });
        
        // Setup episode selection
        this.episodes.onEpisodeSelect((episode, series) => {
            console.log('Episode selected:', episode);
            this.player.playEpisode(episode, series);
        });
        
        // Setup back buttons
        this.player.onBack(() => {
            console.log('Player back button clicked');
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
            console.log('Episodes back button clicked');
            this.showSeries();
        });
        
        console.log('Init complete');
    }
    
    setupTabs() {
        const moviesTab = document.getElementById('moviesTab');
        const seriesTab = document.getElementById('seriesTab');
        
        if (!moviesTab || !seriesTab) {
            console.error('Tab buttons not found!');
            return;
        }
        
        moviesTab.addEventListener('click', () => {
            console.log('Movies tab clicked');
            this.switchToMovies();
        });
        
        seriesTab.addEventListener('click', () => {
            console.log('Series tab clicked');
            this.switchToSeries();
        });
    }
    
    switchToMovies() {
        console.log('Switching to movies view');
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
        console.log('Switching to series view');
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
        console.log('Showing movies section');
        document.getElementById('moviesSection').style.display = 'block';
        document.getElementById('seriesSection').style.display = 'none';
        document.getElementById('episodesSection').style.display = 'none';
        document.getElementById('playerSection').style.display = 'none';
    }
    
    showSeries() {
        console.log('Showing series section');
        document.getElementById('moviesSection').style.display = 'none';
        document.getElementById('seriesSection').style.display = 'block';
        document.getElementById('episodesSection').style.display = 'none';
        document.getElementById('playerSection').style.display = 'none';
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded event fired, creating App instance');
        new App();
    });
} else {
    console.log('Document already loaded, creating App instance immediately');
    new App();
}
