import React, { useEffect, useState } from "react";
import { supabase, getCurrentUser } from "../../services/supabaseClient";
import { marked } from "marked";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const MealPlanner = () => {
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);

  const [sliderRef] = useKeenSlider({
    mode: "free-snap",
    slides: {
      perView: 1,
      spacing: 16,
    },
  });

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("ai_recipe_plan");
    if (stored && user) {
      try {
        const parsed = JSON.parse(stored);
        supabase
          .from("meal_plans")
          .insert([{ user_id: user.id, ...parsed }])
          .then(({ error }) => {
            if (error) {
              console.error("❌ Помилка при збереженні рецепта:", error);
            } else {
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
      setPlans((prev) => prev.filter((plan) => plan.id !== id));
    }
  };

  const exportToTxt = (plan) => {
    const lines = [
      `План харчування на ${plan.date} (${plan.meal_type})`,
      plan.title,
      plan.notes,
      `КБЖУ (на 100 г): Калорії: ${plan.total_calories.toFixed(1)}, Білки: ${plan.total_protein.toFixed(1)}г, Жири: ${plan.total_fat.toFixed(1)}г, Вуглеводи: ${plan.total_carbs.toFixed(1)}г`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `meal-plan-${plan.date}-${plan.meal_type}.txt`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Список рецептів</h2>

      {plans.length === 0 ? (
        <p className="text-gray-500 text-center">Немає збережених рецептів.</p>
      ) : (
        <div ref={sliderRef} className="keen-slider">
          {plans.map((plan, index) => (
            <div className="keen-slider__slide px-2" key={plan.id}>
              <Card className="bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-blue-800 text-xl">
                    Рецепт №{index + 1}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {plan.date} — {plan.meal_type}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4 text-sm leading-relaxed">
                  <h3 className="font-semibold text-gray-900">{plan.title}</h3>

                  <div
                    className="prose prose-sm max-w-none text-gray-800"
                    dangerouslySetInnerHTML={{ __html: marked.parse(plan.notes || "") }}
                  ></div>

                  <div className="text-gray-800">
                    <strong>КБЖУ (на 100 г):</strong> Калорії: {plan.total_calories.toFixed(1)},
                    Білки: {plan.total_protein.toFixed(1)}г, Жири: {plan.total_fat.toFixed(1)}г,
                    Вуглеводи: {plan.total_carbs.toFixed(1)}г
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => exportToTxt(plan)}>
                    📄 Експортувати в .txt
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(plan.id)}>
                    🗑️ Видалити
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
