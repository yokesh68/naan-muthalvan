import React from 'react';

export default function RecipeCard({
  recipe,
  favorites,
  toggleFavorite,
  customImg,
  isGeneratingImg,
  generateRecipeImage,
  setSelectedRecipe,
  t,
  lang
}) {
  const isFav = favorites.some(fav => fav.id === recipe.id);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-amber-100 hover:border-amber-200 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
      {/* Recipe Image Header */}
      <div className="relative h-48 bg-amber-100/50 flex items-center justify-center overflow-hidden">
        {customImg ? (
          <img
            src={customImg}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <span className="text-4xl">🍽️</span>
            <button
              onClick={() => generateRecipeImage(recipe)}
              disabled={isGeneratingImg}
              className="text-xs bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              {isGeneratingImg ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('generatingPhoto')}
                </>
              ) : (
                <>
                  {t('generatePhoto')}
                </>
              )}
            </button>
          </div>
        )}

        {/* Score Tag */}
        <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
          🎯 {t('matchScore')}: {recipe.matchScore || "AI Generated"}
        </div>

        {/* Quick Favorite Star Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 hover:bg-white shadow flex items-center justify-center text-sm transition cursor-pointer"
        >
          {isFav ? '⭐' : '☆'}
        </button>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-extrabold text-lg text-neutral-900 leading-tight">
              {recipe.title}
            </h3>
          </div>
          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
            {recipe.description}
          </p>

          {/* Info Pills */}
          <div className="flex flex-wrap gap-2 mt-3.5">
            <span className="text-[11px] font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md">
              ⏱️ {recipe.prepTime} {lang === 'en' ? t('prep') : ''}
            </span>
            <span className="text-[11px] font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md">
              🍳 {recipe.cookTime} {lang === 'en' ? t('cook') : ''}
            </span>
            <span className="text-[11px] font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md">
              📊 {recipe.difficulty}
            </span>
          </div>

          {/* Missing Ingredients warning */}
          {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
            <div className="mt-4 bg-orange-50/55 border border-orange-100 rounded-xl p-2.5">
              <span className="text-[11px] font-bold text-orange-800 block mb-1">
                ⚠️ {t('missingIngredientsLabel')} ({recipe.missingIngredients.length}):
              </span>
              <span className="text-[11px] text-neutral-600 italic">
                {recipe.missingIngredients.join(', ')}
              </span>
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-neutral-100 flex gap-2">
          <button
            onClick={() => setSelectedRecipe(recipe)}
            className="flex-1 py-2 text-center text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm transition cursor-pointer"
          >
            {t('viewFullRecipe')}
          </button>
        </div>
      </div>
    </div>
  );
}
