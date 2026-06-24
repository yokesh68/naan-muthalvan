require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const mongoURI = process.env.MONGO_URI;
if (mongoURI) {
  mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
      console.error('MongoDB connection error:', err.message);
      console.log('Server will continue running without database connectivity.');
    });
} else {
  console.log('MONGO_URI not defined in environment variables. Running without MongoDB.');
}

const { matchRecipesLocally } = require('./recipesDb');

// Routes
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend connection established successfully!',
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.post('/api/recipes', async (req, res) => {
  const { searchQuery, pantryIngredients, dietaryFilters, lang } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log('GEMINI_API_KEY is not defined. Matching recipes locally...');
    const localMatches = matchRecipesLocally(searchQuery, pantryIngredients, dietaryFilters, lang);
    return res.json({ recipes: localMatches, isOffline: true });
  }

  // Build query context
  const enabledDiets = Object.entries(dietaryFilters || {})
    .filter(([_, value]) => value)
    .map(([key]) => key)
    .join(', ');

  const languageInstruction = lang === 'ta' 
    ? `CRITICAL: You must generate all text fields (title, description, prepTime, cookTime, difficulty, ingredients list, instructions list, dietaryLabels, and missingIngredients list) in standard, fluent, appetizing Tamil (தமிழ் script). Keep the JSON keys exactly in English as requested below.`
    : `Generate the recipe details entirely in English.`;

  const promptText = `
    You are an expert culinary assistant. Generate a diverse list of 3 delicious, realistic, and highly relevant recipes based on these parameters:
    - Search Term: "${searchQuery || 'any'}"
    - Available Pantry Ingredients: ${(pantryIngredients || []).join(', ') || 'none specified'}
    - Dietary Preferences / Restrictions: ${enabledDiets || 'None'}

    ${languageInstruction}

    Each recipe MUST include a calculated "matchScore" (e.g. "90% Match" or "90% பொருத்தம்") representing how well it utilizes the user's available Pantry Ingredients, along with a "missingIngredients" array listing any key ingredients in the recipe that were NOT in their pantry list.

    Provide your response in strict JSON format matching this schema:
    {
      "recipes": [
        {
          "id": "unique-id-string",
          "title": "Recipe Title",
          "description": "Short mouth-watering description",
          "prepTime": "e.g. 15 mins",
          "cookTime": "e.g. 20 mins",
          "difficulty": "Easy" | "Medium" | "Hard",
          "servings": 4,
          "ingredients": ["detailed ingredients with amounts"],
          "instructions": ["step 1", "step 2", "etc"],
          "dietaryLabels": ["e.g. Gluten-Free", "Vegan"],
          "matchScore": "90%",
          "missingIngredients": ["Ingredient A", "Ingredient B"]
        }
      ]
    }
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                recipes: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      id: { type: "STRING" },
                      title: { type: "STRING" },
                      description: { type: "STRING" },
                      prepTime: { type: "STRING" },
                      cookTime: { type: "STRING" },
                      difficulty: { type: "STRING" },
                      servings: { type: "NUMBER" },
                      ingredients: { type: "ARRAY", items: { type: "STRING" } },
                      instructions: { type: "ARRAY", items: { type: "STRING" } },
                      dietaryLabels: { type: "ARRAY", items: { type: "STRING" } },
                      matchScore: { type: "STRING" },
                      missingIngredients: { type: "ARRAY", items: { type: "STRING" } }
                    },
                    required: ["id", "title", "description", "prepTime", "cookTime", "difficulty", "servings", "ingredients", "instructions", "dietaryLabels", "matchScore", "missingIngredients"]
                  }
                }
              },
              required: ["recipes"]
            }
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      const parsed = JSON.parse(rawText);
      return res.json({ recipes: parsed.recipes || [], isOffline: false });
    } else {
      throw new Error("Empty candidate output from Gemini model");
    }
  } catch (err) {
    console.error("Gemini query error on server:", err.message);
    console.log("Falling back to local recipe matching database...");
    const localMatches = matchRecipesLocally(searchQuery, pantryIngredients, dietaryFilters, lang);
    return res.json({ recipes: localMatches, isOffline: true });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});