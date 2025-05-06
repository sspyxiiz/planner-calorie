// src/pages/Home.jsx
import React, { useState } from "react";
import { searchProduct } from "../services/productApi";
import { getCurrentUser } from "../services/supabaseClient";
import SaveCombinationButton from "../components/profile/SaveCombinationButton";
import { fetchFavoriteCombos } from "../services/supabaseClient";
import { motion } from "framer-motion";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const userData = await getCurrentUser();
    setUser(userData);

    const products = await searchProduct(inputValue);
    const productsWithWeight = products.map(product => ({ ...product, weight: 100 }));
    setResults(productsWithWeight);
    setLoading(false);
  };

  const handleWeightChange = (index, weight) => {
    setResults((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, weight: Number(weight) } : item
      )
    );
  };

  const refreshCombos = async () => {
    if (!user) return;
    const { data } = await fetchFavoriteCombos(user.id);
    console.log("Оновлені комбінації:", data);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-100 via-white to-blue-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-black"></div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          🍽️ Пошук КБЖУ продуктів
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
          Введіть продукти через кому: <em>курка, рис, огірок</em>
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Наприклад: рис, курка, огірок"
          className="flex-1 border border-gray-300 dark:border-zinc-700 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md px-4 py-3 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !inputValue.trim()}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow font-medium transition"
        >
          {loading ? "Пошук..." : "Пошук"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-6">
          {results.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ delay: idx * 0.05, type: "spring", stiffness: 200 }}
              className="bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-white/20 dark:border-zinc-700 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:ring-1 hover:ring-green-400/50"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                <span className="text-sm text-gray-500">
                  {(item.calories * item.weight / 100).toFixed(1)} ккал
                </span>
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-300 mb-2">
                Б: {(item.protein * item.weight / 100).toFixed(1)}г,
                Ж: {(item.fat * item.weight / 100).toFixed(1)}г,
                В: {(item.carbs * item.weight / 100).toFixed(1)}г
              </div>
              <div>
                <input
                  type="number"
                  value={item.weight}
                  onChange={(e) => handleWeightChange(idx, e.target.value)}
                  className="border border-gray-300 px-2 py-1 rounded w-24 dark:bg-zinc-900 dark:border-zinc-600"
                /> г
              </div>
            </motion.div>
          ))}

          <SaveCombinationButton
            user={user}
            inputValue={results}
            onClear={() => {
              setInputValue("");
              setResults([]);
            }}
            refreshCombos={refreshCombos}
          />
        </div>
      )}

      {inputValue && !results.length && !loading && (
        <p className="text-gray-500 text-center mt-6">Не знайдено інформації.</p>
      )}
    </div>
  );
};

export default Home;
