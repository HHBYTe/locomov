import { API } from './modules/api.js';
import { MovieList } from './modules/movieList.js';
import { Search } from './modules/search.js';
import { Player } from './modules/player.js';

class App {
    constructor() {
        this.api = new API();
        this.movieList = new MovieList(this.api);
        this.search = new Search(this.api);
        this.player = new Player(this.api);
        
        this.init();
    }
    
    init() {
        // Load all movies on startup
        this.movieList.loadMovies();
        
        // Setup search
        this.search.onSearch((query) => {
            if (query.trim()) {
                this.movieList.searchMovies(query);
            } else {
                this.movieList.loadMovies();
            }
        });
        
        // Setup movie selection
        this.movieList.onMovieSelect((movie) => {
            this.player.playMovie(movie);
        });
        
        // Setup back button
        this.player.onBack(() => {
            this.movieList.show();
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
