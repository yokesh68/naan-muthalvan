import React from 'react';

export default function SavedBox({ t, favorites, setSelectedRecipe, toggleFavorite }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100 space-y-4">
      <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
        <span>⭐</span> {t('savedRecipesTitle')}
      </h2>
      <p className="text-xs text-neutral-500">
        {t('savedRecipesSub')}
      </p>
      {favorites.length === 0 ? (
        <div className="py-8 text-center text-neutral-400 italic text-sm">
          {t('noSavedRecipes')}
        </div>
      ) : (
        <div className="divide-y divide-neutral-100 max-h-[400px] overflow-y-auto pr-2">
          {favorites.map((favRecipe) => (
            <div key={favRecipe.id} className="py-3 flex justify-between items-center gap-2">
              <button
                onClick={() => setSelectedRecipe(favRecipe)}
                className="text-sm font-bold text-neutral-800 hover:text-amber-600 transition text-left cursor-pointer"
              >
                {favRecipe.title}
              </button>
              <button
                onClick={() => toggleFavorite(favRecipe)}
                className="text-red-500 hover:text-red-700 text-xs px-2 py-1 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition cursor-pointer"
              >
                {t('remove')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
