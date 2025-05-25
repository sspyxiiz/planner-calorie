const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export const generateRecipe = async (ingredients, cuisine) => {
  const ingredientsList = Array.isArray(ingredients) ? ingredients.join(", ") : ingredients;

  // Додаткові уточнення для української кухні
  const ukrainianHint = cuisine === "Українська"
    ? " (врахуй традиційні страви — борщ, вареники, деруни, печеня, узвар, голубці)"
    : "";

  const prompt = `
Склади детальний і граматично правильний рецепт у стилі "${cuisine}"${ukrainianHint}.
Використай інгредієнти: ${ingredientsList}.

Результат має містити:
1. Назву страви (на окремому рядку).
2. Список інгредієнтів з одиницями (г, мл, шт тощо), у форматі:
Інгредієнти:
- Продукт 1 – 100 г
- Продукт 2 – 2 шт
3. Покрокову інструкцію у вигляді списку.
4. КБЖВ у форматі (на окремому рядку кожен):
КБЖВ (на 100 г):
Калорії: 350
Білки: 20
Жири: 15
Вуглеводи: 30

❗ Не додавай пояснень, прикрас, символів чи додаткових коментарів.
Увесь текст — українською мовою.
`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (content) return content.trim();
    throw new Error(data.error?.message || "Порожній результат");
  } catch (error) {
    console.error("Gemini API error:", error);
    return `Помилка генерації: ${error.message}`;
  }
};
