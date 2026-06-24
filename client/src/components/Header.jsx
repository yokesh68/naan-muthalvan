import React from 'react';

export default function Header({ t, lang, setLang, cloudSyncActive }) {
  return (
    <header className="bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2 tracking-tight">
            <span>🍳</span> {t('appName')} <span className="text-xs bg-amber-800 text-amber-200 px-2 py-0.5 rounded-full font-semibold uppercase">AI Powered</span>
          </h1>
          <p className="text-amber-100 text-sm mt-1">{t('appSub')}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Language Toggle Selector */}
          <div className="bg-amber-900/40 p-1 rounded-xl border border-amber-400/30 flex gap-1">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                lang === 'en' ? 'bg-white text-amber-900 shadow' : 'text-amber-100 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('ta')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                lang === 'ta' ? 'bg-white text-amber-900 shadow' : 'text-amber-100 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
          </div>

          {cloudSyncActive ? (
            <span className="flex items-center gap-1 text-xs bg-emerald-600/50 text-emerald-100 px-3 py-1.5 rounded-full border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> {t('cloudSync')}
            </span>
          ) : (
            <span className="text-xs bg-amber-700/50 text-amber-100 px-3 py-1.5 rounded-full border border-amber-500/20">
              ⚡ {t('localMode')}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
