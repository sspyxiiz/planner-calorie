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

// 📆 Формат дати ISO → "dd.mm, HH:MM"
const formatDate = (isoString) => {
  const date = new Date(isoString);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}, ${hh}:${min}`;
};

const Measurements = ({
  weight,
  setWeight,
  height,
  setHeight,
  history,
  onSave,
}) => {
  return (
    <div className="bg-white p-4 rounded shadow col-span-1">
      <h2 className="text-xl font-bold mb-3">Виміри</h2>
      <input
        type="number"
        placeholder="Вага (кг)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <input
        type="number"
        placeholder="Зріст (см)"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <button
        onClick={onSave}
        className="bg-blue-600 text-white py-2 px-4 rounded w-full"
      >
        Зберегти
      </button>

      {history.length > 1 && (() => {
        const latest = history[0];
        const previous = history[1];
        const diff = (latest.weight - previous.weight).toFixed(1);
        const isGain = diff > 0;

        return (
          <div className="mt-4 text-sm">
            <strong>Зміна:</strong>{" "}
            <span className={isGain ? "text-green-700" : "text-red-600"}>
              {isGain ? "📈 +" : "📉 "}
              {Math.abs(diff)} кг з {formatDate(previous.date)} по {formatDate(latest.date)}
            </span>
          </div>
        );
      })()}

      {history.length > 0 && (
        <ul className="mt-4 text-sm space-y-1 max-h-48 overflow-y-auto">
          {history.map((item, idx) => (
            <li key={idx}>
              {formatDate(item.date)} — {item.weight} кг, {item.height} см
            </li>
          ))}
        </ul>
      )}

      {/* Графік */}
      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-1">Графік зміни ваги</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={history.slice().reverse()}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={60}
                tickFormatter={formatDate}
              />
              <YAxis unit=" кг" />
              <Tooltip labelFormatter={formatDate} />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#1d4ed8"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Measurements;
