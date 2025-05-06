// src/components/profile/AnalyticsTab.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import RecipeAnalytics from "./RecipeAnalytics";

const AnalyticsTab = () => {
  const [archive, setArchive] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data, error } = await supabase
          .from("meal_plans")
          .select("*")
          .eq("user_id", user.id);

        if (!error) setArchive(data || []);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="py-4">
      {archive.length > 0 ? (
        <RecipeAnalytics archive={archive} />
      ) : (
        <p className="text-sm text-gray-500">Немає даних для аналітики.</p>
      )}
    </div>
  );
};

export default AnalyticsTab;
