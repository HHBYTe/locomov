import { API } from './modules/api.js';
import { MovieList } from './modules/movieList.js';
import { SeriesList } from './modules/seriesList.js';
import { Episodes } from './modules/episodes.js';
import { Search } from './modules/search.js';
import { Player } from './modules/player.js';

class App {
    constructor() {
        console.log('App constructor started');
        
        this.verifyDOMElements();
        
        this.api = new API();
        this.movieList = new MovieList(this.api);
        this.seriesList = new SeriesList(this.api);
        this.episodes = new Episodes(this.api);
        this.search = new Search(this.api);
        this.player = new Player(this.api);
        
        this.currentView = 'movies';
        
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
        } else {
            console.log('All required DOM elements found');
        }
    }
    
    init() {
        console.log('Starting init()');
        
        // Check URL parameters to determine initial view
        const urlParams = new URLSearchParams(window.location.search);
        const viewParam = urlParams.get('view');
        const searchParam = urlParams.get('search');
        
        if (viewParam === 'series') {
            this.currentView = 'series';
            this.switchToSeries();
            
            // If there's a search parameter, perform search
            if (searchParam) {
                this.search.setValue(searchParam);
                this.seriesList.searchSeries(searchParam);
            }
        } else {
            this.currentView = 'movies';
            
            // If there's a search parameter, perform search
            if (searchParam) {
                this.search.setValue(searchParam);
                this.movieList.searchMovies(searchParam);
            } else {
                this.movieList.loadMovies();
            }
        }
        
        this.setupTabs();
        this.setupKeyboardNavigation();
        
        this.search.onSearch((query) => {
            console.log('Search triggered:', query);
            
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
        
        this.movieList.onMovieSelect((movie) => {
            console.log('Movie selected:', movie);
            this.player.playMovie(movie);
        });
        
        this.seriesList.onSeriesSelect((series) => {
            console.log('Series selected:', series);
            this.episodes.showEpisodes(series);
        });
        
        this.episodes.onEpisodeSelect((episode, series) => {
            console.log('Episode selected:', episode);
            this.player.playEpisode(episode, series);
        });
        
        this.player.onBack(() => {
            console.log('Player back button clicked');
            if (this.currentView === 'movies') {
                this.showMovies();
            } else if (this.episodes.getCurrentSeries()) {
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
            console.log('Movies tab clicked - going home');
            this.goHomeMovies();
        });
        
        seriesTab.addEventListener('click', () => {
            console.log('Series tab clicked - going home');
            this.goHomeSeries();
        });
    }
    
    goHomeMovies() {
        // Stop player if playing
        this.player.stop();
        
        // Switch to movies view
        this.currentView = 'movies';
        
        // Update tabs
        document.getElementById('moviesTab').classList.add('active');
        document.getElementById('seriesTab').classList.remove('active');
        
        // Clear search
        this.search.clear();
        
        // Show movies section
        this.showMovies();
        
        // Reload movies from scratch
        this.movieList.loadMovies();
        
        // Update URL
        window.history.pushState({}, '', '/app.html?view=movies');
    }
    
    goHomeSeries() {
        // Stop player if playing
        this.player.stop();
        
        // Switch to series view
        this.currentView = 'series';
        
        // Update tabs
        document.getElementById('seriesTab').classList.add('active');
        document.getElementById('moviesTab').classList.remove('active');
        
        // Clear search
        this.search.clear();
        
        // Show series section
        this.showSeries();
        
        // Reload series from scratch
        this.seriesList.loadSeries();
        
        // Update URL
        window.history.pushState({}, '', '/app.html?view=series');
    }
    
    setupKeyboardNavigation() {
        const searchInput = document.getElementById('searchInput');
        
        document.addEventListener('keydown', (e) => {
            // Don't handle if video player is focused
            if (document.activeElement.tagName === 'VIDEO') {
                return;
            }
            
            // Handle ESC
            if (e.key === 'Escape') {
                e.preventDefault();
                
                const playerSection = document.getElementById('playerSection');
                const episodesSection = document.getElementById('episodesSection');
                
                if (playerSection.style.display !== 'none') {
                    document.getElementById('backButton').click();
                } else if (episodesSection.style.display !== 'none') {
                    document.getElementById('backToSeriesButton').click();
                }
                
                return;
            }
            
            // Handle left/right arrow keys to switch tabs (not in player view)
            const playerSection = document.getElementById('playerSection');
            const episodesSection = document.getElementById('episodesSection');
            
            if (playerSection.style.display === 'none') {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    if (this.currentView === 'series' || episodesSection.style.display !== 'none') {
                        this.goHomeMovies();
                    }
                    return;
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    if (this.currentView === 'movies') {
                        this.goHomeSeries();
                    }
                    return;
                }
            }
            
            // Focus search input on any letter/number key
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                if (document.activeElement !== searchInput) {
                    searchInput.focus();
                    // Let the character be typed
                }
                return;
            }
            
            // Arrow key navigation - now works even when search is focused
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                
                if (this.currentView === 'movies' && document.getElementById('moviesSection').style.display !== 'none') {
                    this.movieList.moveFocusUp();
                } else if (this.currentView === 'series' && document.getElementById('seriesSection').style.display !== 'none') {
                    this.seriesList.moveFocusUp();
                } else if (document.getElementById('episodesSection').style.display !== 'none') {
                    this.episodes.moveFocusUp();
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                
                if (this.currentView === 'movies' && document.getElementById('moviesSection').style.display !== 'none') {
                    this.movieList.moveFocusDown();
                } else if (this.currentView === 'series' && document.getElementById('seriesSection').style.display !== 'none') {
                    this.seriesList.moveFocusDown();
                } else if (document.getElementById('episodesSection').style.display !== 'none') {
                    this.episodes.moveFocusDown();
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                
                if (this.currentView === 'movies' && document.getElementById('moviesSection').style.display !== 'none') {
                    this.movieList.selectFocusedItem();
                } else if (this.currentView === 'series' && document.getElementById('seriesSection').style.display !== 'none') {
                    this.seriesList.selectFocusedItem();
                } else if (document.getElementById('episodesSection').style.display !== 'none') {
                    this.episodes.selectFocusedItem();
                }
            }
        });
    }
    
    switchToMovies() {
        console.log('Switching to movies view');
        this.currentView = 'movies';
        
        document.getElementById('moviesTab').classList.add('active');
        document.getElementById('seriesTab').classList.remove('active');
        
        this.search.clear();
        
        this.showMovies();
        
        this.movieList.loadMovies();
    }
    
    switchToSeries() {
        console.log('Switching to series view');
        this.currentView = 'series';
        
        document.getElementById('seriesTab').classList.add('active');
        document.getElementById('moviesTab').classList.remove('active');
        
        this.search.clear();
        
        this.showSeries();
        
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