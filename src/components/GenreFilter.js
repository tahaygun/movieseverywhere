import React, { useRef } from "react";
import { GENRES } from "../utils/api";
import { Link } from "react-router-dom";

function GenreFilter({ selectedGenre, onSelectGenre }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="genre-filter-container">
      <button
        type="button"
        className="genre-scroll-arrow left"
        onClick={() => scroll("left")}
        aria-label="Scroll genres left"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div className="genre-pill-track" ref={scrollRef}>
        <Link
          to="/"
          className={`genre-pill ${!selectedGenre ? "active" : ""}`}
          onClick={() => onSelectGenre(null)}
        >
          <span className="genre-pill-icon">🎬</span>
          <span>All Genres</span>
        </Link>

        {GENRES.map((g) => {
          const isSelected = selectedGenre && selectedGenre.toLowerCase() === g.name.toLowerCase();
          return (
            <Link
              key={g.id}
              to={`/genre/${encodeURIComponent(g.name)}`}
              className={`genre-pill ${isSelected ? "active" : ""}`}
              onClick={() => onSelectGenre(g.name)}
            >
              <span>{g.name}</span>
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        className="genre-scroll-arrow right"
        onClick={() => scroll("right")}
        aria-label="Scroll genres right"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
}

export default GenreFilter;
