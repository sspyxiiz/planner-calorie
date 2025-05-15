import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, getCurrentUser, logout } from "../services/supabaseClient";
import { Menu, X, Flame } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Header = () => {
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

  const navItems = [
    { to: "/", label: "Головна", show: true },
    { to: "/recipes", label: "Рецепти", show: true },
    { to: "/profile", label: "Кабінет", show: user !== null },
  ];

  return (
    <header className="bg-white border-b shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        {/* Логотип */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-blue-600">
          <Flame className="w-6 h-6 text-orange-500" />
          Планер калорій
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.filter(i => i.show).map(i => (
            <Link
              key={i.to}
              to={i.to}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {i.label}
            </Link>
          ))}

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

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="block md:hidden text-gray-700 z-50"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
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
              className="fixed top-0 right-0 w-2/3 h-full bg-white shadow-lg p-6 z-50 flex flex-col gap-4 text-lg"
            >
              {navItems.filter(i => i.show).map(i => (
                <Link
                  key={i.to}
                  to={i.to}
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-800 hover:text-blue-600 border-b py-2"
                >
                  {i.label}
                </Link>
              ))}

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
