export class API {
    constructor() {
        this.baseURL = '/api';
        
        // SET THIS TO TRUE TO USE MOCK DATA
        this.useMockData = true;
        
        console.log('API initialized with baseURL:', this.baseURL);
        console.log('Mock data enabled:', this.useMockData);
        
        // Mock data
        this.mockMovies = [
            { id: 1, title: "The Matrix", year: "1999", length: "2h 16m", subtitles: [{ language: "English", language_code: "en", filename: "matrix_en.srt" }] },
            { id: 2, title: "Inception", year: "2010", length: "2h 28m", subtitles: [] },
            { id: 3, title: "Interstellar", year: "2014", length: "2h 49m", subtitles: [{ language: "English", language_code: "en", filename: "inter_en.srt" }] },
            { id: 4, title: "The Dark Knight", year: "2008", length: "2h 32m", subtitles: [] },
            { id: 5, title: "Pulp Fiction", year: "1994", length: "2h 34m", subtitles: [] },
            { id: 6, title: "Fight Club", year: "1999", length: "2h 19m", subtitles: [] },
            { id: 7, title: "Forrest Gump", year: "1994", length: "2h 22m", subtitles: [] },
            { id: 8, title: "The Shawshank Redemption", year: "1994", length: "2h 22m", subtitles: [] },
            { id: 9, title: "Goodfellas", year: "1990", length: "2h 26m", subtitles: [] },
            { id: 10, title: "The Godfather", year: "1972", length: "2h 55m", subtitles: [] },
            { id: 11, title: "Blade Runner 2049", year: "2017", length: "2h 44m", subtitles: [] },
            { id: 12, title: "Mad Max Fury Road", year: "2015", length: "2h 0m", subtitles: [] },
            { id: 13, title: "Dune", year: "2021", length: "2h 35m", subtitles: [] },
            { id: 14, title: "The Social Network", year: "2010", length: "2h 0m", subtitles: [] },
            { id: 15, title: "Parasite", year: "2019", length: "2h 12m", subtitles: [{ language: "English", language_code: "en", filename: "parasite_en.srt" }] }
        ];
        
        this.mockSeries = [
            {
                id: 1,
                title: "Breaking Bad",
                year: "2008-2013",
                total_episodes: 62,
                seasons: [
                    {
                        season_number: 1,
                        episodes: [
                            { id: 101, season: 1, episode: 1, title: "Pilot", subtitles: [] },
                            { id: 102, season: 1, episode: 2, title: "Cat's in the Bag", subtitles: [] },
                            { id: 103, season: 1, episode: 3, title: "And the Bag's in the River", subtitles: [] },
                            { id: 104, season: 1, episode: 4, title: "Cancer Man", subtitles: [] },
                            { id: 105, season: 1, episode: 5, title: "Gray Matter", subtitles: [] }
                        ]
                    },
                    {
                        season_number: 2,
                        episodes: [
                            { id: 201, season: 2, episode: 1, title: "Seven Thirty-Seven", subtitles: [] },
                            { id: 202, season: 2, episode: 2, title: "Grilled", subtitles: [] },
                            { id: 203, season: 2, episode: 3, title: "Bit by a Dead Bee", subtitles: [] }
                        ]
                    }
                ]
            },
            {
                id: 2,
                title: "Game of Thrones",
                year: "2011-2019",
                total_episodes: 73,
                seasons: [
                    {
                        season_number: 1,
                        episodes: [
                            { id: 301, season: 1, episode: 1, title: "Winter Is Coming", subtitles: [{ language: "English", language_code: "en", filename: "got_s1e1.srt" }] },
                            { id: 302, season: 1, episode: 2, title: "The Kingsroad", subtitles: [] },
                            { id: 303, season: 1, episode: 3, title: "Lord Snow", subtitles: [] }
                        ]
                    }
                ]
            },
            {
                id: 3,
                title: "Stranger Things",
                year: "2016-",
                total_episodes: 42,
                seasons: [
                    {
                        season_number: 1,
                        episodes: [
                            { id: 401, season: 1, episode: 1, title: "Chapter One: The Vanishing of Will Byers", subtitles: [] },
                            { id: 402, season: 1, episode: 2, title: "Chapter Two: The Weirdo on Maple Street", subtitles: [] }
                        ]
                    }
                ]
            },
            {
                id: 4,
                title: "The Wire",
                year: "2002-2008",
                total_episodes: 60,
                seasons: [
                    {
                        season_number: 1,
                        episodes: [
                            { id: 501, season: 1, episode: 1, title: "The Target", subtitles: [] },
                            { id: 502, season: 1, episode: 2, title: "The Detail", subtitles: [] }
                        ]
                    }
                ]
            },
            {
                id: 5,
                title: "The Sopranos",
                year: "1999-2007",
                total_episodes: 86,
                seasons: [
                    {
                        season_number: 1,
                        episodes: [
                            { id: 601, season: 1, episode: 1, title: "Pilot", subtitles: [] },
                            { id: 602, season: 1, episode: 2, title: "46 Long", subtitles: [] }
                        ]
                    }
                ]
            }
        ];
    }
    
