
import React from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, Clock, Heart } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import SurahCard from "@/components/SurahCard";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { fetchSurahs } from "@/services/quranService";
import { useLanguage } from "@/contexts/LanguageContext";
import DownloadProject from "@/components/DownloadProject";
import { Surah } from "@/types";
import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
  const { language, translations } = useLanguage();
  
  // Fetch all surahs
  const { data: surahs = [], isLoading: isSurahsLoading } = useQuery({
    queryKey: ["surahs", language],
    queryFn: () => fetchSurahs(language),
  });
  
  // Get recently read surahs from local storage
  const recentSurahsIds = JSON.parse(
    localStorage.getItem("quran-app-recent-surahs") || "[]"
  );
  const recentSurahs = recentSurahsIds
    .map((id: number) => surahs.find((s: Surah) => s.id === id))
    .filter(Boolean);
  
  // Get favorite surahs from local storage
  const favoriteSurahsIds = JSON.parse(
    localStorage.getItem("quran-app-favorite-surahs") || "[]"
  );
  const favoriteSurahs = favoriteSurahsIds
    .map((id: number) => surahs.find((s: Surah) => s.id === id))
    .filter(Boolean);
  
  const renderSurahList = (surahList: Surah[] | undefined, limit: number = 6) => {
    if (!surahList || surahList.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No surahs found</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {surahList.slice(0, limit).map((surah) => (
          <SurahCard key={surah.id} surah={surah} />
        ))}
      </div>
    );
  };
  
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">
            {translations["homepage.title"] || "Al Quran Companion"}
          </h1>
          <p className="text-muted-foreground max-w-[700px] mx-auto">
            {translations["homepage.subtitle"] || 
              "Read, listen, and study the Holy Quran with translations and audio recitation"}
          </p>
          
          <div className="flex justify-center gap-2 pt-2">
            <Link to="/search" className="w-full sm:w-auto">
              <Card className="hover:bg-accent transition-colors">
                <CardContent className="p-4 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>{translations["common.search"] || "Search"}</span>
                </CardContent>
              </Card>
            </Link>
            <DownloadProject />
          </div>
        </div>
        
        {/* Recent Reads Section */}
        {recentSurahs.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">
                {translations["homepage.recentReads"] || "Recent Reads"}
              </h2>
            </div>
            {renderSurahList(recentSurahs, 3)}
          </div>
        )}
        
        {/* Favorites Section */}
        {favoriteSurahs.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-semibold">
                {translations["homepage.favorites"] || "Favorites"}
              </h2>
            </div>
            {renderSurahList(favoriteSurahs, 3)}
          </div>
        )}
        
        {/* All Surahs Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">
              {translations["homepage.allSurahs"] || "All Surahs"}
            </h2>
          </div>
          
          {isSurahsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="h-32 animate-pulse bg-muted" />
              ))}
            </div>
          ) : (
            renderSurahList(surahs)
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
