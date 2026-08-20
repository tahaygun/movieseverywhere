import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";
import Toast from "./Toast";
import { getFavorites } from "../utils/favorites";

function FavoritesView() {
  const [favorites, setFavorites] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("info");
  const [filterQuery, setFilterQuery] = useState("");

  const loadFavs = () => {
    setFavorites(getFavorites());
  };

  useEffect(() => {
    loadFavs();
    document.title = "My Watchlist — Movies Everywhere";
    window.scrollTo(0, 0);

    const handleFavChange = () => {
      loadFavs();
    };
    window.addEventListener("favorites_changed", handleFavChange);
    return () => window.removeEventListener("favorites_changed", handleFavChange);
  }, []);

  const handleFavoriteToggle = (movie, isAdded) => {
    setToastMessage(
      isAdded
        ? `Added "${movie.title}" to Watchlist`
        : `Removed "${movie.title}" from Watchlist`
    );
    setToastType(isAdded ? "success" : "info");
    loadFavs();
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire Watchlist?")) {
      localStorage.removeItem("movies_everywhere_favorites_v1");
      window.dispatchEvent(new Event("favorites_changed"));
      loadFavs();
      setToastMessage("Watchlist cleared.");
      setToastType("info");
    }
  };

  const filteredList = favorites.filter(movie =>
    movie.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="favorites-page">
      <div className="section-header-box">
        <div>
          <p className="section-eyebrow">Personal Vault</p>
          <h1 className="section-main-title">
            My Watchlist <span className="title-count-pill">{favorites.length}</span>
          </h1>
        </div>

        {favorites.length > 0 && (
          <div className="fav-controls-row">
            <div className="fav-search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Filter saved movies..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="fav-filter-input"
              />
            </div>

            <button
              type="button"
              className="btn-clear-favs"
              onClick={handleClearAll}
              title="Clear all saved movies"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Clear All
            </button>
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites-card">
          <div className="empty-fav-icon-wrapper">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h2 className="empty-fav-title">Your Watchlist is Empty</h2>
          <p className="empty-fav-desc">
            Discover trending movies or classics from our year vault and tap the heart icon to save them for your next movie night.
          </p>
          <Link to="/" className="btn-empty-discover">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Explore Movies Now
          </Link>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="empty-favorites-card">
          <h2 className="empty-fav-title">No matches found for "{filterQuery}"</h2>
          <p className="empty-fav-desc">Try searching with a different title keyword.</p>
          <button
            type="button"
            className="btn-empty-discover"
            onClick={() => setFilterQuery("")}
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="cinema-movies-grid">
          {filteredList.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelectMovie={(m) => setSelectedMovie(m)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}

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

export default FavoritesView;
