// --- Local Recipe Mock Database for Fallback and Fast Matching ---

const MOCK_RECIPES = {
  en: [
    {
      id: "local-1",
      title: "Garlic Butter Tomato Chicken",
      description: "A quick and aromatic chicken dish featuring pan-seared chicken breast, rich garlic butter, and bursting cherry tomatoes.",
      prepTime: "10 mins",
      cookTime: "15 mins",
      difficulty: "Easy",
      servings: 2,
      ingredients: ["2 Chicken breasts", "4 cloves Garlic, minced", "1 cup Cherry tomatoes", "2 tbsp Butter", "1 tbsp Olive oil", "Salt and pepper to taste", "Fresh basil (optional)"],
      instructions: [
        "Season chicken breasts generously with salt and pepper.",
        "Heat olive oil in a pan over medium-high heat and sear chicken for 6-7 minutes on each side until golden and cooked through. Remove and set aside.",
        "In the same pan, lower heat to medium, add butter and minced garlic. Sauté for 1 minute until fragrant.",
        "Add cherry tomatoes and cook until they begin to burst and release their juices (about 3-4 minutes).",
        "Return chicken to the pan, spooning the garlic butter tomato sauce over it. Simmer for 2 minutes.",
        "Garnish with fresh basil and serve hot!"
      ],
      dietaryLabels: ["Gluten-Free", "Keto", "Low-Carb"],
      missingIngredients: []
    },
    {
      id: "local-2",
      title: "Quick Tomato Pasta",
      description: "Classic Italian style pasta tossed in a simple home-cooked sweet garlic tomato basil sauce.",
      prepTime: "10 mins",
      cookTime: "12 mins",
      difficulty: "Easy",
      servings: 3,
      ingredients: ["200g Pasta", "4 cloves Garlic, sliced", "1 can Crushed tomatoes", "2 tbsp Olive oil", "Salt and red pepper flakes to taste", "Fresh basil leaves"],
      instructions: [
        "Boil pasta in salted water according to package instructions until al dente.",
        "Meanwhile, heat olive oil in a pan, add garlic and red pepper flakes. Sauté for 1 minute.",
        "Add crushed tomatoes and salt. Simmer gently for 8-10 minutes.",
        "Drain pasta and toss it directly into the tomato sauce.",
        "Serve hot garnished with fresh basil leaves."
      ],
      dietaryLabels: ["Vegan", "Dairy-Free"],
      missingIngredients: []
    },
    {
      id: "local-3",
      title: "Garlic Roasted Tomatoes",
      description: "Slow roasted seasoned cherry tomatoes with garlic slices and olive oil, perfect as a snack or toast topper.",
      prepTime: "5 mins",
      cookTime: "20 mins",
      difficulty: "Easy",
      servings: 2,
      ingredients: ["2 cups Cherry tomatoes", "6 cloves Garlic, peeled and halved", "3 tbsp Olive oil", "Salt, pepper, and dried oregano to taste"],
      instructions: [
        "Preheat oven to 400°F (200°C) or prepare a pan over low-medium heat.",
        "Toss cherry tomatoes, garlic halves, olive oil, salt, pepper, and oregano together.",
        "Spread in a single layer and roast for 20 minutes (or pan-cook covered for 12 minutes) until tomatoes soft and blistered.",
        "Enjoy warm on crusty bread or over rice."
      ],
      dietaryLabels: ["Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Low-Carb"],
      missingIngredients: []
    },
    {
      id: "local-4",
      title: "Simple Chicken Soup",
      description: "A comforting bowl of chicken soup loaded with tender chicken bits, garlic flavor, and simmered tomatoes.",
      prepTime: "10 mins",
      cookTime: "25 mins",
      difficulty: "Medium",
      servings: 4,
      ingredients: ["300g Chicken breast, cubed", "1 cup Tomato, chopped", "4 cloves Garlic, minced", "1 Onion, diced", "4 cups Chicken broth", "1 tbsp Olive oil", "Salt and pepper"],
      instructions: [
        "Heat olive oil in a large pot. Sauté garlic, onion, and chicken cubes until chicken is no longer pink.",
        "Add chopped tomatoes and cook for 3 minutes until soft.",
        "Pour in chicken broth and bring to a boil.",
        "Reduce heat, cover, and simmer for 15-20 minutes. Season with salt and pepper.",
        "Serve warm."
      ],
      dietaryLabels: ["Gluten-Free", "Dairy-Free", "Low-Carb"],
      missingIngredients: []
    }
  ],
  ta: [
    {
      id: "local-1",
      title: "பூண்டு வெண்ணெய் தக்காளி சிக்கன்",
      description: "வறுத்த சிக்கன் மார்பக துண்டுகள், நறுமணமுள்ள பூண்டு வெண்ணெய் மற்றும் வதக்கிய தக்காளி சேர்த்து செய்யப்படும் விரைவான மற்றும் சுவையான உணவு.",
      prepTime: "10 நிமிடங்கள்",
      cookTime: "15 நிமிடங்கள்",
      difficulty: "எளிது",
      servings: 2,
      ingredients: ["2 சிக்கன் மார்பக துண்டுகள்", "4 பல் பூண்டு (நறுக்கியது)", "1 கப் செர்ரி தக்காளி", "2 தேக்கரண்டி வெண்ணெய்", "1 தேக்கரண்டி ஆலிவ் எண்ணெய்", "தேவையான அளவு உப்பு மற்றும் மிளகுத்தூள்", "புதினா அல்லது துளசி இலைகள் (விரும்பினால்)"],
      instructions: [
        "சிக்கன் துண்டுகளின் மீது உப்பு மற்றும் மிளகுத்தூளை நன்றாகத் தூவி தடவவும்.",
        "ஒரு கடாயில் ஆலிவ் எண்ணெயைச் சூடாக்கி, சிக்கனை இருபுறமும் தலா 6-7 நிமிடங்கள் பொன்னிறமாகும் வரை வதக்கி தனியாக வைக்கவும்.",
        "அதே கடாயில் தீயைக் குறைத்து, வெண்ணெய் மற்றும் நறுக்கிய பூண்டு சேர்த்து நறுமணம் வரும் வரை 1 நிமிடம் வதக்கவும்.",
        "செர்ரி தக்காளியைச் சேர்த்து, அவை சுருங்கி சாறு வெளிவரும் வரை (சுமார் 3-4 நிமிடங்கள்) சமைக்கவும்.",
        "வறுத்த சிக்கனை மீண்டும் கடாயில் சேர்த்து, பூண்டு வெண்ணெய் சாற்றை அதன் மேல் ஊற்றி 2 நிமிடங்கள் வேகவிடவும்.",
        "புதிய துளசி இலைகளால் அலங்கரித்து சூடாகப் பரிமாறவும்!"
      ],
      dietaryLabels: ["குளுட்டன் இல்லாதது", "கீட்டோ (Keto)", "குறைந்த கார்போஹைட்ரேட்"],
      missingIngredients: []
    },
    {
      id: "local-2",
      title: "எளிய தக்காளி பாஸ்தா",
      description: "வீட்டில் தயாரித்த பூண்டு தக்காளி மற்றும் துளசி சாஸில் கிளறப்பட்ட இத்தாலிய பாணி பாஸ்தா.",
      prepTime: "10 நிமிடங்கள்",
      cookTime: "12 நிமிடங்கள்",
      difficulty: "எளிது",
      servings: 3,
      ingredients: ["200கி பாஸ்தா", "4 பல் பூண்டு (நறுக்கியது)", "1 கப் தக்காளி விழுது", "2 தேக்கரண்டி ஆலிவ் எண்ணெய்", "தேவையான அளவு உப்பு மற்றும் மிளகாய் தூள்", "புதிய துளசி இலைகள்"],
      instructions: [
        "பாஸ்தாவை உப்பு கலந்த கொதிக்கும் நீரில் வேகவைத்து வடிகட்டவும்.",
        "கடாயில் ஆலிவ் எண்ணெயைச் சூடாக்கி, பூண்டு மற்றும் மிளகாய் தூள் சேர்த்து 1 நிமிடம் வதக்கவும்.",
        "தக்காளி விழுது மற்றும் உப்பு சேர்த்து 8-10 நிமிடங்கள் மிதமான தீயில் கொதிக்கவிடவும்.",
        "வடிகட்டிய பாஸ்தாவை தக்காளி சாஸில் சேர்த்து நன்றாகக் கிளறவும்.",
        "புதிய துளசி இலைகளால் அலங்கரித்து சூடாகப் பரிமாறவும்."
      ],
      dietaryLabels: ["சைவம் (Vegan)", "பால் பொருட்கள் இல்லாதது"],
      missingIngredients: []
    },
    {
      id: "local-3",
      title: "பூண்டு வறுத்த தக்காளி",
      description: "ஆலிவ் எண்ணெய், பூண்டு மற்றும் மசாலாப் பொருட்களுடன் வதக்கப்பட்ட சுவையான தக்காளி.",
      prepTime: "5 நிமிடங்கள்",
      cookTime: "12 நிமிடங்கள்",
      difficulty: "எளிது",
      servings: 2,
      ingredients: ["2 கப் செர்ரி தக்காளி", "6 பல் பூண்டு", "3 தேக்கரண்டி ஆலிவ் எண்ணெய்", "தேவையான அளவு உப்பு மற்றும் மசாலாத் தூள்"],
      instructions: [
        "ஒரு கடாயில் ஆலிவ் எண்ணெயைச் சூடாக்கவும்.",
        "செர்ரி தக்காளி, நறுக்கிய பூண்டு, உப்பு மற்றும் மசாலாப் பொருட்களைச் சேர்க்கவும்.",
        "கடாயை மூடி மிதமான தீயில் தக்காளி மென்மையாகும் வரை 12 நிமிடங்கள் சமைக்கவும்.",
        "சூடாக ரொட்டி அல்லது சாதத்துடன் பரிமாறவும்."
      ],
      dietaryLabels: ["சைவம் (Vegan)", "குளுட்டன் இல்லாதது", "பால் பொருட்கள் இல்லாதது", "கீட்டோ (Keto)", "குறைந்த கார்போஹைட்ரேட்"],
      missingIngredients: []
    }
  ]
};

