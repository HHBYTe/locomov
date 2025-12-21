export class Player {
    constructor(api) {
        this.api = api;
        this.playerSection = document.getElementById('playerSection');
        this.videoPlayer = document.getElementById('videoPlayer');
        this.backButton = document.getElementById('backButton');
        this.currentTitle = document.getElementById('currentTitle');
        this.currentMeta = document.getElementById('currentMeta');
        this.searchBar = document.querySelector('.search-bar');
        
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
        this.show();
        
        // Hide search bar when playing
        if (this.searchBar) {
            this.searchBar.style.display = 'none';
        }
        
        this.currentTitle.textContent = movie.title.toUpperCase();
        // Only show year, no length
        this.currentMeta.textContent = movie.year || '';
        
        const streamURL = this.api.getMovieStreamURL(movie.id);
        this.videoPlayer.src = streamURL;
        
        // Clear existing subtitles
        const existingTracks = this.videoPlayer.querySelectorAll('track');
        existingTracks.forEach(track => track.remove());
        
        // Add subtitles
        if (movie.subtitles && movie.subtitles.length > 0) {
            movie.subtitles.forEach((subtitle, index) => {
                const track = document.createElement('track');
                track.kind = 'subtitles';
                track.label = subtitle.language || `Subtitle ${index + 1}`;
                track.srclang = subtitle.language_code || 'en';
                track.src = this.api.getSubtitleURL('movie', movie.id, subtitle.filename);
                
                if (index === 0) {
                    track.default = true;
                }
                
                this.videoPlayer.appendChild(track);
            });
        }
        
        this.videoPlayer.load();
        this.videoPlayer.play().catch(err => {
            console.error('Error playing video:', err);
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    playEpisode(episode, series) {
        this.show();
        
        // Hide search bar when playing
        if (this.searchBar) {
            this.searchBar.style.display = 'none';
        }
        
        const episodeTitle = episode.title ? ` - ${episode.title}` : '';
        this.currentTitle.textContent = `${series.title.toUpperCase()} - S${episode.season}E${episode.episode}${episodeTitle}`;
        this.currentMeta.textContent = series.year || '';
        
        const streamURL = this.api.getEpisodeStreamURL(episode.id);
        this.videoPlayer.src = streamURL;
        
        // Clear existing subtitles
        const existingTracks = this.videoPlayer.querySelectorAll('track');
        existingTracks.forEach(track => track.remove());
        
        // Add subtitles
        if (episode.subtitles && episode.subtitles.length > 0) {
            episode.subtitles.forEach((subtitle, index) => {
                const track = document.createElement('track');
                track.kind = 'subtitles';
                track.label = subtitle.language || `Subtitle ${index + 1}`;
                track.srclang = subtitle.language_code || 'en';
                track.src = this.api.getSubtitleURL('episode', episode.id, subtitle.filename);
                
                if (index === 0) {
                    track.default = true;
                }
                
                this.videoPlayer.appendChild(track);
            });
        }
        
        this.videoPlayer.load();
        this.videoPlayer.play().catch(err => {
            console.error('Error playing video:', err);
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    stop() {
        this.videoPlayer.pause();
        this.videoPlayer.src = '';
        this.hide();
    }
    
    show() {
        document.getElementById('moviesSection').style.display = 'none';
        document.getElementById('seriesSection').style.display = 'none';
        document.getElementById('episodesSection').style.display = 'none';
        this.playerSection.style.display = 'block';
    }
    
    hide() {
        this.playerSection.style.display = 'none';
        // Show search bar when leaving player
        if (this.searchBar) {
            this.searchBar.style.display = 'block';
        }
    }
    
    onBack(callback) {
        this.onBackCallback = callback;
    }
}