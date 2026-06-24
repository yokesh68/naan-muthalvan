import React from 'react';

export default function DietaryFilters({ t, dietaryFilters, td, handleToggleFilter }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100 space-y-3">
      <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-wider">
        {t('dietaryPrefs')}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {Object.keys(dietaryFilters).map((filterKey) => {
          const isActive = dietaryFilters[filterKey];
          const label = td(filterKey);

          return (
            <button
              key={filterKey}
              onClick={() => handleToggleFilter(filterKey)}
              className={`py-2 px-3 text-xs font-semibold rounded-xl border transition text-left ${
                isActive
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {isActive ? '✅ ' : '⬜ '} {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
