// api.js
import { mockMovies, mockSeries } from '../mock/mock_data.js';

export class API {
  constructor() {
    this.baseURL = '/api';

    // SET THIS TO TRUE TO USE MOCK DATA
    this.useMockData = true;

    console.log('API initialized with baseURL:', this.baseURL);
    console.log('Mock data enabled:', this.useMockData);

    // Mock data (now imported)
    this.mockMovies = mockMovies;
    this.mockSeries = mockSeries;
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
      return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
    }
    return `${this.baseURL}/stream/episode/${episodeId}`;
  }

  getSubtitleURL(type, itemId, subtitleFilename) {
    if (this.useMockData) {
      return '';
    }
    return `${this.baseURL}/stream/subtitle/${type}/${itemId}/${subtitleFilename}`;
  }
}
