import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

import Measurements from "../components/profile/Measurements";
import FavoriteCombos from "../components/profile/FavoriteCombos";
import ProfileTabs from "../components/profile/ProfileTabs";
import MealPlanner from "../components/profile/MealPlanner";
import AnalyticsTab from "../components/profile/AnalyticsTab";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [history, setHistory] = useState([]);
  const [favoriteCombos, setFavoriteCombos] = useState([]);
  const [activeTab, setActiveTab] = useState("measurements");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) navigate("/auth");
      else setUser(user);
    });
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchProtected = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const resCombos = await fetch("http://localhost:5000/api/combos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const combosData = await resCombos.json();
      setFavoriteCombos(combosData.data || []);

      const resStats = await fetch("http://localhost:5000/api/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await resStats.json();
      setHistory(statsData.data || []);
    };

    fetchProtected();
  }, [user]);

  const handleSave = async () => {
    if (weight && height && user) {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      await fetch("http://localhost:5000/api/stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ weight, height }),
      });

      setHistory(prev => [...prev, { weight, height, date: new Date().toISOString() }]);
      setWeight("");
      setHeight("");
    }
  };

  const handleAddCombo = async (combination) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    await fetch("http://localhost:5000/api/combos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ combination }),
    });

    const res = await fetch("http://localhost:5000/api/combos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    setFavoriteCombos(result.data || []);
  };

  const handleDeleteCombo = async (id) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    await fetch(`http://localhost:5000/api/combos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setFavoriteCombos(prev => prev.filter(c => c.id !== id));
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Особистий кабінет</h1>

      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "measurements" && (
        <Measurements
          weight={weight}
          setWeight={setWeight}
          height={height}
          setHeight={setHeight}
          history={history}
          onSave={handleSave}
        />
      )}

      {activeTab === "combinations" && (
        <FavoriteCombos
          combos={favoriteCombos}
          onAdd={handleAddCombo}
          onDelete={handleDeleteCombo}
          onRefresh={async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const res = await fetch("http://localhost:5000/api/combos", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const result = await res.json();
            setFavoriteCombos(result.data || []);
          }}
        />
      )}

      {activeTab === "analytics" && <AnalyticsTab />}

      {activeTab === "mealplanner" && <MealPlanner user={user} />}
    </div>
  );
};

export default Profile;
