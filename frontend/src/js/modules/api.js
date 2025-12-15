export class API {
    constructor() {
        this.baseURL = '/api';
    }
    
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
    
    getStreamURL(movieId) {
        return `${this.baseURL}/stream/${movieId}`;
    }
}
