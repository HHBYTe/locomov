export class API {
    constructor() {
        this.baseURL = '/api';
        console.log('API initialized with baseURL:', this.baseURL);
    }
    
    // Movies
    async getMovies() {
        const url = `${this.baseURL}/movies/`;
        console.log('Fetching movies from:', url);
        
        try {
            const response = await fetch(url);
            console.log('Response status:', response.status);
            console.log('Response headers:', [...response.headers.entries()]);
            
            if (!response.ok) {
                const text = await response.text();
                console.error('Response not OK:', response.status, text);
                throw new Error(`Failed to fetch movies: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Movies data received:', data);
            return data;
        } catch (error) {
            console.error('Error fetching movies:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            throw error;
        }
    }
    
    async searchMovies(query) {
        const url = `${this.baseURL}/movies/search?q=${encodeURIComponent(query)}`;
        console.log('Searching movies:', url);
        
        try {
            const response = await fetch(url);
            console.log('Search response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Failed to search movies: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Search results:', data);
            return data;
        } catch (error) {
            console.error('Error searching movies:', error);
            throw error;
        }
    }
    
    getMovieStreamURL(movieId) {
        const url = `${this.baseURL}/stream/movie/${movieId}`;
        console.log('Movie stream URL:', url);
        return url;
    }
    
    // Series
    async getSeries() {
        const url = `${this.baseURL}/series/`;
        console.log('Fetching series from:', url);
        
        try {
            const response = await fetch(url);
            console.log('Series response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch series: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Series data received:', data);
            return data;
        } catch (error) {
            console.error('Error fetching series:', error);
            throw error;
        }
    }
    
    async searchSeries(query) {
        const url = `${this.baseURL}/series/search?q=${encodeURIComponent(query)}`;
        console.log('Searching series:', url);
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to search series: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error searching series:', error);
            throw error;
        }
    }
    
    async getSeriesDetail(seriesId) {
        const url = `${this.baseURL}/series/${seriesId}`;
        console.log('Fetching series detail:', url);
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch series detail: ${response.status}`);
            }
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