    // Helper to simulate network delay
    async mockDelay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Movies
    async getMovies() {
        if (this.useMockData) {
            console.log('Using mock movies data');
            await this.mockDelay(300);
            return {
                movies: this.mockMovies,
                total: this.mockMovies.length
            };
        }
        
        const url = `${this.baseURL}/movies/`;
        console.log('Fetching movies from:', url);
        
        try {
            const response = await fetch(url);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch movies: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Movies data received:', data);
            return data;
        } catch (error) {
            console.error('Error fetching movies:', error);
            throw error;
        }
    }
    
    async searchMovies(query) {
        if (this.useMockData) {
            console.log('Using mock search for movies:', query);
            await this.mockDelay(200);
            
            const filtered = this.mockMovies.filter(movie => 
                movie.title.toLowerCase().includes(query.toLowerCase())
            );
            
            return {
                movies: filtered,
                total: filtered.length
            };
        }
        
        const url = `${this.baseURL}/movies/search?q=${encodeURIComponent(query)}`;
        console.log('Searching movies:', url);
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Failed to search movies: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error searching movies:', error);
            throw error;
        }
    }
    
    getMovieStreamURL(movieId) {
        if (this.useMockData) {
            // Return a sample video URL - you can replace with any MP4 URL
            return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
        }
        
        return `${this.baseURL}/stream/movie/${movieId}`;
    }
    
    // Series
    async getSeries() {
        if (this.useMockData) {
            console.log('Using mock series data');
            await this.mockDelay(300);
            return {
                series: this.mockSeries,
                total: this.mockSeries.length
            };
        }
        
        const url = `${this.baseURL}/series/`;
        console.log('Fetching series from:', url);
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch series: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching series:', error);
            throw error;
        }
    }
    
    async searchSeries(query) {
        if (this.useMockData) {
            console.log('Using mock search for series:', query);
            await this.mockDelay(200);
            
            const filtered = this.mockSeries.filter(series => 
                series.title.toLowerCase().includes(query.toLowerCase())
            );
            
            return {
                series: filtered,
                total: filtered.length
            };
        }
        
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
        if (this.useMockData) {
            console.log('Using mock series detail:', seriesId);
            await this.mockDelay(200);
            
            const series = this.mockSeries.find(s => s.id === seriesId);
            return series || null;
        }
        
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
        if (this.useMockData) {
            // Return a sample video URL
            return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
        }
        
        return `${this.baseURL}/stream/episode/${episodeId}`;
    }
    
    getSubtitleURL(type, itemId, subtitleFilename) {
        if (this.useMockData) {
            // Mock subtitles won't work, but won't break either
            return '';
        }
        
        return `${this.baseURL}/stream/subtitle/${type}/${itemId}/${subtitleFilename}`;
    }
}