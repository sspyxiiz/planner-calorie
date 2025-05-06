// src/services/productApi.js
import axios from "axios";
import { PRODUCT_TRANSLATIONS } from "./productDictionary";

const APP_ID = import.meta.env.VITE_NUTRITIONIX_APP_ID;
const APP_KEY = import.meta.env.VITE_NUTRITIONIX_APP_KEY;

export const searchProduct = async (rawInput) => {
  const productList = rawInput
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean); // Видалити порожні значення

  const results = [];

  for (const product of productList) {
    const translated = PRODUCT_TRANSLATIONS[product] || product;

    try {
      const response = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        { query: `1 ${translated}` },
        {
          headers: {
            "x-app-id": "776a978b",
            "x-app-key": "69f8463f227a98f9cc0740687261229b",
            "Content-Type": "application/json"
          }
        }
      );

      const items = response.data.foods.map((item) => ({
        name: item.food_name,
        calories: item.nf_calories,
        protein: item.nf_protein,
        fat: item.nf_total_fat,
        carbs: item.nf_total_carbohydrate
      }));

      results.push(...items);
    } catch (error) {
      console.warn(`Помилка продукту "${product}":`, error.response?.data || error.message);
    }
  }

  return results;
};
