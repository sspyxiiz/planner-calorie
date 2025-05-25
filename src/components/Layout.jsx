import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = ({ isDarkTheme, setIsDarkTheme }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Header isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
      <main className="pt-20 px-4 md:px-8 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
