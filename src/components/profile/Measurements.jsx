import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}, ${hh}:${min}`;
};

const Measurements = ({ weight, setWeight, height, setHeight, history, onSave }) => {
  const latest = history[0];
  const previous = history[1];
  const diff = latest && previous ? (latest.weight - previous.weight).toFixed(1) : 0;
  const isGain = diff > 0;

  return (
    <div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">📏 Виміри тіла</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="number"
          placeholder="Вага (кг)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="number"
          placeholder="Зріст (см)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <button
        onClick={onSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
      >
        💾 Зберегти вимір
      </button>

      {latest && previous && (
        <div className="mt-5 text-sm text-center">
          <strong>Зміна:</strong>{" "}
          <span className={isGain ? "text-green-600" : "text-red-600"}>
            {isGain ? "📈 +" : "📉 -"}{Math.abs(diff)} кг
          </span>
          <span className="text-gray-500 dark:text-gray-400"> з {formatDate(previous.date)} по {formatDate(latest.date)}</span>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">📅 Історія вимірів</h3>
          <ul className="max-h-40 overflow-y-auto text-sm space-y-1 text-gray-700 dark:text-gray-200 px-2">
            {history.map((item, idx) => (
              <li key={idx} className="border-b border-gray-200 dark:border-zinc-700 pb-1">
                {formatDate(item.date)} — <strong>{item.weight} кг</strong>, {item.height} см
              </li>
            ))}
          </ul>
        </div>
      )}

      {history.length > 1 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">📊 Графік зміни ваги</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={history.slice().reverse()}
                margin={{ top: 5, right: 20, left: 10, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                />
                <Tooltip
                  labelFormatter={formatDate}
                  contentStyle={{ backgroundColor: "#1f2937", border: "none" }} // темно-сіра підкладка
                  labelStyle={{ color: "#ffffff" }} // білий текст дати
                  itemStyle={{ color: "#3b82f6" }}  // синій для значення ваги
                />
                <YAxis unit=" кг" />
                <Tooltip labelFormatter={formatDate} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Measurements;
