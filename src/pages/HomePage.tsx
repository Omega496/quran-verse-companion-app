
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SurahCard from "@/components/SurahCard";
import MainLayout from "@/components/layout/MainLayout";
import { fetchSurahs } from "@/services/quranService";
import { useLanguage } from "@/contexts/LanguageContext";
import { Surah } from "@/types";
import { useToast } from "@/hooks/use-toast";

const HomePage: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { language, translations } = useLanguage();
  const { toast } = useToast();
  
  // Get recently read surahs from localStorage
  const getRecentSurahs = (): number[] => {
    const recentSurahsStr = localStorage.getItem("quran-app-recent-surahs");
    return recentSurahsStr ? JSON.parse(recentSurahsStr) : [];
  };

  // Get favorite surahs from localStorage
  const getFavoriteSurahs = (): number[] => {
    const favoriteSurahsStr = localStorage.getItem("quran-app-favorite-surahs");
    return favoriteSurahsStr ? JSON.parse(favoriteSurahsStr) : [];
  };

  // Load surahs on component mount and when language changes
  useEffect(() => {
    const loadSurahs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchSurahs(language);
        setSurahs(data);
        setFilteredSurahs(data);
      } catch (err) {
        setError("Failed to load surahs. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load surahs. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSurahs();
  }, [language]);
  
  // Filter surahs based on search query and active tab
  useEffect(() => {
    let filtered = [...surahs];
    
    // Apply search filter if query exists
    if (searchQuery) {
      filtered = filtered.filter(
        (surah) =>
          surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.name_arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.name_translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.id.toString().includes(searchQuery)
      );
    }
    
    // Apply tab filter
    if (activeTab === "recent") {
      const recentSurahIds = getRecentSurahs();
      filtered = filtered.filter(surah => recentSurahIds.includes(surah.id));
    } else if (activeTab === "favorites") {
      const favoriteSurahIds = getFavoriteSurahs();
      filtered = filtered.filter(surah => favoriteSurahIds.includes(surah.id));
    }
    
    setFilteredSurahs(filtered);
  }, [searchQuery, activeTab, surahs]);

  // Toggle favorite status
  const toggleFavorite = (surahId: number) => {
    const favorites = getFavoriteSurahs();
    
    if (favorites.includes(surahId)) {
      const updatedFavorites = favorites.filter(id => id !== surahId);
      localStorage.setItem("quran-app-favorite-surahs", JSON.stringify(updatedFavorites));
      toast({
        description: "Surah removed from favorites",
      });
    } else {
      const updatedFavorites = [...favorites, surahId];
      localStorage.setItem("quran-app-favorite-surahs", JSON.stringify(updatedFavorites));
      toast({
        description: "Surah added to favorites",
      });
    }
    
    // If we're in favorites tab, update the filtered list
    if (activeTab === "favorites") {
      const favoriteSurahIds = [...favorites];
      if (favorites.includes(surahId)) {
        favoriteSurahIds.splice(favoriteSurahIds.indexOf(surahId), 1);
      } else {
        favoriteSurahIds.push(surahId);
      }
      
      const newFiltered = surahs.filter(surah => favoriteSurahIds.includes(surah.id));
      setFilteredSurahs(newFiltered);
    }
  };
  
  // Check if a surah is favorited
  const isFavorite = (surahId: number): boolean => {
    const favorites = getFavoriteSurahs();
    return favorites.includes(surahId);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {translations["home.title"] || "Quran"}
          </h1>
          <p className="text-muted-foreground">
            {translations["home.subtitle"] || "Read, listen, and learn the Holy Quran"}
          </p>
        </div>
        
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10"
            placeholder={translations["search.placeholder"] || "Search surah or verse"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <h2 className="text-xl font-semibold mb-4">
              {translations["surah.list"] || "Surah List"}
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-24 w-full" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : filteredSurahs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No surahs found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredSurahs.map((surah) => (
                  <SurahCard
                    key={surah.id}
                    surah={surah}
                    isFavorite={isFavorite(surah.id)}
                    onToggleFavorite={() => toggleFavorite(surah.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Recently Read</h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-24 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredSurahs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recently read surahs</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/">Browse Surahs</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredSurahs.map((surah) => (
                  <SurahCard
                    key={surah.id}
                    surah={surah}
                    isFavorite={isFavorite(surah.id)}
                    onToggleFavorite={() => toggleFavorite(surah.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-4">
            <h2 className="text-xl font-semibold mb-4">
              {translations["favorites.title"] || "Favorites"}
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-24 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredSurahs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {translations["favorites.empty"] || "No favorites yet"}
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/">Browse Surahs</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredSurahs.map((surah) => (
                  <SurahCard
                    key={surah.id}
                    surah={surah}
                    isFavorite={true}
                    onToggleFavorite={() => toggleFavorite(surah.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default HomePage;
