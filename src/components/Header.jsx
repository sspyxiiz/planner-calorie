// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, getCurrentUser, logout } from "../services/supabaseClient";
import { Menu, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";

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
    <header className="bg-gray-100 p-4 border-b fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="w-full px-4 md:px-8 max-w-screen-xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Калорійний Планер</h1>

        {/* Desktop menu */}
        <nav className="hidden md:flex gap-4 items-center">
          {navItems.filter(i => i.show).map(i => (
            <Link key={i.to} to={i.to} className="hover:underline">
              {i.label}
            </Link>
          ))}

          {user ? (
            <button onClick={handleLogout} className="text-red-600 underline">
              Вийти
            </button>
          ) : (
            <Link to="/auth" className="text-blue-600">Увійти</Link>
          )}
        </nav>

        {/* Mobile burger icon */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="block md:hidden z-50">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <nav
            className="fixed top-0 right-0 w-2/3 h-full bg-white shadow-md p-6 md:hidden z-40 text-lg space-y-4"
          >
            {navItems.filter(i => i.show).map(i => (
              <Link
                key={i.to}
                to={i.to}
                onClick={() => setMenuOpen(false)}
                className="block py-2 border-b"
              >
                {i.label}
              </Link>
            ))}

            {user ? (
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="text-red-600 underline text-left w-full mt-2"
              >
                Вийти
              </button>
            ) : (
              <Link to="/auth" onClick={() => setMenuOpen(false)} className="text-blue-600 block mt-2">
                Увійти
              </Link>
            )}
          </nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
