import React, { useState, useEffect } from "react";
import { searchProduct } from "../services/productApi";
import { getCurrentUser, fetchFavoriteCombos } from "../services/supabaseClient";
import SaveCombinationButton from "../components/profile/SaveCombinationButton";
import { Search } from "lucide-react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const handleSearch = async () => {
    if (!inputValue.trim()) return;
    setLoading(true);
    const products = await searchProduct(inputValue);
    const productsWithWeight = products.map((product) => ({ ...product, weight: 100 }));
    setResults(productsWithWeight);
    setLoading(false);
  };

  const handleWeightChange = (index, weight) => {
    setResults((prevResults) =>
      prevResults.map((item, idx) =>
        idx === index ? { ...item, weight: Number(weight) } : item
      )
    );
  };

  const refreshCombos = async () => {
    if (user) {
      const { data } = await fetchFavoriteCombos(user.id);
      console.log("Оновлені комбінації:", data);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">🔍 Знайди КБЖУ продуктів</h1>

      <div className="flex items-center gap-2 mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Наприклад: рис, курка, огірок"
            className="pl-10 pr-4 py-3 w-full rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition"
          disabled={loading || !inputValue.trim()}
        >
          {loading ? "Пошук..." : "Пошук"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl shadow-md border hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h2>
                  <div className="text-sm text-gray-600">
                    <span className="mr-3">🔥 {(item.calories * item.weight / 100).toFixed(1)} ккал</span>
                    <span className="text-green-600 font-medium mr-2">🥩 Б: {(item.protein * item.weight / 100).toFixed(1)} г</span>
                    <span className="text-yellow-600 font-medium mr-2">🧈 Ж: {(item.fat * item.weight / 100).toFixed(1)} г</span>
                    <span className="text-blue-600 font-medium">🍞 В: {(item.carbs * item.weight / 100).toFixed(1)} г</span>
                  </div>
                </div>
                <div className="mt-3 md:mt-0">
                  <input
                    type="number"
                    value={item.weight}
                    onChange={(e) => handleWeightChange(idx, e.target.value)}
                    className="border px-3 py-2 rounded-xl w-24 text-center shadow-sm"
                  /> г
                </div>
              </div>
            </div>
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
        <p className="text-center text-gray-500">Не знайдено інформації.</p>
      )}
    </div>
  );
};

export default Home;
