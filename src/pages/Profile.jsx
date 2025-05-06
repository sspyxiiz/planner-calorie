import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  saveUserStat,
  fetchUserStats,
  fetchFavorites,
  deleteFavorite,
  fetchFavoriteCombos,
  deleteFavoriteCombo,
  supabase,
} from "../services/supabaseClient";

import Measurements from "../components/profile/Measurements";
import FavoriteCombos from "../components/profile/FavoriteCombos";
import RecipeAnalytics from "../components/profile/RecipeAnalytics";
import ProfileTabs from "../components/profile/ProfileTabs";
import MealPlanner from "../components/profile/MealPlanner";
import AnalyticsTab from "../components/profile/AnalyticsTab";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [history, setHistory] = useState([]);

  const [favorites, setFavorites] = useState([]);
  const [favoriteCombos, setFavoriteCombos] = useState([]);

  const [activeTab, setActiveTab] = useState("measurements");

  useEffect(() => {
    getCurrentUser().then(async (u) => {
      if (!u) {
        navigate("/auth");
      } else {
        console.log("👤 Користувач у профілі:", u);
        setUser(u);

        const [statsRes, favsRes, combosRes] = await Promise.all([
          fetchUserStats(u.id),
          fetchFavorites(u.id),
          fetchFavoriteCombos(u.id),
        ]);

        console.log("📊 Комбінації з бази:", combosRes.data);

        setHistory(statsRes.data || []);
        setFavorites(favsRes.data || []);
        setFavoriteCombos(combosRes.data || []);
      }
    });
  }, [navigate]);

  const handleSave = async () => {
    if (weight && height && user) {
      await saveUserStat(user.id, parseFloat(weight), parseFloat(height));
      const { data } = await fetchUserStats(user.id);
      setHistory(data || []);
      setWeight("");
      setHeight("");
    }
  };

  const handleDeleteFavorite = async (id) => {
    await deleteFavorite(id);
    const { data } = await fetchFavorites(user.id);
    setFavorites(data || []);
  };

  const handleAddCombo = async (combination) => {
    if (!user) return;

    try {
      console.log("📦 Спроба збереження комбінації:", combination);
      await supabase.from("favorite_combinations").insert([
        {
          user_id: user.id,
          combination,
        },
      ]);

      const { data } = await fetchFavoriteCombos(user.id);
      console.log("📦 Комбінації після збереження:", data);

      const parsed = data.map((combo) => ({
        ...combo,
        combination: typeof combo.combination === "string"
          ? JSON.parse(combo.combination)
          : combo.combination,
      }));

      setFavoriteCombos(parsed);
    } catch (error) {
      console.error("❌ Помилка при збереженні комбінації:", error);
    }
  };

  const handleDeleteCombo = async (id) => {
    await deleteFavoriteCombo(id);
    const { data } = await fetchFavoriteCombos(user.id);
    setFavoriteCombos(data || []);
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Особистий кабінет</h1>

      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "measurements" && (
        <>
          <Measurements
            weight={weight}
            setWeight={setWeight}
            height={height}
            setHeight={setHeight}
            history={history}
            onSave={handleSave}
          />
        </>
      )}

{activeTab === "combinations" && (
  <FavoriteCombos
    combos={favoriteCombos}
    onAdd={handleAddCombo}
    onDelete={handleDeleteCombo}
    onRefresh={async () => {
      const { data } = await fetchFavoriteCombos(user.id);
      console.log("🔄 Оновлення вручну:", data);
      setFavoriteCombos(data || []);
    }}
  />
)}

{activeTab === "analytics" && (
  <AnalyticsTab />
)}

      {activeTab === "mealplanner" && (
        <MealPlanner user={user} />
      )}
    </div>
  );
};

export default Profile;
