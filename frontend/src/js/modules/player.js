export class Player {
    constructor(api) {
        this.api = api;
        this.playerSection = document.getElementById('playerSection');
        this.videoPlayer = document.getElementById('videoPlayer');
        this.backButton = document.getElementById('backButton');
        this.currentTitle = document.getElementById('currentTitle');
        this.currentMeta = document.getElementById('currentMeta');
        
        this.onBackCallback = null;
        this.currentType = null; // 'movie' or 'episode'
        
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
        this.currentType = 'movie';
        
        // Hide other sections
        document.getElementById('moviesSection').style.display = 'none';
        document.getElementById('seriesSection').style.display = 'none';
        document.getElementById('episodesSection').style.display = 'none';
        
        // Show player section
        this.playerSection.style.display = 'block';
        
        // Update info
        this.currentTitle.textContent = movie.title;
        this.currentMeta.textContent = movie.year || '';
        
        // Set video source
        const streamURL = this.api.getMovieStreamURL(movie.id);
        this.videoPlayer.src = streamURL;
        
        // Clear existing subtitles
        this.clearSubtitles();
        
        // Add subtitles if available
        if (movie.subtitles && movie.subtitles.length > 0) {
            this.addSubtitles(movie.subtitles, 'movie', movie.id);
        }
        
        // Play video
        this.videoPlayer.load();
        this.videoPlayer.play().catch(error => {
            console.error('Error playing video:', error);
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    playEpisode(episode, series) {
        this.currentType = 'episode';
        
        // Hide other sections
        document.getElementById('moviesSection').style.display = 'none';
        document.getElementById('seriesSection').style.display = 'none';
        document.getElementById('episodesSection').style.display = 'none';
        
        // Show player section
        this.playerSection.style.display = 'block';
        
        // Update info
        this.currentTitle.textContent = series.title;
        const episodeInfo = `S${episode.season}E${episode.episode}${episode.title ? ': ' + episode.title : ''}`;
        this.currentMeta.textContent = episodeInfo;
        
        // Set video source
        const streamURL = this.api.getEpisodeStreamURL(episode.id);
        this.videoPlayer.src = streamURL;
        
        // Clear existing subtitles
        this.clearSubtitles();
        
        // Add subtitles if available
        if (episode.subtitles && episode.subtitles.length > 0) {
            this.addSubtitles(episode.subtitles, 'episode', episode.id);
        }
        
        // Play video
        this.videoPlayer.load();
        this.videoPlayer.play().catch(error => {
            console.error('Error playing video:', error);
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    clearSubtitles() {
        // Remove all existing track elements
        const tracks = this.videoPlayer.querySelectorAll('track');
        tracks.forEach(track => track.remove());
    }
    
    addSubtitles(subtitles, type, itemId) {
        subtitles.forEach((subtitle, index) => {
            const track = document.createElement('track');
            track.kind = 'subtitles';
            track.label = subtitle.language.toUpperCase();
            track.srclang = subtitle.language;
            track.src = this.api.getSubtitleURL(type, itemId, subtitle.filename);
            
            // Set first subtitle as default
            if (index === 0) {
                track.default = true;
            }
            
            this.videoPlayer.appendChild(track);
        });
    }
    
    stop() {
        this.videoPlayer.pause();
        this.videoPlayer.src = '';
        this.clearSubtitles();
        this.playerSection.style.display = 'none';
    }
    
    hide() {
        this.playerSection.style.display = 'none';
    }
    
    onBack(callback) {
        this.onBackCallback = callback;
    }
}
