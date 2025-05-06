import React, { useState } from "react";
import { supabase } from "../../services/supabaseClient";

const SaveCombinationButton = ({ user, inputValue, onClear, refreshCombos }) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const calculateTotals = (products) => {
    return products.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.calories * item.weight) / 100,
        protein: acc.protein + (item.protein * item.weight) / 100,
        fat: acc.fat + (item.fat * item.weight) / 100,
        carbs: acc.carbs + (item.carbs * item.weight) / 100,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
  };

  const handleSave = async () => {
    if (!user || !inputValue || inputValue.length === 0) return;

    setSaving(true);
    setSaved(false);

    try {
      const enriched = inputValue.map((item) => ({
        name: item.name,
        calories: (item.calories * item.weight) / 100,
        protein: (item.protein * item.weight) / 100,
        fat: (item.fat * item.weight) / 100,
        carbs: (item.carbs * item.weight) / 100,
        weight: item.weight,
      }));

      const totals = calculateTotals(inputValue);

      console.log("➡️ Дані для збереження:", enriched);

      const { error } = await supabase.from("favorite_combinations").insert([
        {
          user_id: user.id,
          combination: enriched,
          total_calories: totals.calories,
          total_protein: totals.protein,
          total_fat: totals.fat,
          total_carbs: totals.carbs,
        },
      ]);

      if (error) {
        console.error("❌ Помилка вставки:", error);
      } else {
        console.log("✅ Комбінація успішно збережена");
      }

      setSaved(true);
      onClear?.();
      refreshCombos?.();
    } catch (error) {
      console.error("❌ Помилка при збереженні:", error);
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="mt-4 text-center">
      <button
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
        disabled={saving}
      >
        {saving ? "Збереження..." : "❤️ Зберегти комбінацію"}
      </button>
      {saved && <p className="text-green-600 mt-2">Комбінацію збережено ✅</p>}
    </div>
  );
};

export default SaveCombinationButton;
