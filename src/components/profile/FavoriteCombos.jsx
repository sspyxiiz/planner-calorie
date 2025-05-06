// src/components/profile/FavoriteCombos.jsx
import React from "react";

const FavoriteCombos = ({ combos, onDelete }) => {
  if (!combos || combos.length === 0) {
    return <p className="text-center text-gray-500">Немає збережених комбінацій.</p>;
  }

  return (
    <div className="space-y-4">
      {combos.map((combo) => (
        <div key={combo.id} className="border p-4 rounded shadow bg-white">
          <h3 className="font-semibold text-center mb-2">
            Комбінація №{combo.id.slice(0, 8)}
          </h3>

          <div className="space-y-1">
            {Array.isArray(combo.combination) &&
              combo.combination.map((item, idx) => (
                <div key={idx}>
                  <strong>{item.name}</strong> — {item.weight}г, {item.calories} ккал,
                  Білки: {item.protein}г, Жири: {item.fat}г, Вуглеводи: {item.carbs}г
                </div>
              ))}
          </div>

          <div className="mt-2 border-t pt-2 font-medium">
            Загалом: {(combo.total_calories ?? 0).toFixed(2)} ккал, Білки: {(combo.total_protein ?? 0).toFixed(2)}г,
            Жири: {(combo.total_fat ?? 0).toFixed(2)}г, Вуглеводи: {(combo.total_carbs ?? 0).toFixed(2)}г
          </div>

          <button
            onClick={() => onDelete(combo.id)}
            className="text-red-600 text-sm underline mt-2 inline-block"
          >
            Видалити комбінацію
          </button>
        </div>
      ))}
    </div>
  );
};

export default FavoriteCombos;
