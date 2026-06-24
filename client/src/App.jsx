import React, { useState, useEffect } from 'react';
import { signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

// Config & Services
import { auth, db, appId, firebaseConfig } from './config/firebase';
import { TRANSLATIONS, DEMO_RECIPES } from './constants/translations';
import { fetchRecipesFromGemini, fetchRecipeImageFromImagen } from './services/recipeApi';

// Components
import Header from './components/Header';
import MealIdea from './components/MealIdea';
import Pantry from './components/Pantry';
import DietaryFilters from './components/DietaryFilters';
import SavedBox from './components/SavedBox';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';

import './App.css';

export default function App() {
  // --- States ---
  const [lang, setLang] = useState('en'); // 'en' or 'ta'
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [pantryIngredients, setPantryIngredients] = useState([]);

  // Dynamic default ingredients tailored to language
  useEffect(() => {
    if (lang === 'ta') {
      setPantryIngredients(['கோழி இறைச்சி (Chicken)', 'பூண்டு (Garlic)', 'தக்காளி (Tomato)']);
    } else {
      setPantryIngredients(['Chicken breast', 'Garlic', 'Tomato']);
    }
  }, [lang]);

  const [dietaryFilters, setDietaryFilters] = useState({
    vegan: false,
    glutenFree: false,
    keto: false,
    dairyFree: false,
    lowCarb: false
  });
  
  const [recipes, setRecipes] = useState([]);

  // Sync initial demo recipe to language choice
  useEffect(() => {
    setRecipes(DEMO_RECIPES[lang]);
  }, [lang]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'favorites'
  const [generatingImageId, setGeneratingImageId] = useState(null);
  const [recipeImages, setRecipeImages] = useState({});
  const [cloudSyncActive, setCloudSyncActive] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Translate helper function
  const t = (key) => {
    return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || key;
  };

  // Helper for dietary label translation
  const td = (key) => {
    return TRANSLATIONS[lang].dietary[key] || TRANSLATIONS['en'].dietary[key] || key;
  };

  // --- Firebase Auth & Synced Favorites Setup ---
  useEffect(() => {
    if (!firebaseConfig) return;

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setUser(usr);
        setCloudSyncActive(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Real-time Cloud Sync for Favorites ---
  useEffect(() => {
    if (!db || !user) return;

    const favDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'favorites', 'savedRecipes');
    const unsubscribe = onSnapshot(favDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setFavorites(docSnap.data().list || []);
      }
    }, (err) => {
      console.error("Firestore sync error:", err);
    });

    return () => unsubscribe();
  }, [user]);

  // Save/Remove Favorite Helper
  const toggleFavorite = async (recipe) => {
    const isFav = favorites.some(fav => fav.id === recipe.id);
    let updatedFavorites;

    if (isFav) {
      updatedFavorites = favorites.filter(fav => fav.id !== recipe.id);
    } else {
      updatedFavorites = [...favorites, recipe];
    }

    setFavorites(updatedFavorites);

    // Persist to Cloud if available
    if (db && user) {
      try {
        const favDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'favorites', 'savedRecipes');
        await setDoc(favDocRef, { list: updatedFavorites });
      } catch (err) {
        console.error("Error saving to cloud:", err);
      }
    }
  };

  // --- Ingredient Chips Handlers ---
  const handleAddIngredient = (e) => {
    e.preventDefault();
    const clean = ingredientInput.trim();
    if (clean && !pantryIngredients.some(i => i.toLowerCase() === clean.toLowerCase())) {
      setPantryIngredients([...pantryIngredients, clean]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (indexToRemove) => {
    setPantryIngredients(pantryIngredients.filter((_, idx) => idx !== indexToRemove));
  };

  const handleToggleFilter = (key) => {
    setDietaryFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- Gemini API Call Wrapper ---
  const handleRecipeSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const { recipes, isOffline } = await fetchRecipesFromGemini(searchQuery, pantryIngredients, dietaryFilters, lang);
      setRecipes(recipes);
      setIsOffline(isOffline);
    } catch (err) {
      setError(lang === 'ta' 
        ? "விருப்பமான சமையல் குறிப்புகளைப் பெறுவதில் தோல்வி ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்."
        : "Failed to fetch tailored recipes. Please check your network or try again."
      );
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  // --- Imagen 4 API Call Wrapper ---
  const generateRecipeImage = async (recipe) => {
    setGeneratingImageId(recipe.id);
    try {
      const imageUrl = await fetchRecipeImageFromImagen(recipe, lang);
      setRecipeImages(prev => ({ ...prev, [recipe.id]: imageUrl }));
    } catch (err) {
      console.error("Error generating recipe image:", err);
    } finally {
      setGeneratingImageId(null);
    }
  };

  const getShowingCountText = () => {
    const count = activeTab === 'search' ? recipes.length : favorites.length;
    let text = t('showingRecipes').replace('{count}', count);
    if (lang === 'ta') {
      text = text.replace('{s}', ''); // No plural suffix needed in Tamil
    } else {
      text = text.replace('{s}', count === 1 ? '' : 's');
    }
    return text;
  };

  return (
    <div className="min-h-screen bg-amber-50 text-neutral-800 font-sans flex flex-col antialiased">
      {/* Header Banner Component */}
      <Header t={t} lang={lang} setLang={setLang} cloudSyncActive={cloudSyncActive} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Search, Pantry & Filters (Span 4) */}
        <section className="lg:col-span-4 space-y-6">
          
          {/* Tabs: Search vs Saved */}
          <div className="bg-white rounded-2xl p-1 shadow-sm border border-amber-100 flex gap-1">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-2.5 text-center font-semibold text-sm rounded-xl transition cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-amber-100 text-amber-900 shadow-sm'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              {t('findRecipes')}
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-2.5 text-center font-semibold text-sm rounded-xl transition flex justify-center items-center gap-2 cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-amber-100 text-amber-900 shadow-sm'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              {t('recipeBox')}
              <span className="bg-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                {favorites.length}
              </span>
            </button>
          </div>

          {activeTab === 'search' && (
            <>
              {/* Recipe Query Search Input */}
              <MealIdea t={t} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

              {/* Pantry Ingredient Manager */}
              <Pantry 
                t={t} 
                pantryIngredients={pantryIngredients} 
                ingredientInput={ingredientInput}
                setIngredientInput={setIngredientInput} 
                handleAddIngredient={handleAddIngredient}
                handleRemoveIngredient={handleRemoveIngredient} 
              />

              {/* Dietary Toggle Filters */}
              <DietaryFilters 
                t={t} 
                dietaryFilters={dietaryFilters} 
                td={td} 
                handleToggleFilter={handleToggleFilter} 
              />

              {/* Submit / Generate Recipe Button */}
              <button
                onClick={handleRecipeSearch}
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-orange-50 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 text-white font-extrabold text-base rounded-2xl shadow-md transform hover:-translate-y-0.5 transition duration-150 flex justify-center items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('generatingButton')}
                  </>
                ) : (
                  <>
                    <span>🍳</span> {t('generateButton')}
                  </>
                )}
              </button>
            </>
          )}

          {activeTab === 'favorites' && (
            <SavedBox 
              t={t} 
              favorites={favorites} 
              setSelectedRecipe={setSelectedRecipe} 
              toggleFavorite={toggleFavorite} 
            />
          )}
        </section>

        {/* Right Side: Recipe Grid/Details (Span 8) */}
        <section className="lg:col-span-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 text-sm font-medium flex gap-3 items-center">
              <span className="text-lg">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* Results Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-neutral-900">
              {activeTab === 'search' ? t('recommendedTitle') : t('mySavedBoxTitle')}
            </h2>
            <span className="text-sm text-neutral-500">
              {getShowingCountText()}
            </span>
          </div>

          {isOffline && activeTab === 'search' && (
            lang === 'ta' ? (
              <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-900 p-4 rounded-xl text-xs space-y-2 shadow-sm text-left">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span>⚠️</span>
                  <span>ஆஃப்லைன் பயன்முறை (Offline Mode)</span>
                </div>
                <p>
                  <code>server/.env</code> கோப்பில் <strong>GEMINI_API_KEY</strong> இல்லை. எனவே புதிய உணவுகளைத் தேட முடியாது.
                </p>
                <p>
                  <strong>ஆஃப்லைன் சொற்கள்:</strong> நீங்கள் பின்வரும் சொற்களைத் தேடலாம்: <span className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">chicken</span> (சிக்கன்), <span className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">tomato</span> (தக்காளி), அல்லது <span className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">pasta</span> (பாஸ்தா).
                </p>
                <p className="text-[11px] text-amber-700 italic">
                  அனைத்து உணவுகளையும் தேட, <a href="https://aistudio.google.com/" target="_blank" className="underline font-bold hover:text-amber-950">Google AI Studio</a>-லிருந்து இலவச கீ (key) பெற்று <code>GEMINI_API_KEY=your_key</code> என <code>server/.env</code> கோப்பில் சேர்க்கவும்.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-900 p-4 rounded-xl text-xs space-y-2 shadow-sm text-left">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span>⚠️</span>
                  <span>Local Offline Mode Active</span>
                </div>
                <p>
                  Dynamic AI recipe generation for searched items is disabled because <strong>GEMINI_API_KEY</strong> is missing from <code>server/.env</code>.
                </p>
                <p>
                  <strong>Supported Offline Terms:</strong> You can search for local demo items: <span className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">chicken</span>, <span className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">tomato</span>, <span className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">pasta</span>, or <span className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">soup</span>.
                </p>
                <p className="text-[11px] text-amber-700 italic">
                  To search any food, get a free key from <a href="https://aistudio.google.com/" target="_blank" className="underline font-bold hover:text-amber-950">Google AI Studio</a> and add it as <code>GEMINI_API_KEY=your_key</code> in <code>server/.env</code>.
                </p>
              </div>
            )
          )}

          {/* Conditional Rendering for empty search state */}
          {activeTab === 'search' && recipes.length === 0 && !loading && (
            <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 shadow-sm space-y-4">
              <span className="text-5xl">🥣</span>
              <h3 className="text-lg font-bold text-neutral-900">{t('noRecipesFound')}</h3>
              <p className="text-neutral-500 text-sm max-w-md mx-auto">
                {t('noRecipesSub')}
              </p>
              <button
                onClick={() => {
                  if (lang === 'ta') {
                    setPantryIngredients(['கோழி இறைச்சி (Chicken)', 'பூண்டு (Garlic)', 'தக்காளி (Tomato)']);
                  } else {
                    setPantryIngredients(['Chicken breast', 'Garlic', 'Tomato']);
                  }
                  setSearchQuery('');
                  setDietaryFilters({ vegan: false, glutenFree: false, keto: false, dairyFree: false, lowCarb: false });
                }}
                className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 hover:bg-amber-200 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                {t('resetDemo')}
              </button>
            </div>
          )}

          {/* Recipe Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(activeTab === 'search' ? recipes : favorites).map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                customImg={recipeImages[recipe.id]}
                isGeneratingImg={generatingImageId === recipe.id}
                generateRecipeImage={generateRecipeImage}
                setSelectedRecipe={setSelectedRecipe}
                t={t}
                lang={lang}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Full Recipe Detail Modal Component */}
      <RecipeModal
        selectedRecipe={selectedRecipe}
        setSelectedRecipe={setSelectedRecipe}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        customImg={selectedRecipe ? recipeImages[selectedRecipe.id] : null}
        t={t}
      />

      {/* Subtle Footer */}
      <footer className="bg-amber-100/50 border-t border-amber-200/50 py-6 mt-12 text-center text-xs text-neutral-500">
        <p>{t('footerText')}</p>
      </footer>
    </div>
  );
}