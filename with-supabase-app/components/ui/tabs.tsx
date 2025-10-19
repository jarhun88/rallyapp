"use client";

import { cn } from "@/lib/utils";
import { Home, Calendar, Users, Settings } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const tabs: Tab[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "events", label: "Events", icon: Calendar },
  { id: "members", label: "Members", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Tabs({ activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn("border-b border-gray-200 dark:border-gray-700", className)}>
      <nav className="flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap",
                isActive
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
