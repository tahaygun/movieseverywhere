import React, { useEffect, useState } from "react";
import api, { getImageUrl, getBackdropUrl, getGenreNames } from "../utils/api";
import { isFavorite, toggleFavorite } from "../utils/favorites";

function MovieModal({ movie, onClose, onFavoriteToggle }) {
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [favorited, setFavorited] = useState(isFavorite(movie.id));

  useEffect(() => {
    let isMounted = true;
    setLoadingDetails(true);

    api.getMovieDetails(movie.id)
      .then(res => {
        if (isMounted) {
          setDetails(res.data);
          setLoadingDetails(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingDetails(false);
      });

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      isMounted = false;
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [movie.id, onClose]);

  const handleFavClick = () => {
    const res = toggleFavorite(movie);
    setFavorited(res.added);
    if (onFavoriteToggle) {
      onFavoriteToggle(movie, res.added);
    }
  };

  const backdrop = details?.backdrop_path || movie.backdrop_path;
  const poster = details?.poster_path || movie.poster_path;
  const title = details?.title || movie.title;
  const overview = details?.overview || movie.overview || "No synopsis available.";
  const releaseYear = (details?.release_date || movie.release_date || "").slice(0, 4);
  const fullReleaseDate = details?.release_date || movie.release_date || "Unknown";
  const rating = Number(details?.vote_average || movie.vote_average || 0).toFixed(1);
  const voteCount = details?.vote_count || movie.vote_count || 0;
  const runtime = details?.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : null;
  const tagline = details?.tagline;

  const genres = details?.genres
    ? details.genres.map(g => g.name)
    : getGenreNames(movie.genre_ids);

  // Find trailer if available
  const trailer = details?.videos?.results?.find(
    v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );
  const trailerUrl = trailer
    ? `https://www.youtube.com/watch?v=${trailer.key}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(title + " trailer")}`;

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-movie-title"
        aria-busy={loadingDetails}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close details modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {backdrop && (
          <div className="modal-hero-cover">
            <img
              src={getBackdropUrl(backdrop, "w1280")}
              alt={title}
              className="modal-backdrop-img"
            />
            <div className="modal-hero-gradient"></div>
          </div>
        )}

        <div className="modal-content-body">
          <div className="modal-poster-col">
            {poster ? (
              <img
                src={getImageUrl(poster, "w500")}
                alt={title}
                className="modal-poster-img"
              />
            ) : (
              <div className="modal-poster-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                  <line x1="7" y1="2" x2="7" y2="22"></line>
                  <line x1="17" y1="2" x2="17" y2="22"></line>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                </svg>
                <span>No Poster</span>
              </div>
            )}
          </div>

          <div className="modal-info-col">
            <div className="modal-meta-header">
              <div className="modal-badges">
                {releaseYear && <span className="modal-badge year-badge">{releaseYear}</span>}
                {runtime && <span className="modal-badge runtime-badge">{runtime}</span>}
                <span className="modal-badge rating-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  {rating} <span>({voteCount.toLocaleString()} votes)</span>
                </span>
              </div>
              <h2 id="modal-movie-title" className="modal-title">{title}</h2>
              {tagline && <p className="modal-tagline">“{tagline}”</p>}
            </div>

            {genres && genres.length > 0 && (
              <div className="modal-genre-pills">
                {genres.map(g => (
                  <span key={g} className="modal-genre-tag">{g}</span>
                ))}
              </div>
            )}

            <div className="modal-section">
              <h3 className="modal-section-title">Synopsis</h3>
              <p className="modal-overview-text">{overview}</p>
            </div>

            {details?.credits?.cast && details.credits.cast.length > 0 && (
              <div className="modal-section">
                <h3 className="modal-section-title">Top Cast</h3>
                <div className="modal-cast-list">
                  {details.credits.cast.slice(0, 5).map(person => (
                    <span key={person.id} className="modal-cast-chip">
                      <strong>{person.name}</strong> <small>as {person.character || "Cast"}</small>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-details-grid">
              <div>
                <span className="modal-detail-label">Release Date</span>
                <span className="modal-detail-val">{fullReleaseDate}</span>
              </div>
              {details?.spoken_languages && details.spoken_languages.length > 0 && (
                <div>
                  <span className="modal-detail-label">Language</span>
                  <span className="modal-detail-val">{details.spoken_languages[0].english_name || details.spoken_languages[0].name}</span>
                </div>
              )}
            </div>

            <div className="modal-action-buttons">
              <a
                href={trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-modal-action btn-trailer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Watch Trailer
              </a>

              <button
                type="button"
                onClick={handleFavClick}
                className={`btn-modal-action btn-fav ${favorited ? "active" : ""}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {favorited ? "Saved in Watchlist" : "Add to Watchlist"}
              </button>

              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(title + (releaseYear ? ` ${releaseYear}` : ""))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-modal-action btn-google"
                title="Search on Google"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Google
              </a>

              <a
                href={`https://www.themoviedb.org/movie/${movie.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-modal-action btn-tmdb"
                title="View on TMDB"
              >
                TMDB
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
