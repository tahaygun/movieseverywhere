import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-code">404</div>
        <h2 className="not-found-title">Scene Not Found</h2>
        <p className="not-found-desc">
          Looks like this reel was left on the cutting room floor. The page you are looking for does not exist or has moved.
        </p>
        <Link to="/" className="btn-empty-discover">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Return to Cinema
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
