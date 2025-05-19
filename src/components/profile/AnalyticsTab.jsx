import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import RecipeAnalytics from "./RecipeAnalytics";

const AnalyticsTab = () => {
  const [archive, setArchive] = useState([]);
  const [user, setUser] = useState(null);
  const [averageWeight, setAverageWeight] = useState(null);
  const [weightCount, setWeightCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUser(user);

      const { data: recipes, error } = await supabase
        .from("meal_plans")
        .select("*")
        .eq("user_id", user.id);

      if (!error) setArchive(recipes || []);

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (token) {
        try {
          const res = await fetch("http://localhost:5000/api/analytics/weight-summary", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const result = await res.json();
          setAverageWeight(result.average_weight);
          setWeightCount(result.count);
        } catch (err) {
          console.error("❌ Аналітика ваги недоступна", err);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="py-4 space-y-4">
      {averageWeight !== null && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800 shadow-sm">
          📏 Середня вага за останні 30 днів: <strong>{averageWeight} кг</strong> (записів: {weightCount})
        </div>
      )}

      {archive.length > 0 ? (
        <RecipeAnalytics archive={archive} />
      ) : (
        <p className="text-sm text-gray-500">Немає даних для аналітики.</p>
      )}
    </div>
  );
};

export default AnalyticsTab;
