import React from 'react';

export default function MealIdea({ t, searchQuery, setSearchQuery }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100 space-y-4">
      <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
        <span>✨</span> {t('findMealIdea')}
      </h2>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
          {t('cravingLabel')}
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-neutral-50"
          />
        </div>
      </div>
    </div>
  );
}
