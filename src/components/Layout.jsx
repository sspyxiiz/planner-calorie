import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white"> {/* ← тут змінено */}
      <Header />
      <main className="pt-20 px-4 md:px-8 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
