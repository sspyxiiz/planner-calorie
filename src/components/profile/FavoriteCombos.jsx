import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { RotateCcw, Trash2 } from "lucide-react";

const FavoriteCombos = ({ combos = [], onAdd, onDelete, onRefresh }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center pt-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {onRefresh && (
            <Button onClick={onRefresh} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Оновити комбінації
            </Button>
          )}
        </motion.div>
      </div>

      {combos.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Немає збережених комбінацій.
        </p>
      )}

      {combos.map((combo, idx) => (
        <motion.div
          key={combo.id || idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
        >
          <Card className="bg-white dark:bg-zinc-800 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-400">
                Комбінація №{combo.id?.slice(0, 8) || idx + 1}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
              {combo.combination.map((item, i) => (
                <div key={i}>
                  <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span> — {item.weight}г, {item.calories.toFixed(2)} ккал, {" "}
                  <span className="text-green-700 dark:text-green-400">Білки: {item.protein.toFixed(2)}г</span>, {" "}
                  <span className="text-yellow-700 dark:text-yellow-400">Жири: {item.fat.toFixed(2)}г</span>, {" "}
                  <span className="text-blue-700 dark:text-blue-400">Вуглеводи: {item.carbs.toFixed(2)}г</span>
                </div>
              ))}

              <div className="mt-3 font-medium text-gray-900 dark:text-white">
                Загалом: <span className="font-bold">{combo.total_calories.toFixed(2)} ккал</span>, {" "}
                <span className="text-green-800 dark:text-green-400">Білки: {combo.total_protein.toFixed(2)}г</span>, {" "}
                <span className="text-yellow-800 dark:text-yellow-400">Жири: {combo.total_fat.toFixed(2)}г</span>, {" "}
                <span className="text-blue-800 dark:text-blue-400">Вуглеводи: {combo.total_carbs.toFixed(2)}г</span>
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  onClick={() => onDelete(combo.id)}
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium hover:underline"
                >
                  <Trash2 className="h-4 w-4" />
                  Видалити комбінацію
                </button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default FavoriteCombos;
