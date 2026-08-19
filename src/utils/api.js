import axios from "axios";

const api = {
  getPopularMovies: function(page, genre, sortBy, releaseDateRange) {
    const params = {
      api_key: "fcc099706b1d178f223fb5741f1b8c01",
      sort_by: sortBy,
      "vote_count.gte": 300,
      include_adult: false,
      page: page
    };

    if (genre !== null) {
      params.with_genres = genre;
    }

    if (releaseDateRange) {
      params["primary_release_date.gte"] = releaseDateRange.from;
      params["primary_release_date.lte"] = releaseDateRange.to;
    }

    return axios.get("https://api.themoviedb.org/3/discover/movie", { params });
  },
  getMoviesOfYear: function(year, page) {
    return axios.get("https://api.themoviedb.org/3/discover/movie", {
      params: {
        api_key: "fcc099706b1d178f223fb5741f1b8c01",
        primary_release_year: year,
        sort_by: "vote_average.desc",
        "vote_count.gte": 300,
        page: page
      }
    });
  }
};

export default api;
