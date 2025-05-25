import React, { useState } from "react";
import { generateRecipe } from "../services/aiRecipesApi";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, supabase } from "../services/supabaseClient";

const parseNutritionFromText = (text) => {
  const pattern = /КБЖВ.*?Калор[іі]ї[:\-\s]*([\d,.]+).*?Білк[иі][:\-\s]*([\d,.]+).*?Жир[и][:\-\s]*([\d,.]+).*?Вуглевод[и][:\-\s]*([\d,.]+)/is;
  const match = text.match(pattern);
  if (!match) return null;
  return {
    calories: parseFloat(match[1].replace(",", ".")) || 0,
    protein: parseFloat(match[2].replace(",", ".")) || 0,
    fat: parseFloat(match[3].replace(",", ".")) || 0,
    carbs: parseFloat(match[4].replace(",", ".")) || 0,
  };
};

const Recipes = () => {
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("Українська");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    const result = await generateRecipe(ingredients.split(","), cuisine);
    setGeneratedText(result);
    setLoading(false);
  };

  const handleSave = async () => {
    const user = await getCurrentUser();
    if (!user) return alert("Не вдалося визначити користувача");

    const nutrition = parseNutritionFromText(generatedText);

    const plan = {
      user_id: user.id,
      date: new Date().toISOString().slice(0, 10),
      meal_type: "Страва",
      title: `Рецепт (${ingredients})`,
      notes: generatedText,
      kitchen: cuisine,
      total_calories: nutrition?.calories || 0,
      total_protein: nutrition?.protein || 0,
      total_fat: nutrition?.fat || 0,
      total_carbs: nutrition?.carbs || 0,
      items: [],
    };

    const { error } = await supabase.from("meal_plans").insert([plan]);
    if (error) {
      console.error("❌ Supabase помилка:", error);
      alert("Не вдалося зберегти рецепт ❌");
    } else {
      alert("✅ Рецепт збережено в MealPlanner!");
      setGeneratedText("");
      navigate("/profile");
    }
  };

  const renderRecipePreview = () => {
    const lines = generatedText.split("\n").filter(Boolean);
    const title = lines[0] || "";
    const ingredientsStart = lines.findIndex((line) => line.toLowerCase().includes("інгредієнти"));
    const instructionStart = lines.findIndex((line) => line.toLowerCase().includes("інструкц"));
    const kbjuStart = lines.findIndex((line) => line.toLowerCase().includes("кбжв"));

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-green-700">{title}</h2>

        {ingredientsStart !== -1 && instructionStart !== -1 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">🧂 Інгредієнти</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
              {lines.slice(ingredientsStart + 1, instructionStart).map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>
        )}

        {instructionStart !== -1 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">👨‍🍳 Інструкція</h3>
            <ol className="list-decimal list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
              {lines.slice(instructionStart + 1, kbjuStart !== -1 ? kbjuStart : undefined).map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ol>
          </div>
        )}

        {kbjuStart !== -1 && (
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded p-4 text-sm text-green-800 dark:text-green-200">
            <h3 className="font-semibold mb-1">КБЖВ (на 100 г):</h3>
            {lines.slice(kbjuStart + 1).map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">🍲 Генерація рецептів</h1>

      <label className="block mb-2 font-medium text-black dark:text-white">Інгредієнти (через кому):</label>
      <input
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="наприклад: курка, рис, морква"
        className="border p-2 rounded w-full mb-4
                   bg-white text-black placeholder-gray-500
                   dark:bg-zinc-800 dark:text-white dark:placeholder-gray-400"
      />

      <label className="block mb-2 font-medium text-black dark:text-white">Оберіть кухню:</label>
      <select
        value={cuisine}
        onChange={(e) => setCuisine(e.target.value)}
        className="border p-2 rounded w-full mb-6
                   bg-white text-black
                   dark:bg-zinc-800 dark:text-white"
      >
        <option>Українська</option>
        <option>Італійська</option>
        <option>Азійська</option>
        <option>Індійська</option>
      </select>

      <button
        onClick={handleGenerate}
        className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
        disabled={loading}
      >
        {loading ? "Генерація..." : "Згенерувати рецепт"}
      </button>

      {generatedText && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 max-w-2xl w-full rounded-lg p-6 shadow-lg relative overflow-y-auto max-h-[90vh] text-black dark:text-white">
            <button
              onClick={() => setGeneratedText("")}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg font-bold"
            >
              ×
            </button>

            <h3 className="font-semibold mb-4 text-xl text-center">🍽️ Згенерований рецепт</h3>
            <div className="text-sm leading-relaxed space-y-4">
              {renderRecipePreview()}
            </div>

            <button
              onClick={handleSave}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              ➕ Додати у MealPlanner
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
