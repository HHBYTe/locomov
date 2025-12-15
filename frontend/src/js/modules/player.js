export class Player {
    constructor(api) {
        this.api = api;
        this.playerSection = document.getElementById('playerSection');
        this.moviesSection = document.getElementById('moviesSection');
        this.videoPlayer = document.getElementById('videoPlayer');
        this.backButton = document.getElementById('backButton');
        this.currentMovieTitle = document.getElementById('currentMovieTitle');
        this.currentMovieYear = document.getElementById('currentMovieYear');
        
        this.onBackCallback = null;
        
        this.init();
    }
    
    init() {
        this.backButton.addEventListener('click', () => {
            this.stop();
            if (this.onBackCallback) {
                this.onBackCallback();
            }
        });
    }
    
    playMovie(movie) {
        // Hide movies section
        this.moviesSection.style.display = 'none';
        
        // Show player section
        this.playerSection.style.display = 'block';
        
        // Update movie info
        this.currentMovieTitle.textContent = movie.title;
        this.currentMovieYear.textContent = movie.year || '';
        
        // Set video source
        const streamURL = this.api.getStreamURL(movie.id);
        this.videoPlayer.src = streamURL;
        
        // Play video
        this.videoPlayer.load();
        this.videoPlayer.play().catch(error => {
            console.error('Error playing video:', error);
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    stop() {
        this.videoPlayer.pause();
        this.videoPlayer.src = '';
        this.playerSection.style.display = 'none';
    }
    
    onBack(callback) {
        this.onBackCallback = callback;
    }
}
