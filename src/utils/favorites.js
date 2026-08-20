const STORAGE_KEY = "movies_everywhere_favorites_v1";

export function getFavorites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to load favorites", e);
    return [];
  }
}

export function isFavorite(movieId) {
  const list = getFavorites();
  return list.some(m => m.id === movieId);
}

export function toggleFavorite(movie) {
  const list = getFavorites();
  const index = list.findIndex(m => m.id === movie.id);
  let updated;
  let added = false;

  if (index >= 0) {
    updated = list.filter(m => m.id !== movie.id);
    added = false;
  } else {
    // Save only essential fields to keep storage lean
    const item = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []),
      overview: movie.overview
    };
    updated = [item, ...list];
    added = true;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("favorites_changed"));
  } catch (e) {
    console.error("Failed to save favorites", e);
  }

  return { added, count: updated.length };
}
