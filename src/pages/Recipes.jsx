// src/pages/Recipes.jsx
import React, { useState } from "react";
import { generateRecipe } from "../services/aiRecipesApi";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, supabase } from "../services/supabaseClient";

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

  const handleAddToMealPlanner = async () => {
    if (!generatedText) return;

    const user = await getCurrentUser();
    if (!user) {
      alert("Не вдалося визначити користувача");
      return;
    }

    const date = new Date().toISOString().slice(0, 10);
    const meal_type = "сніданок";

    const parsedItems = [];
    if (ingredients.toLowerCase().includes("курка")) {
      parsedItems.push({
        name: "Курка",
        weight: 300,
        calories: 239,
        protein: 27,
        fat: 14,
        carbs: 0,
      });
    }

    const plan = {
      user_id: user.id,
      date,
      meal_type,
      title: `AI-рецепт (${ingredients})`,
      notes: generatedText,
      total_calories: parsedItems.reduce((sum, i) => sum + i.calories, 0),
      total_protein: parsedItems.reduce((sum, i) => sum + i.protein, 0),
      total_fat: parsedItems.reduce((sum, i) => sum + i.fat, 0),
      total_carbs: parsedItems.reduce((sum, i) => sum + i.carbs, 0),
      items: parsedItems,
      kitchen: cuisine, // 🆕 тип кухні
    };

    console.log("🟡 План для вставки в Supabase:", plan);

    const { error } = await supabase.from("meal_plans").insert([plan]);

    if (error) {
      console.error("❌ Supabase помилка:", error);
      alert("Не вдалося зберегти рецепт ❌");
    } else {
      alert("✅ Рецепт збережено в MealPlanner!");
      navigate("/profile");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-center">Генерація рецептів</h1>

      <label className="block mb-2 font-medium">Інгредієнти (через кому):</label>
      <input
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="наприклад: курка, рис, морква"
        className="border p-2 rounded w-full mb-4"
      />

      <label className="block mb-2 font-medium">Оберіть кухню:</label>
      <select
        value={cuisine}
        onChange={(e) => setCuisine(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      >
        <option>Українська</option>
        <option>Італійська</option>
        <option>Азійська</option>
      </select>

      <button
        onClick={handleGenerate}
        className="bg-green-600 text-white px-4 py-2 rounded shadow mb-4"
        disabled={loading}
      >
        {loading ? "Генерація..." : "Згенерувати рецепт"}
      </button>

      {generatedText && (
        <div className="bg-gray-100 p-4 rounded mt-4 whitespace-pre-wrap">
          <h3 className="font-semibold mb-2">Результат:</h3>
          <p>{generatedText}</p>
          <button
            onClick={handleAddToMealPlanner}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            ➕ Додати рецепт у MealPlanner
          </button>
        </div>
      )}
    </div>
  );
};

export default Recipes;
