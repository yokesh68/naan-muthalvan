import { DEMO_RECIPES } from '../constants/translations';

// In-browser recipe search and ingredient-matching matching engine (fallback)
const matchRecipesLocally = (searchQuery, pantryIngredients, dietaryFilters, lang) => {
  const selectedLang = lang === 'ta' ? 'ta' : 'en';
  const dbList = DEMO_RECIPES[selectedLang] || [];

  const searchLower = searchQuery ? searchQuery.toLowerCase() : '';
  const pantryLower = (pantryIngredients || []).map(ing => ing.toLowerCase());

  let filtered = dbList.filter(recipe => {
    // 1. Search query match
    if (searchLower) {
      const matchTitle = recipe.title.toLowerCase().includes(searchLower);
      const matchDesc = recipe.description.toLowerCase().includes(searchLower);
      const matchIngs = recipe.ingredients.some(i => i.toLowerCase().includes(searchLower));
      if (!matchTitle && !matchDesc && !matchIngs) return false;
    }

    // 2. Dietary preference match
    for (const [key, value] of Object.entries(dietaryFilters || {})) {
      if (value) {
        let labelToFind = "";
        if (key === 'vegan') labelToFind = selectedLang === 'ta' ? 'சைவம் (Vegan)' : 'Vegan';
        if (key === 'glutenFree') labelToFind = selectedLang === 'ta' ? 'குளுட்டன் இல்லாதது' : 'Gluten-Free';
        if (key === 'keto') labelToFind = selectedLang === 'ta' ? 'கீட்டோ (Keto)' : 'Keto';
        if (key === 'dairyFree') labelToFind = selectedLang === 'ta' ? 'பால் பொருட்கள் இல்லாதது' : 'Dairy-Free';
        if (key === 'lowCarb') labelToFind = selectedLang === 'ta' ? 'குறைந்த கார்போஹைட்ரேட்' : 'Low-Carb';

        if (labelToFind && !recipe.dietaryLabels.includes(labelToFind)) {
          return false;
        }
      }
    }
    return true;
  });

  // Calculate scores and missing ingredients
  return filtered.map(recipe => {
    let matchedCount = 0;
    const missing = [];

    recipe.ingredients.forEach(reqIng => {
      const reqLower = reqIng.toLowerCase();
      const isAvailable = pantryLower.some(pIng => reqLower.includes(pIng) || pIng.includes(reqLower));
      if (isAvailable) {
        matchedCount++;
      } else {
        const cleanName = reqIng.split(',')[0].replace(/^\d+\s*(g|tbsp|tsp|cup|cloves|can|can of)?\s*/i, '').trim();
        missing.push(cleanName);
      }
    });

    const scorePct = recipe.ingredients.length > 0 
      ? Math.round((matchedCount / recipe.ingredients.length) * 100) 
      : 100;

    const matchText = selectedLang === 'ta'
      ? `${scorePct}% பொருத்தம்`
      : `${scorePct}% Match`;

    return {
      ...recipe,
      matchScore: matchText,
      missingIngredients: missing
    };
  });
};

export const fetchRecipesFromGemini = async (searchQuery, pantryIngredients, dietaryFilters, lang) => {
  try {
    const response = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchQuery,
        pantryIngredients,
        dietaryFilters,
        lang
      })
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    return {
      recipes: data.recipes || [],
      isOffline: data.isOffline || false
    };
  } catch (err) {
    console.warn("Backend recipes fetch failed, executing client-side local fallback:", err.message);
    const localMatches = matchRecipesLocally(searchQuery, pantryIngredients, dietaryFilters, lang);
    return {
      recipes: localMatches,
      isOffline: true
    };
  }
};

export const fetchRecipeImageFromImagen = async (recipe, lang) => {
  const apiKey = ""; // Relies on runtime execution environment injection

  const englishPromptHelper = lang === 'ta'
    ? `A premium, professionally shot photo of a delicious dish named "${recipe.title}". Delicious plating, gourmet look, warm lighting, appetizing food blog photography.`
    : `A premium, professionally shot culinary photo of ${recipe.title}. ${recipe.description}. Beautiful plating, warm natural overhead soft lighting, depth of field, appetizing, high-resolution food blog style.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: { prompt: englishPromptHelper },
        parameters: { sampleCount: 1 }
      })
    }
  );

  if (!response.ok) throw new Error("Image generation failed");
  const result = await response.json();
  const base64Bytes = result.predictions?.[0]?.bytesBase64Encoded;
  
  if (base64Bytes) {
    return `data:image/png;base64,${base64Bytes}`;
  }
  throw new Error("No image data returned");
};
