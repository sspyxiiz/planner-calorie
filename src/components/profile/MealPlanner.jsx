// src/components/profile/MealPlanner.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { getCurrentUser } from "../../services/supabaseClient";
import { marked } from "marked";

const MealPlanner = () => {
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("ai_recipe_plan");
    if (stored && user) {
      try {
        const parsed = JSON.parse(stored);
        supabase.from("meal_plans").insert([{ user_id: user.id, ...parsed }]).then(({ error }) => {
          if (error) console.error("❌ Помилка при збереженні рецепта:", error);
          else {
            alert("✅ AI-рецепт додано до плану харчування");
            fetchPlans();
            localStorage.removeItem("ai_recipe_plan");
          }
        });
      } catch (err) {
        console.error("❌ Помилка парсингу збереженого рецепта:", err);
      }
    }
  }, [user]);

  const fetchPlans = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("meal_plans")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });
    setPlans(data || []);
  };

  useEffect(() => {
    if (user) fetchPlans();
  }, [user]);

  const handleDelete = async (id) => {
    const { error } = await supabase.from("meal_plans").delete().eq("id", id);
    if (error) {
      console.error("❌ Помилка при видаленні:", error);
    } else {
      setPlans(plans.filter((plan) => plan.id !== id));
    }
  };

  const exportToTxt = (plan) => {
    const lines = [
      `План харчування на ${plan.date} (${plan.meal_type})`,
      plan.title,
      plan.notes,
      `Ккал: ${plan.total_calories.toFixed(1)}, Б: ${plan.total_protein.toFixed(1)}г, Ж: ${plan.total_fat.toFixed(1)}г, В: ${plan.total_carbs.toFixed(1)}г`
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `meal-plan-${plan.date}-${plan.meal_type}.txt`;
    link.click();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Планування харчування</h2>

      <div>
        <h3 className="mt-6 font-semibold">Збережені плани:</h3>
        {plans.map((plan) => (
          <div key={plan.id} className="border p-4 rounded mt-4 shadow-sm bg-white">
            <div className="text-gray-600 text-sm mb-1">{plan.date} — {plan.meal_type}</div>
            <h3 className="text-lg font-bold mb-2">{plan.title}</h3>

            <div
              className="prose prose-sm max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: marked.parse(plan.notes || "") }}
            ></div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => exportToTxt(plan)}
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                ⬇️ Експортувати в .txt
              </button>
              <button
                onClick={() => handleDelete(plan.id)}
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                🗑️ Видалити
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanner;