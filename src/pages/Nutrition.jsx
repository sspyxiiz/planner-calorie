import React, { useState } from "react";
import SaveCombinationButton from "../components/profile/SaveCombinationButton";
import { PRODUCT_TRANSLATIONS } from "../services/productDictionary";

const Nutrition = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [weight, setWeight] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    const terms = query.split(",").map((q) => q.trim().toLowerCase());
    const found = terms
      .map((term) => PRODUCT_DICTIONARY.find((p) => p.name.toLowerCase() === term))
      .filter(Boolean);
    setResults(found);
  };

  const handleAdd = (product) => {
    const grams = parseFloat(weight);
    if (!grams || grams <= 0) return;

    const ratio = grams / 100;
    setSelected((prev) => [
      ...prev,
      {
        ...product,
        grams,
        calories: +(product.calories * ratio).toFixed(2),
        protein: +(product.protein * ratio).toFixed(2),
        fat: +(product.fat * ratio).toFixed(2),
        carbs: +(product.carbs * ratio).toFixed(2),
      },
    ]);
    setWeight("");
  };

  const totals = selected.reduce(
    (acc, p) => {
      acc.grams += p.grams;
      acc.calories += p.calories;
      acc.protein += p.protein;
      acc.fat += p.fat;
      acc.carbs += p.carbs;
      return acc;
    },
    { grams: 0, calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">КБЖВ Продуктів</h1>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введіть продукти через кому (наприклад: рис, курка, огірок)"
          className="border p-2 w-full mb-2"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2">
          Пошук
        </button>
      </div>

      {results.map((product, i) => (
        <div key={i} className="border p-2 my-2 rounded">
          <p className="font-medium">Назва: {product.name}</p>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Вага (г)"
            className="border p-1 my-2 mr-2 w-32"
          />
          <button
            onClick={() => handleAdd(product)}
            className="bg-green-500 text-white px-3 py-1"
          >
            Додати
          </button>
        </div>
      ))}

      {selected.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Підібрані продукти</h2>
          <table className="table-auto w-full border">
            <thead>
              <tr>
                <th>Назва</th>
                <th>Вага (г)</th>
                <th>Калорії</th>
                <th>Білки</th>
                <th>Жири</th>
                <th>Вуглеводи</th>
              </tr>
            </thead>
            <tbody>
              {selected.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.grams}</td>
                  <td>{item.calories}</td>
                  <td>{item.protein}</td>
                  <td>{item.fat}</td>
                  <td>{item.carbs}</td>
                </tr>
              ))}
              <tr className="font-bold border-t">
                <td>Разом:</td>
                <td>{totals.grams}</td>
                <td>{totals.calories.toFixed(2)}</td>
                <td>{totals.protein.toFixed(2)}</td>
                <td>{totals.fat.toFixed(2)}</td>
                <td>{totals.carbs.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4">
            <SaveCombinationButton combination={selected} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutrition;
