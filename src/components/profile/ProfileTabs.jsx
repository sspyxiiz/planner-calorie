import React from "react";
import clsx from "clsx";

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "measurements", label: "Виміри" },
    { key: "combinations", label: "Комбінації продуктів" },
    { key: "analytics", label: "Аналітика" },
    { key: "mealplanner", label: "Планування меню" },
  ];

  return (
    <div className="mb-6 flex border-b">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={clsx(
            "px-4 py-2 font-medium text-sm focus:outline-none",
            activeTab === tab.key
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
