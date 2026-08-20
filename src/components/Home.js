import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api, { GENRES } from "../utils/api";
import GenreFilter from "./GenreFilter";
import HeroBanner from "./HeroBanner";
import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";
import Toast from "./Toast";

function Home({ globalSearch, onResetGlobalSearch }) {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentGenreParam = params.genre || null;
  const urlQuery = searchParams.get("q") || globalSearch || "";

  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("info");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Derive genre ID from genre name
  const currentGenreObj = currentGenreParam
    ? GENRES.find(g => g.name.toLowerCase() === currentGenreParam.toLowerCase())
    : null;
  const currentGenreId = currentGenreObj ? currentGenreObj.id : null;

  // Track scroll position for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getRecentDateRange = () => {
    const today = new Date();
    const threeYearsAgo = new Date(today);
    threeYearsAgo.setFullYear(today.getFullYear() - 3);

    return {
      from: threeYearsAgo.toISOString().slice(0, 10),
      to: today.toISOString().slice(0, 10)
    };
  };

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (urlQuery.trim()) {
        response = await api.searchMovies(urlQuery.trim(), page);
      } else {
        const releaseRange = currentGenreId === null ? getRecentDateRange() : null;
        response = await api.getPopularMovies(page, currentGenreId, sortBy, releaseRange);
      }

      if (response && response.data) {
        setMovies(response.data.results || []);
        setTotalPages(Math.min(response.data.total_pages || 1, 500));
        setTotalResults(response.data.total_results || 0);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [page, currentGenreId, sortBy, urlQuery]);

  useEffect(() => {
    fetchMovies();
    setPageInput(String(page));
  }, [fetchMovies, page]);

  // Update document title
  useEffect(() => {
    if (urlQuery) {
      document.title = `Search: "${urlQuery}" — Movies Everywhere`;
    } else if (currentGenreParam) {
      document.title = `${currentGenreParam} Movies — Movies Everywhere`;
    } else {
      document.title = "Movies Everywhere — Discover Great Cinema";
    }
  }, [currentGenreParam, urlQuery]);

  const handleGenreChange = (genreName) => {
    setPage(1);
    setPageInput("1");
    if (onResetGlobalSearch) onResetGlobalSearch();
    if (genreName) {
      navigate(`/genre/${encodeURIComponent(genreName)}`);
    } else {
      navigate("/");
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
    setPageInput("1");
  };

  const handlePageStep = (delta) => {
    const newPage = Math.max(1, Math.min(totalPages, page + delta));
    setPage(newPage);
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const parsed = parseInt(pageInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      setPage(parsed);
      window.scrollTo({ top: 380, behavior: "smooth" });
    } else {
      setPageInput(String(page));
    }
  };

  const handleFavoriteToggle = (movie, isAdded) => {
    setToastMessage(
      isAdded
        ? `Added "${movie.title}" to Watchlist`
        : `Removed "${movie.title}" from Watchlist`
    );
    setToastType(isAdded ? "success" : "info");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const heroMovie = (!urlQuery && page === 1 && movies.length > 0) ? movies[0] : null;
  const gridMovies = heroMovie ? movies.slice(1) : movies;

  return (
    <div className="home-page-root">
      {/* Genre Filter Pills */}
      <GenreFilter
        selectedGenre={currentGenreParam}
        onSelectGenre={handleGenreChange}
      />

      {/* Featured Spotlight Banner (Only on page 1 of Discover) */}
      {!urlQuery && page === 1 && heroMovie && (
        <HeroBanner
          movie={heroMovie}
          onSelectMovie={(m) => setSelectedMovie(m)}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}

      {/* Browse Header & Controls */}
      <div className="browse-header-bar">
        <div className="browse-title-group">
          <p className="section-eyebrow">
            {urlQuery ? "Search Results" : currentGenreParam ? "Category" : "Explore Selection"}
          </p>
          <h2 className="section-main-title">
            {urlQuery
              ? `Results for "${urlQuery}"`
              : currentGenreParam
              ? `${currentGenreParam} Movies`
              : "Popular & Recent Cinema"}
            {totalResults > 0 && <span className="title-count-pill">{totalResults.toLocaleString()}</span>}
          </h2>
        </div>

        {!urlQuery && (
          <div className="sort-controls-box">
            <label htmlFor="movieSortSelect" className="sort-label">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="12" x2="14" y2="12"></line>
                <line x1="4" y1="18" x2="8" y2="18"></line>
              </svg>
              <span>Sort by</span>
            </label>
            <div className="select-wrapper">
              <select
                id="movieSortSelect"
                value={sortBy}
                onChange={handleSortChange}
                className="cinema-select"
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="primary_release_date.desc">Newest Releases</option>
                <option value="primary_release_date.asc">Oldest Releases</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Movies Grid or Loading Skeletons */}
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
      ) : gridMovies.length === 0 ? (
        <div className="empty-results-box">
          <div className="empty-icon">🎬</div>
          <h3>No movies found</h3>
          <p>We couldn't find any movies matching your current criteria. Try a different filter or search term.</p>
          <button
            type="button"
            className="btn-empty-discover"
            onClick={() => {
              navigate("/");
              if (onResetGlobalSearch) onResetGlobalSearch();
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="cinema-movies-grid">
          {gridMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelectMovie={(m) => setSelectedMovie(m)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && !loading && (
        <div className="pagination-bar">
          <div className="pagination-controls">
            <button
              type="button"
              className="pagination-btn nav-btn"
              disabled={page <= 1}
              onClick={() => handlePageStep(-1)}
              aria-label="Previous page"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Previous</span>
            </button>

            <div className="pagination-pages-indicator">
              <span className="current-page-tag">Page {page}</span>
              <span className="total-pages-tag">of {totalPages}</span>
            </div>

            <button
              type="button"
              className="pagination-btn nav-btn"
              disabled={page >= totalPages}
              onClick={() => handlePageStep(1)}
              aria-label="Next page"
            >
              <span>Next</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <form className="page-jump-form" onSubmit={handlePageInputSubmit}>
            <span className="jump-label">Jump to:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="page-jump-input"
              aria-label="Jump to page number"
            />
            <button type="submit" className="page-jump-btn">Go</button>
          </form>
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

      {/* Back to Top Floating Button */}
      {showScrollTop && (
        <button
          type="button"
          className="back-to-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          title="Back to top"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
}

export default Home;
