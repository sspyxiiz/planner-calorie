import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Nutrition from "./pages/Nutrition";
import Layout from "./components/Layout"; 

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkTheme) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkTheme]);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={<Layout isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />}
        >
          <Route index element={<Home />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
