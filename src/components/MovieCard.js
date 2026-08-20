import React, { useState } from "react";
import { getImageUrl, getGenreNames } from "../utils/api";
import { isFavorite, toggleFavorite } from "../utils/favorites";

function MovieCard({ movie, rank, onSelectMovie, onFavoriteToggle }) {
  const [favorited, setFavorited] = useState(isFavorite(movie.id));
  const [imageLoaded, setImageLoaded] = useState(false);

  const releaseYear = (movie.release_date || "").slice(0, 4);
  const rating = Number(movie.vote_average || 0).toFixed(1);
  const posterUrl = getImageUrl(movie.poster_path, "w500");
  const genres = getGenreNames(movie.genre_ids || movie.genres);
  const primaryGenre = genres.length > 0 ? genres[0] : null;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    const result = toggleFavorite(movie);
    setFavorited(result.added);
    if (onFavoriteToggle) {
      onFavoriteToggle(movie, result.added);
    }
  };

  const handleCardClick = () => {
    if (onSelectMovie) {
      onSelectMovie(movie);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      className="cinema-card"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${movie.title}`}
    >
      <div className="card-poster-wrapper">
        {rank !== undefined && rank !== null && (
          <div className={`rank-badge rank-${rank <= 3 ? rank : 'default'}`}>
            #{rank}
          </div>
        )}

        <button
          type="button"
          className={`card-fav-btn ${favorited ? "is-fav" : ""}`}
          onClick={handleFavoriteClick}
          aria-label={favorited ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
          title={favorited ? "Remove from watchlist" : "Add to watchlist"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        {posterUrl ? (
          <>
            {!imageLoaded && <div className="card-poster-skeleton" />}
            <img
              src={posterUrl}
              alt={movie.title}
              className={`card-poster-img ${imageLoaded ? "is-loaded" : ""}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </>
        ) : (
          <div className="card-poster-fallback">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
            </svg>
            <span>No Poster</span>
          </div>
        )}

        <div className="card-overlay-hover">
          <p className="card-hover-overview">
            {movie.overview ? movie.overview.slice(0, 120) + (movie.overview.length > 120 ? "..." : "") : "Click to view full synopsis and trailers."}
          </p>
          <span className="card-hover-btn">
            Quick View
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
        </div>
      </div>

      <div className="card-info">
        <div className="card-meta-row">
          {releaseYear && <span className="card-year">{releaseYear}</span>}
          {primaryGenre && <span className="card-genre-tag">{primaryGenre}</span>}
          <div className="card-rating">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>{rating}</span>
          </div>
        </div>

        <h3 className="card-title" title={movie.title}>
          {movie.title}
        </h3>
      </div>
    </article>
  );
}

export default MovieCard;
