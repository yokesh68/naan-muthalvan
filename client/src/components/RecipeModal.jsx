import React from 'react';

export default function RecipeModal({
  selectedRecipe,
  setSelectedRecipe,
  favorites,
  toggleFavorite,
  customImg,
  t
}) {
  if (!selectedRecipe) return null;
  const isFav = favorites.some(fav => fav.id === selectedRecipe.id);

  return (
    <div className="fixed inset-0 bg-neutral-950/60 flex justify-center items-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-100">
        {/* Header image in modal */}
        <div className="h-56 bg-gradient-to-r from-amber-600 to-orange-500 relative flex items-center justify-center">
          {customImg ? (
            <img
              src={customImg}
              alt={selectedRecipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-white text-center p-6">
              <span className="text-6xl block">🥘</span>
            </div>
          )}
          {/* Close Button */}
          <button
            onClick={() => setSelectedRecipe(null)}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold transition cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Title & Metadata */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {selectedRecipe.dietaryLabels?.map((label, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full"
                >
                  {label}
                </span>
              ))}
              <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                🎯 {t('matchScore')}: {selectedRecipe.matchScore || "Custom"}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 leading-tight">
              {selectedRecipe.title}
            </h2>
            <p className="text-sm text-neutral-500 italic leading-relaxed">
              {selectedRecipe.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 bg-neutral-50 p-4 rounded-2xl text-center border border-neutral-100">
            <div>
              <span className="block text-[10px] font-semibold text-neutral-400 uppercase">{t('prep')}</span>
              <span className="text-sm font-extrabold text-neutral-800">{selectedRecipe.prepTime}</span>
            </div>
            <div>
              <span className="block text-[10px] font-semibold text-neutral-400 uppercase">{t('cook')}</span>
              <span className="text-sm font-extrabold text-neutral-800">{selectedRecipe.cookTime}</span>
            </div>
            <div>
              <span className="block text-[10px] font-semibold text-neutral-400 uppercase">{t('difficulty')}</span>
              <span className="text-sm font-extrabold text-neutral-800">{selectedRecipe.difficulty}</span>
            </div>
            <div>
              <span className="block text-[10px] font-semibold text-neutral-400 uppercase">{t('servings')}</span>
              <span className="text-sm font-extrabold text-neutral-800">{selectedRecipe.servings || 4}</span>
            </div>
          </div>

          {/* Ingredients Checklist */}
          <div className="space-y-3">
            <h3 className="text-lg font-extrabold text-neutral-900 flex items-center gap-2">
              <span>🛒</span> {t('ingredientsTitle')}
            </h3>
            <p className="text-xs text-neutral-500">{t('checklistInstructions')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {selectedRecipe.ingredients?.map((ingredient, idx) => (
                <label
                  key={idx}
                  className="flex items-start gap-2.5 p-2 bg-neutral-50 hover:bg-amber-50/40 rounded-xl border border-neutral-100/80 cursor-pointer select-none text-sm transition"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4.5 w-4.5 rounded text-amber-600 focus:ring-amber-500 border-neutral-300"
                  />
                  <span className="text-neutral-700">{ingredient}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-extrabold text-neutral-900 flex items-center gap-2">
              <span>📝</span> {t('stepsTitle')}
            </h3>
            <ol className="space-y-4">
              {selectedRecipe.instructions?.map((step, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-extrabold text-sm flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-neutral-700 leading-relaxed pt-0.5">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Bottom Actions inside Modal */}
          <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => toggleFavorite(selectedRecipe)}
              className="flex-1 py-3 px-4 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold rounded-2xl text-sm transition flex justify-center items-center gap-2 cursor-pointer"
            >
              {isFav ? (
                <>{t('savedToBox')}</>
              ) : (
                <>{t('saveToBox')}</>
              )}
            </button>
            <button
              onClick={() => setSelectedRecipe(null)}
              className="flex-1 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-2xl text-sm transition cursor-pointer"
            >
              {t('closeRecipe')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
