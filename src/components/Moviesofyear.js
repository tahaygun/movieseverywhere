import React, { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";
import Toast from "./Toast";

const DECADES = [
  { label: "2020s", year: 2024 },
  { label: "2010s", year: 2019 },
  { label: "2000s", year: 2008 },
  { label: "1990s", year: 1994 },
  { label: "1980s", year: 1985 },
  { label: "1970s", year: 1972 }
];

function Moviesofyear() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeYear, setActiveYear] = useState(currentYear);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("info");

  const years = [];
  for (let i = currentYear; i >= 1930; i--) {
    years.push(i);
  }

  const fetchYearMovies = useCallback(async (yearToFetch) => {
    setLoading(true);
    try {
      const response = await api.getMoviesOfYear(yearToFetch, 1);
      if (response && response.data) {
        setMovies(response.data.results ? response.data.results.slice(0, 20) : []);
        setActiveYear(yearToFetch);
        document.title = `Best Movies of ${yearToFetch} — Movies Everywhere`;
      }
    } catch (err) {
      console.error("Error fetching movies of year:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchYearMovies(selectedYear);
    window.scrollTo(0, 0);
  }, [fetchYearMovies, selectedYear]);

  const handleYearSelect = (year) => {
    const num = Number(year);
    setSelectedYear(num);
  };

  const handleFavoriteToggle = (movie, isAdded) => {
    setToastMessage(
      isAdded
        ? `Added "${movie.title}" to Watchlist`
        : `Removed "${movie.title}" from Watchlist`
    );
    setToastType(isAdded ? "success" : "info");
  };

  return (
    <div className="year-vault-page">
      {/* Header Banner */}
      <div className="vault-header-hero">
        <div className="vault-hero-content">
          <p className="section-eyebrow">Hall of Fame</p>
          <h1 className="vault-main-title">
            Best 20 Movies of <span className="highlight-year">{activeYear}</span>
          </h1>
          <p className="vault-subtitle">
            Curated top-rated cinematic masterpieces sorted by TMDB community scores and critical acclaim.
          </p>

          {/* Quick Decade Filter Pills */}
          <div className="decade-pills-row">
            <span className="decade-label">Decade Quick-picks:</span>
            {DECADES.map(d => (
              <button
                key={d.label}
                type="button"
                className={`decade-pill ${selectedYear === d.year ? "active" : ""}`}
                onClick={() => handleYearSelect(d.year)}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Year Dropdown Selector */}
          <div className="year-picker-bar">
            <div className="year-select-container">
              <label htmlFor="yearSelect" className="year-picker-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Select Year</span>
              </label>
              <select
                id="yearSelect"
                value={selectedYear}
                onChange={(e) => handleYearSelect(e.target.value)}
                className="year-custom-select"
              >
                {years.map(yr => (
                  <option key={yr} value={yr}>
                    Year {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="cinema-movies-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-poster" />
              <div className="skeleton-meta" />
              <div className="skeleton-title" />
            </div>
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="empty-results-box">
          <div className="empty-icon">🎞️</div>
          <h3>No films found for {activeYear}</h3>
          <p>Try picking another year from the selector above.</p>
        </div>
      ) : (
        <div className="cinema-movies-grid">
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              rank={index + 1}
              onSelectMovie={(m) => setSelectedMovie(m)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}

export default Moviesofyear;
