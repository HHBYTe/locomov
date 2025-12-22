export const mockMovies = [
  { id: 1, title: "The Matrix", year: "1999", length: "2h 16m", subtitles: [{ language: "English", language_code: "en", filename: "matrix_en.srt" }] },
  { id: 2, title: "The Matrix Reloaded", year: "2003", length: "2h 18m", subtitles: [] },
  { id: 3, title: "The Matrix Revolutions", year: "2003", length: "2h 9m", subtitles: [] },

  { id: 4, title: "Inception", year: "2010", length: "2h 28m", subtitles: [] },
  { id: 5, title: "Interstellar", year: "2014", length: "2h 49m", subtitles: [{ language: "English", language_code: "en", filename: "inter_en.srt" }] },

  { id: 6, title: "The Dark Knight", year: "2008", length: "2h 32m", subtitles: [] },
  { id: 7, title: "The Dark Knight Rises", year: "2012", length: "2h 44m", subtitles: [] },
  { id: 8, title: "Batman Begins", year: "2005", length: "2h 20m", subtitles: [] },

  { id: 9, title: "Pulp Fiction", year: "1994", length: "2h 34m", subtitles: [] },
  { id: 10, title: "Reservoir Dogs", year: "1992", length: "1h 39m", subtitles: [] },
  { id: 11, title: "Kill Bill: Vol. 1", year: "2003", length: "1h 51m", subtitles: [] },
  { id: 12, title: "Kill Bill: Vol. 2", year: "2004", length: "2h 17m", subtitles: [] },

  { id: 13, title: "Fight Club", year: "1999", length: "2h 19m", subtitles: [] },
  { id: 14, title: "Se7en", year: "1995", length: "2h 7m", subtitles: [] },
  { id: 15, title: "Gone Girl", year: "2014", length: "2h 29m", subtitles: [] },

  { id: 16, title: "Forrest Gump", year: "1994", length: "2h 22m", subtitles: [] },
  { id: 17, title: "The Shawshank Redemption", year: "1994", length: "2h 22m", subtitles: [] },
  { id: 18, title: "The Green Mile", year: "1999", length: "3h 9m", subtitles: [] },

  { id: 19, title: "Goodfellas", year: "1990", length: "2h 26m", subtitles: [] },
  { id: 20, title: "Casino", year: "1995", length: "2h 58m", subtitles: [] },
  { id: 21, title: "The Irishman", year: "2019", length: "3h 29m", subtitles: [] },

  { id: 22, title: "The Godfather", year: "1972", length: "2h 55m", subtitles: [] },
  { id: 23, title: "The Godfather Part II", year: "1974", length: "3h 22m", subtitles: [] },
  { id: 24, title: "The Godfather Part III", year: "1990", length: "2h 42m", subtitles: [] },

  { id: 25, title: "Blade Runner", year: "1982", length: "1h 57m", subtitles: [] },
  { id: 26, title: "Blade Runner 2049", year: "2017", length: "2h 44m", subtitles: [] },

  { id: 27, title: "Mad Max: Fury Road", year: "2015", length: "2h 0m", subtitles: [] },
  { id: 28, title: "Dune", year: "2021", length: "2h 35m", subtitles: [] },
  { id: 29, title: "Arrival", year: "2016", length: "1h 56m", subtitles: [] },

  { id: 30, title: "Parasite", year: "2019", length: "2h 12m", subtitles: [{ language: "English", language_code: "en", filename: "parasite_en.srt" }] }
];

