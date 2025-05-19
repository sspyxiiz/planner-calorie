import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const logout = async () => {
  await supabase.auth.signOut();
};

export const saveUserStat = async (userId, weight, height) => {
  const record = {
    user_id: userId,
    weight,
    height,
    date: new Date().toISOString().replace("T", " ").substring(0, 16),
  };

  return await supabase.from("user_stats").insert([record]);
};

export const fetchUserStats = async (userId) => {
  const { data, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  return { data, error };
};

export const fetchFavorites = async (userId) => {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const deleteFavorite = async (id) => {
  return await supabase.from("favorites").delete().eq("id", id);
};

export const fetchFavoriteCombos = async (userId) => {
  const { data, error } = await supabase
    .from("favorite_combinations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchFavoriteCombos error:", error);
    return { data: [] };
  }

  const parsed = data.map((combo) => ({
    ...combo,
    combination:
      typeof combo.combination === "string"
        ? JSON.parse(combo.combination)
        : combo.combination,
  }));

  return { data: parsed };
};

export const deleteFavoriteCombo = async (id) => {
  return await supabase.from("favorite_combinations").delete().eq("id", id);
};

export const fetchRecipeArchive = async (userId) => {
  const { data, error } = await supabase
    .from("recipe_archive")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const deleteArchivedRecipe = async (id) => {
  return await supabase.from("recipe_archive").delete().eq("id", id);
};

export const fetchUserGoal = async (userId) => {
  const { data, error } = await supabase
    .from("user_goals")
    .select("goal")
    .eq("user_id", userId)
    .single();

  return { data, error };
};

export const saveUserGoal = async (userId, goal) => {
  return await supabase
    .from("user_goals")
    .upsert({ user_id: userId, goal, updated_at: new Date().toISOString() });
};
