import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

const RecipeAnalytics = ({ archive }) => {
  if (!archive || archive.length === 0) {
    return <p className="text-gray-500 text-sm">Недостатньо даних для аналітики.</p>;
  }

  const kitchenCounts = archive.reduce((acc, rec) => {
    const kitchen = rec.kitchen || "Невідомо";
    acc[kitchen] = (acc[kitchen] || 0) + 1;
    return acc;
  }, {});
  const kitchenData = Object.entries(kitchenCounts).map(([k, v]) => ({ name: k, value: v }));

  const calorieData = archive.filter((r) => r.total_calories > 0).map((r) => ({
    name: r.title.length > 12 ? r.title.slice(0, 12) + "…" : r.title,
    calories: r.total_calories,
  }));

  const total = archive.length;
  const avgCalories =
    archive.reduce((sum, r) => sum + r.total_calories, 0) / Math.max(1, total);
  const uniqueKitchens = Object.keys(kitchenCounts).length;

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold mb-4">📊 Аналітика рецептів</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium mb-2">Типи кухонь</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={kitchenData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {kitchenData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium mb-2">Калорійність страв</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={calorieData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis unit=" ккал" />
              <Tooltip />
              <Bar dataKey="calories" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-center">
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-4">
          <p className="text-gray-500">Збережено рецептів</p>
          <p className="text-xl font-semibold">{total}</p>
        </div>
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-4">
          <p className="text-gray-500">Середня калорійність</p>
          <p className="text-xl font-semibold">{avgCalories.toFixed(0)} ккал</p>
        </div>
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-4">
          <p className="text-gray-500">Кухонь у вибірці</p>
          <p className="text-xl font-semibold">{uniqueKitchens}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeAnalytics;
