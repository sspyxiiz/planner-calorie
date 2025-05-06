import React, { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Button } from "@/components/ui/button";

const SaveCombinationButton = ({ user, inputValue = [], onClear, refreshCombos }) => {
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
    if (!user || !Array.isArray(inputValue) || inputValue.length === 0) return;

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
        setSaved(true);
        onClear?.();
        refreshCombos?.();
      }
    } catch (error) {
      console.error("❌ Помилка при збереженні:", error);
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center space-y-2">
      <Button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2"
      >
        {saving ? "Збереження..." : "❤️ Зберегти комбінацію"}
      </Button>
      {saved && (
        <p className="text-green-600 text-sm">Комбінацію збережено ✅</p>
      )}
    </div>
  );
};

export default SaveCombinationButton;
