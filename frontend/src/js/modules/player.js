.player-section {
    margin-bottom: 2rem;
}

.back-button {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text-color);
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 1rem;
    transition: var(--transition);
    margin-bottom: 1.5rem;
}

.back-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.player-container {
    background-color: #000;
    border-radius: var(--border-radius);
    overflow: hidden;
    margin-bottom: 2rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
}

.video-player {
    width: 100%;
    max-height: 70vh;
    display: block;
    background-color: #000;
}

.movie-info {
    padding: 1rem 0;
}

.movie-info h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.movie-info p {
    color: var(--text-secondary);
    font-size: 1.1rem;
}

/* Remove ALL video control overlays and gradients */

/* WebKit/Chrome/Safari - Remove gradient scrim */
video::-webkit-media-controls-enclosure {
    background: transparent !important;
    background-image: none !important;
    filter: none !important;
}

video::-webkit-media-controls-panel {
    background-color: rgba(20, 20, 20, 0.95) !important;
    background-image: none !important;
}

video::-webkit-media-controls {
    filter: none !important;
}

video::-webkit-media-controls-overlay-enclosure {
    display: none !important;
}

/* Remove the gradient overlay that appears over video */
video::-webkit-media-text-track-container {
    filter: none !important;
}

/* Firefox - Remove controls overlay */
video::-moz-media-controls {
    filter: none !important;
}

/* Additional fix for fullscreen gradient */
video:fullscreen::-webkit-media-controls-enclosure,
video:-webkit-full-screen::-webkit-media-controls-enclosure {
    background: transparent !important;
    background-image: none !important;
}

video:fullscreen::-webkit-media-controls-panel,
video:-webkit-full-screen::-webkit-media-controls-panel {
    background-color: rgba(20, 20, 20, 0.95) !important;
    background-image: none !important;
}

/* Ensure video itself has no filters in fullscreen */
video:fullscreen,
video:-webkit-full-screen,
video:-moz-full-screen,
video:-ms-fullscreen {
    filter: none !important;
}

/* Responsive */
@media (max-width: 768px) {
    .video-player {
        max-height: 50vh;
    }
    
    .movie-info h2 {
        font-size: 1.5rem;
    }
}
