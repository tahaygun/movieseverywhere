import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="cinema-footer">
      <div className="footer-container">
        <div className="footer-brand-section">
          <div className="footer-brand-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
            </svg>
            <span className="footer-brand-text">Movies Everywhere</span>
          </div>
          <p className="footer-description">
            Your cinematic portal to explore timeless classics, new releases, and curated movie collections powered by TMDB.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Explore Movies</Link></li>
              <li><Link to="/bestmoviesofyear">Best of Year Vault</Link></li>
              <li><Link to="/favorites">My Watchlist</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Popular Genres</h4>
            <ul className="footer-links-list">
              <li><Link to="/genre/Action">Action</Link></li>
              <li><Link to="/genre/Sci-Fi">Sci-Fi</Link></li>
              <li><Link to="/genre/Drama">Drama</Link></li>
              <li><Link to="/genre/Animation">Animation</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Attribution</h4>
            <p className="footer-tmdb-note">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-tmdb-link"
            >
              Visit themoviedb.org
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <p className="footer-copy">
            © {new Date().getFullYear()} Movies Everywhere. Crafted for film enthusiasts.
          </p>
          <div className="footer-credit">
            <span>Made with precision by </span>
            <a
              href="https://github.com/tahaygun"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-author-link"
            >
              @tahaygun
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
