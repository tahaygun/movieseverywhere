import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./Nav";
import Home from "./Home";
import Moviesofyear from "./Moviesofyear";
import FavoritesView from "./FavoritesView";
import Footer from "./Footer";
import NotFound from "./NotFound";
import "../index.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleResetSearch = () => {
    setSearchQuery("");
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Nav
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={(q) => setSearchQuery(q)}
        />
        <main className="main-content-area">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  globalSearch={searchQuery}
                  onResetGlobalSearch={handleResetSearch}
                />
              }
            />
            <Route
              path="/genre/:genre"
              element={
                <Home
                  globalSearch={searchQuery}
                  onResetGlobalSearch={handleResetSearch}
                />
              }
            />
            <Route path="/bestmoviesofyear" element={<Moviesofyear />} />
            <Route path="/favorites" element={<FavoritesView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
