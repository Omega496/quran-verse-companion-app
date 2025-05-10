
import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Bookmark, Clock, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/toaster";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { translations } = useLanguage();
  
  const navigation = [
    {
      name: translations["navigation.home"] || "Home",
      path: "/",
      icon: <Home className="h-5 w-5" />
    },
    {
      name: translations["navigation.search"] || "Search",
      path: "/search",
      icon: <Search className="h-5 w-5" />
    },
    {
      name: translations["navigation.favorites"] || "Favorites",
      path: "/favorites",
      icon: <Bookmark className="h-5 w-5" />
    },
    {
      name: translations["navigation.prayerTimes"] || "Prayer Times",
      path: "/prayer-times",
      icon: <Clock className="h-5 w-5" />
    },
    {
      name: translations["navigation.settings"] || "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-semibold text-xl">
            {translations["app.name"] || "Al Quran Companion"}
          </Link>
          <div className="flex items-center space-x-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Bottom navigation */}
      <nav className="bg-background border-t sticky bottom-0 z-10">
        <div className="container mx-auto h-16">
          <ul className="flex justify-around h-full">
            {navigation.map((item) => (
              <li key={item.path} className="flex-1">
                <Link
                  to={item.path}
                  className={`flex flex-col items-center justify-center h-full px-2 ${
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  <span className="text-xs mt-1">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default MainLayout;
