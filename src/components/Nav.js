import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getFavorites } from "../utils/favorites";

function Nav({ searchQuery, onSearchChange, onSearchSubmit }) {
  const [favCount, setFavCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateCount = () => {
      setFavCount(getFavorites().length);
    };
    updateCount();
    window.addEventListener("favorites_changed", updateCount);
    return () => window.removeEventListener("favorites_changed", updateCount);
  }, []);

  useEffect(() => {
    setLocalSearch(searchQuery || "");
  }, [searchQuery]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(localSearch);
    } else if (location.pathname !== "/") {
      navigate(`/?q=${encodeURIComponent(localSearch)}`);
    }
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  return (
    <header className="navbar-root">
      <div className="navbar-container">
        {/* Brand Logo */}
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line>
              <line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">MOVIES</span>
            <span className="brand-sub">EVERYWHERE</span>
          </div>
        </NavLink>

        {/* Global Search Bar */}
        <form className="nav-search-form" onSubmit={handleSearchFormSubmit}>
          <div className="search-input-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="nav-search-input"
              placeholder="Search movies by title..."
              value={localSearch}
              onChange={handleSearchInputChange}
              aria-label="Search movies"
            />
            {localSearch && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* Navigation Links */}
        <nav className={`navbar-links ${mobileMenuOpen ? "is-open" : ""}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>Explore</span>
          </NavLink>

          <NavLink
            to="/bestmoviesofyear"
            className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
            <span>Year Vault</span>
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) => `nav-item-link fav-link ${isActive ? "active" : ""}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>Watchlist</span>
            {favCount > 0 && <span className="nav-fav-badge">{favCount}</span>}
          </NavLink>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

export default Nav;