// Simple search and ingredient matching engine
const matchRecipesLocally = (searchQuery, pantryIngredients, dietaryFilters, lang) => {
  const selectedLang = lang === 'ta' ? 'ta' : 'en';
  const dbList = MOCK_RECIPES[selectedLang];

  const searchLower = searchQuery ? searchQuery.toLowerCase() : '';
  const pantryLower = pantryIngredients.map(ing => ing.toLowerCase());

  // Filter based on search term and dietary filters
  let filtered = dbList.filter(recipe => {
    // 1. Search Query Match
    if (searchLower) {
      const matchTitle = recipe.title.toLowerCase().includes(searchLower);
      const matchDesc = recipe.description.toLowerCase().includes(searchLower);
      const matchIngs = recipe.ingredients.some(i => i.toLowerCase().includes(searchLower));
      if (!matchTitle && !matchDesc && !matchIngs) {
        return false;
      }
    }

    // 2. Dietary Filter Match
    // Note: Map English dietary keys to labels used in the DB
    // e.g. vegan -> "Vegan" / "சைவம் (Vegan)"
    // Since mock database labels are simple, we check match based on labels.
    for (const [key, value] of Object.entries(dietaryFilters)) {
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

  // Calculate Match Score and Missing Ingredients
  return filtered.map(recipe => {
    let matchedCount = 0;
    const missing = [];

    recipe.ingredients.forEach(reqIng => {
      const reqLower = reqIng.toLowerCase();
      // Check if any pantry ingredient matches the required ingredient text
      const isAvailable = pantryLower.some(pIng => reqLower.includes(pIng) || pIng.includes(reqLower));
      if (isAvailable) {
        matchedCount++;
      } else {
        // Extract basic ingredient name
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

module.exports = {
  matchRecipesLocally
};
