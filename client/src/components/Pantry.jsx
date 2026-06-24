import React from 'react';

export default function Pantry({ 
  t, 
  pantryIngredients, 
  ingredientInput, 
  setIngredientInput, 
  handleAddIngredient, 
  handleRemoveIngredient 
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
          <span>🍅</span> {t('myPantry')}
        </h2>
        <span className="text-xs text-neutral-400 font-medium">{t('pantrySub')}</span>
      </div>

      <form onSubmit={handleAddIngredient} className="flex gap-2">
        <input
          type="text"
          placeholder={t('addIngredientPlaceholder')}
          value={ingredientInput}
          onChange={(e) => setIngredientInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-neutral-50"
        />
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 rounded-xl transition duration-150 shadow-sm"
        >
          +
        </button>
      </form>

      <div className="flex flex-wrap gap-1.5 pt-2">
        {pantryIngredients.length === 0 ? (
          <p className="text-sm text-neutral-400 italic">{t('emptyPantry')}</p>
        ) : (
          pantryIngredients.map((ing, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm hover:bg-amber-100 transition"
            >
              {ing}
              <button
                type="button"
                onClick={() => handleRemoveIngredient(idx)}
                className="text-amber-500 hover:text-amber-800 font-extrabold focus:outline-none"
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
