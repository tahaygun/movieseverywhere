import React, { useState } from "react";
import { getBackdropUrl, getImageUrl, getGenreNames } from "../utils/api";
import { isFavorite, toggleFavorite } from "../utils/favorites";

function HeroBanner({ movie, onSelectMovie, onFavoriteToggle }) {
  const [favorited, setFavorited] = useState(isFavorite(movie?.id));

  if (!movie) return null;

  const backdrop = getBackdropUrl(movie.backdrop_path || movie.poster_path, "w1280");
  const poster = getImageUrl(movie.poster_path, "w500");
  const releaseYear = (movie.release_date || "").slice(0, 4);
  const rating = Number(movie.vote_average || 0).toFixed(1);
  const genres = getGenreNames(movie.genre_ids || movie.genres);
  const primaryGenres = genres.slice(0, 3);

  const handleFavToggle = () => {
    const res = toggleFavorite(movie);
    setFavorited(res.added);
    if (onFavoriteToggle) {
      onFavoriteToggle(movie, res.added);
    }
  };

  return (
    <section className="hero-spotlight" aria-label="Featured Movie">
      <div className="hero-backdrop-wrapper">
        {backdrop && (
          <img
            src={backdrop}
            alt={movie.title}
            className="hero-backdrop-img"
          />
        )}
        <div className="hero-gradient-overlay"></div>
        <div className="hero-radial-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text-block">
          <div className="hero-eyebrow">
            <span className="hero-sparkle">✦</span>
            <span>Featured Selection</span>
          </div>

          <h1 className="hero-title">{movie.title}</h1>

          <div className="hero-meta-row">
            <div className="hero-badge rating">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>{rating} Rating</span>
            </div>

            {releaseYear && (
              <div className="hero-badge year">
                <span>{releaseYear}</span>
              </div>
            )}

            {primaryGenres.map(g => (
              <div key={g} className="hero-badge genre">
                <span>{g}</span>
              </div>
            ))}
          </div>

          <p className="hero-overview">
            {movie.overview || "Experience one of the most celebrated titles in modern cinema. Explore ratings, synopsis, and details."}
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn-hero-primary"
              onClick={() => onSelectMovie && onSelectMovie(movie)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Movie Details
            </button>

            <button
              type="button"
              className={`btn-hero-secondary ${favorited ? "is-fav" : ""}`}
              onClick={handleFavToggle}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {favorited ? "In Watchlist" : "Save to Watchlist"}
            </button>
          </div>
        </div>

        {poster && (
          <div
            className="hero-poster-preview"
            onClick={() => onSelectMovie && onSelectMovie(movie)}
            title="Click to view details"
          >
            <img src={poster} alt={movie.title} className="hero-poster-img" />
            <div className="hero-poster-glow"></div>
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroBanner;
