import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, getCurrentUser, logout } from "../services/supabaseClient";
import { Menu, X, Flame, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Header = ({ isDarkTheme, setIsDarkTheme }) => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser().then(setUser);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user || null)
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/auth");
  };

  const toggleTheme = () => {
    setIsDarkTheme((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const navItems = [
    { to: "/", label: "Головна", show: true },
    { to: "/recipes", label: "Рецепти", show: true },
    { to: "/profile", label: "Кабінет", show: user !== null },
  ];

  return (
    <header className="bg-white dark:bg-zinc-800 border-b shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-blue-600 dark:text-blue-400">
          <Flame className="w-6 h-6 text-orange-500" />
          Планер калорій
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.filter(i => i.show).map(i => (
            <Link
              key={i.to}
              to={i.to}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
            >
              {i.label}
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            className="text-gray-700 dark:text-gray-200 hover:text-yellow-500 transition"
            title="Перемкнути тему"
          >
            {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline transition"
            >
              Вийти
            </button>
          ) : (
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition"
            >
              Увійти
            </Link>
          )}
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="block md:hidden text-gray-700 dark:text-gray-200 z-50"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
              className="fixed top-0 right-0 w-2/3 h-full bg-white dark:bg-zinc-900 shadow-lg p-6 z-50 flex flex-col gap-4 text-lg"
            >
              {navItems.filter(i => i.show).map(i => (
                <Link
                  key={i.to}
                  to={i.to}
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-800 dark:text-gray-200 hover:text-blue-600 border-b py-2"
                >
                  {i.label}
                </Link>
              ))}

              <button
                onClick={toggleTheme}
                className="text-gray-700 dark:text-gray-200 hover:text-yellow-500 mt-2 text-left"
              >
                {isDarkTheme ? "🌞 Світла тема" : "🌙 Темна тема"}
              </button>

              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-red-600 underline mt-4 text-left"
                >
                  Вийти
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded mt-4 text-center"
                >
                  Увійти
                </Link>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