export const mockSeries = [
  {
    id: 1,
    title: "Breaking Bad",
    year: "2008-2013",
    total_episodes: 62,
    seasons: [
      {
        season_number: 1,
        episodes: Array.from({ length: 7 }, (_, i) => ({
          id: 100 + i + 1,
          season: 1,
          episode: i + 1,
          title: `Episode ${i + 1}`,
          subtitles: []
        }))
      },
      {
        season_number: 2,
        episodes: Array.from({ length: 13 }, (_, i) => ({
          id: 200 + i + 1,
          season: 2,
          episode: i + 1,
          title: `Episode ${i + 1}`,
          subtitles: []
        }))
      },
      {
        season_number: 3,
        episodes: Array.from({ length: 13 }, (_, i) => ({
          id: 300 + i + 1,
          season: 3,
          episode: i + 1,
          title: `Episode ${i + 1}`,
          subtitles: []
        }))
      },
      {
        season_number: 4,
        episodes: Array.from({ length: 13 }, (_, i) => ({
          id: 400 + i + 1,
          season: 4,
          episode: i + 1,
          title: `Episode ${i + 1}`,
          subtitles: []
        }))
      },
      {
        season_number: 5,
        episodes: Array.from({ length: 16 }, (_, i) => ({
          id: 500 + i + 1,
          season: 5,
          episode: i + 1,
          title: `Episode ${i + 1}`,
          subtitles: []
        }))
      }
    ]
  },

  {
    id: 2,
    title: "Game of Thrones",
    year: "2011-2019",
    total_episodes: 73,
    seasons: Array.from({ length: 8 }, (_, s) => ({
      season_number: s + 1,
      episodes: Array.from(
        { length: s === 7 ? 6 : s === 6 ? 7 : 10 },
        (_, e) => ({
          id: (s + 1) * 1000 + e + 1,
          season: s + 1,
          episode: e + 1,
          title: `Episode ${e + 1}`,
          subtitles: []
        })
      )
    }))
  },

  {
    id: 3,
    title: "The Wire",
    year: "2002-2008",
    total_episodes: 60,
    seasons: Array.from({ length: 5 }, (_, s) => ({
      season_number: s + 1,
      episodes: Array.from({ length: 12 }, (_, e) => ({
        id: (s + 1) * 2000 + e + 1,
        season: s + 1,
        episode: e + 1,
        title: `Episode ${e + 1}`,
        subtitles: []
      }))
    }))
  },

  {
    id: 4,
    title: "The Sopranos",
    year: "1999-2007",
    total_episodes: 86,
    seasons: Array.from({ length: 6 }, (_, s) => ({
      season_number: s + 1,
      episodes: Array.from(
        { length: s === 5 ? 21 : 13 },
        (_, e) => ({
          id: (s + 1) * 3000 + e + 1,
          season: s + 1,
          episode: e + 1,
          title: `Episode ${e + 1}`,
          subtitles: []
        })
      )
    }))
  },

  {
    id: 5,
    title: "Stranger Things",
    year: "2016-",
    total_episodes: 42,
    seasons: [
      { season_number: 1, episodes: Array.from({ length: 8 }, (_, e) => ({ id: 4100 + e, season: 1, episode: e + 1, title: `Episode ${e + 1}`, subtitles: [] })) },
      { season_number: 2, episodes: Array.from({ length: 9 }, (_, e) => ({ id: 4200 + e, season: 2, episode: e + 1, title: `Episode ${e + 1}`, subtitles: [] })) },
      { season_number: 3, episodes: Array.from({ length: 8 }, (_, e) => ({ id: 4300 + e, season: 3, episode: e + 1, title: `Episode ${e + 1}`, subtitles: [] })) },
      { season_number: 4, episodes: Array.from({ length: 9 }, (_, e) => ({ id: 4400 + e, season: 4, episode: e + 1, title: `Episode ${e + 1}`, subtitles: [] })) }
    ]
  },

  {
    id: 6,
    title: "Chernobyl",
    year: "2019",
    total_episodes: 5,
    seasons: [
      {
        season_number: 1,
        episodes: Array.from({ length: 5 }, (_, e) => ({
          id: 6000 + e + 1,
          season: 1,
          episode: e + 1,
          title: `Episode ${e + 1}`,
          subtitles: []
        }))
      }
    ]
  }
];
