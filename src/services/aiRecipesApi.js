// src/services/aiRecipesApi.js
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export const generateRecipe = async (ingredients, cuisine) => {
  const prompt = `
Склади повноцінний і граматично правильний рецепт у стилі "${cuisine}".
Використай інгредієнти: ${Array.isArray(ingredients) ? ingredients.join(", ") : ingredients}.
Результат має містити:
- Назву
- Інгредієнти (з одиницями: г, мл, дрібка тощо)
- Інструкцію
- КБЖУ (калорії, білки, жири, вуглеводи)
- без примітки, та без пояснення що КБЖУ є орієнтовним
- без таких знаків: "*, ##, **"

Текст українською мовою.
`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await response.json();

    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (content) return content.trim();

    throw new Error(data.error?.message || "Помилка генерації");
  } catch (error) {
    console.error("Gemini API error:", error);
    return `Помилка: ${error.message}`;
  }
};
