import React, { createContext, useMemo, useState } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (user) => {
    const exists = favorites.find((u) => u?.id === user?.id);
    setFavorites(
      exists
        ? favorites?.filter((u) => u?.id !== user?.id)
        : [...favorites, user]
    );
  };

  const value = useMemo(() => ({ favorites, toggleFavorite }), [favorites]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
