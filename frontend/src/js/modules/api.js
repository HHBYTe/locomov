export class API {
    constructor() {
        this.baseURL = '/api';
    }
    
    // Movies
    async getMovies() {
        try {
            const response = await fetch(`${this.baseURL}/movies/`);
            if (!response.ok) throw new Error('Failed to fetch movies');
            return await response.json();
        } catch (error) {
            console.error('Error fetching movies:', error);
            throw error;
        }
    }
    
    async searchMovies(query) {
        try {
            const response = await fetch(`${this.baseURL}/movies/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to search movies');
            return await response.json();
        } catch (error) {
            console.error('Error searching movies:', error);
            throw error;
        }
    }
    
    getMovieStreamURL(movieId) {
        return `${this.baseURL}/stream/movie/${movieId}`;
    }
    
    // Series
    async getSeries() {
        try {
            const response = await fetch(`${this.baseURL}/series/`);
            if (!response.ok) throw new Error('Failed to fetch series');
            return await response.json();
        } catch (error) {
            console.error('Error fetching series:', error);
            throw error;
        }
    }
    
    async searchSeries(query) {
        try {
            const response = await fetch(`${this.baseURL}/series/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to search series');
            return await response.json();
        } catch (error) {
            console.error('Error searching series:', error);
            throw error;
        }
    }
    
    async getSeriesDetail(seriesId) {
        try {
            const response = await fetch(`${this.baseURL}/series/${seriesId}`);
            if (!response.ok) throw new Error('Failed to fetch series detail');
            return await response.json();
        } catch (error) {
            console.error('Error fetching series detail:', error);
            throw error;
        }
    }
    
    getEpisodeStreamURL(episodeId) {
        return `${this.baseURL}/stream/episode/${episodeId}`;
    }
    
    getSubtitleURL(type, itemId, subtitleFilename) {
        return `${this.baseURL}/stream/subtitle/${type}/${itemId}/${subtitleFilename}`;
    }
}
