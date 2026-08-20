import axios from "axios";

const API_KEY = "fcc099706b1d178f223fb5741f1b8c01";
const BASE_URL = "https://api.themoviedb.org/3";

export const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

export const GENRE_MAP = GENRES.reduce((acc, g) => {
  acc[g.id] = g.name;
  return acc;
}, {});

export function getGenreNames(genreIds) {
  if (!genreIds || !Array.isArray(genreIds)) return [];
  return genreIds
    .map(id => GENRE_MAP[id] || (typeof id === "object" ? id.name : null))
    .filter(Boolean);
}

export function getImageUrl(path, size = "w500") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getBackdropUrl(path, size = "w1280") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

const api = {
  getPopularMovies: function(page = 1, genre = null, sortBy = "popularity.desc", releaseDateRange = null) {
    const params = {
      api_key: API_KEY,
      sort_by: sortBy,
      "vote_count.gte": 150,
      include_adult: false,
      page: page
    };

    if (genre !== null && genre !== undefined) {
      params.with_genres = genre;
    }

    if (releaseDateRange) {
      params["primary_release_date.gte"] = releaseDateRange.from;
      params["primary_release_date.lte"] = releaseDateRange.to;
    }

    return axios.get(`${BASE_URL}/discover/movie`, { params });
  },

  getMoviesOfYear: function(year, page = 1) {
    return axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        primary_release_year: year,
        sort_by: "vote_average.desc",
        "vote_count.gte": 200,
        page: page
      }
    });
  },

  searchMovies: function(query, page = 1) {
    return axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
        include_adult: false,
        page: page
      }
    });
  },

  getMovieDetails: function(movieId) {
    return axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos,credits,recommendations"
      }
    });
  }
};

export default api;
