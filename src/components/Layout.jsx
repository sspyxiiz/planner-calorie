// src/components/Layout.jsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer"; // якщо є футер, інакше видали цей рядок
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Основний контент із відступом під fixed header */}
      <main className="pt-[calc(theme(spacing.4)+theme(spacing.16))] px-4 md:px-8 flex-1">
        <Outlet />
      </main>

      <Footer /> {/* або видали, якщо футера нема */}
    </div>
  );
};

export default Layout;
