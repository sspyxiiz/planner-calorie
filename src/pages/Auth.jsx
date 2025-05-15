// src/pages/Auth.jsx
import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Github } from "lucide-react";
import { motion } from "framer-motion";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setError("");
    let result;
    if (isLogin) {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }
    const { error } = result;
    if (error) setError(error.message);
    else navigate("/");
  };

  const handleOAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "github" });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-zinc-900 dark:to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-zinc-900 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700"
      >
        <div className="bg-zinc-900 text-white p-8 flex flex-col justify-between dark:bg-zinc-800">
          <div>
            <h1 className="text-xl font-bold mb-4">🍽 Планер калорій</h1>
            <p className="text-gray-400">
            </p>
          </div>
          <p className="mt-6 text-sm text-gray-500">Цей сервіс допомагає відслідковувати харчування та краще планувати раціон.</p>
        </div>

        <div className="p-8 dark:text-white">
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {isLogin ? "Увійти" : "Створити акаунт"}
            </h2>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              {isLogin ? "Реєстрація" : "Вхід"}
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700"
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700"
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              onClick={handleAuth}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-lg hover:opacity-90 transition"
            >
              {isLogin ? "Увійти" : "Зареєструватися"}
            </button>

            <div className="flex items-center gap-2 text-gray-400">
              <div className="flex-1 border-t"></div>
              <span className="text-sm"></span>
              <div className="flex-1 border-t"></div>
            </div>

            
          </div>

          <p className="text-xs text-gray-400 mt-6 text-center dark:text-gray-500">
            Натискаючи, ви погоджуєтесь з <span className="underline">умовами</span> та <span className="underline">політикою конфіденційності</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
