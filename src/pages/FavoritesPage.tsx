
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import SurahCard from "@/components/SurahCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchSurahs, fetchSurahDetails } from "@/services/quranService";
import { Surah, FavoriteSurah, FavoriteVerse } from "@/types";
import { useToast } from "@/hooks/use-toast";

const FavoritesPage: React.FC = () => {
  const [favoriteSurahs, setFavoriteSurahs] = useState<Surah[]>([]);
  const [favoriteVerses, setFavoriteVerses] = useState<any[]>([]);
  const [isLoadingSurahs, setIsLoadingSurahs] = useState(true);
  const [isLoadingVerses, setIsLoadingVerses] = useState(true);
  const { language, translations } = useLanguage();
  const { toast } = useToast();

  // Load favorite surahs
  useEffect(() => {
    const loadFavoriteSurahs = async () => {
      setIsLoadingSurahs(true);
      
      try {
        const favoriteSurahsStr = localStorage.getItem("quran-app-favorite-surahs");
        const favoriteSurahIds: number[] = favoriteSurahsStr ? JSON.parse(favoriteSurahsStr) : [];
        
        if (favoriteSurahIds.length === 0) {
          setFavoriteSurahs([]);
          setIsLoadingSurahs(false);
          return;
        }
        
        // Get all surahs
        const allSurahs = await fetchSurahs(language);
        
        // Filter to favorite surahs
        const favorites = allSurahs.filter(surah => favoriteSurahIds.includes(surah.id));
        setFavoriteSurahs(favorites);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load favorite surahs",
          variant: "destructive",
        });
      } finally {
        setIsLoadingSurahs(false);
      }
    };
    
    loadFavoriteSurahs();
  }, [language]);
  
  // Load favorite verses
  useEffect(() => {
    const loadFavoriteVerses = async () => {
      setIsLoadingVerses(true);
      
      try {
        const favoriteVersesStr = localStorage.getItem("quran-app-favorite-verses");
        const storedFavoriteVerses: FavoriteVerse[] = favoriteVersesStr 
          ? JSON.parse(favoriteVersesStr) 
          : [];
        
        if (storedFavoriteVerses.length === 0) {
          setFavoriteVerses([]);
          setIsLoadingVerses(false);
          return;
        }
        
        // Group by surahId for efficient fetching
        const verseBySurah: Record<number, number[]> = {};
        storedFavoriteVerses.forEach(fav => {
          if (!verseBySurah[fav.surahId]) {
            verseBySurah[fav.surahId] = [];
          }
          verseBySurah[fav.surahId].push(fav.verseId);
        });
        
        // Fetch details for each surah
        const versesWithDetails = await Promise.all(
          Object.entries(verseBySurah).map(async ([surahId, verseIds]) => {
            const { surah, verses } = await fetchSurahDetails(parseInt(surahId), language);
            
            // Filter only favorited verses
            const favVerses = verses.filter(v => verseIds.includes(v.id));
            
            return favVerses.map(verse => ({
              ...verse,
              surahId: surah.id,
              surahName: surah.name,
              surahNameArabic: surah.name_arabic
            }));
          })
        );
        
        // Flatten and sort by timestamp
        const flattenedVerses = versesWithDetails.flat();
        setFavoriteVerses(flattenedVerses);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load favorite verses",
          variant: "destructive",
        });
      } finally {
        setIsLoadingVerses(false);
      }
    };
    
    loadFavoriteVerses();
  }, [language]);
  
  // Remove surah from favorites
  const removeSurahFromFavorites = (surahId: number) => {
    const favoriteSurahsStr = localStorage.getItem("quran-app-favorite-surahs");
    const favoriteSurahIds: number[] = favoriteSurahsStr ? JSON.parse(favoriteSurahsStr) : [];
    
    const updatedFavorites = favoriteSurahIds.filter(id => id !== surahId);
    localStorage.setItem("quran-app-favorite-surahs", JSON.stringify(updatedFavorites));
    
    setFavoriteSurahs(prevSurahs => prevSurahs.filter(surah => surah.id !== surahId));
    
    toast({
      description: "Surah removed from favorites",
    });
  };
  
  // Remove verse from favorites
  const removeVerseFromFavorites = (verseId: number, surahId: number) => {
    const favoriteVersesStr = localStorage.getItem("quran-app-favorite-verses");
    const storedFavoriteVerses: FavoriteVerse[] = favoriteVersesStr 
      ? JSON.parse(favoriteVersesStr) 
      : [];
    
    const updatedFavorites = storedFavoriteVerses.filter(
      fav => !(fav.verseId === verseId && fav.surahId === surahId)
    );
    
    localStorage.setItem("quran-app-favorite-verses", JSON.stringify(updatedFavorites));
    
    setFavoriteVerses(prevVerses => 
      prevVerses.filter(verse => !(verse.id === verseId && verse.surahId === surahId))
    );
    
    toast({
      description: "Verse removed from favorites",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {translations["favorites.title"] || "Favorites"}
          </h1>
        </div>
        
        <Tabs defaultValue="surahs">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="surahs">
              {translations["favorites.surahs"] || "Favorite Surahs"}
            </TabsTrigger>
            <TabsTrigger value="verses">
              {translations["favorites.verses"] || "Favorite Verses"}
            </TabsTrigger>
          </TabsList>
          
          {/* Favorite Surahs */}
          <TabsContent value="surahs" className="mt-4">
            {isLoadingSurahs ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-24 w-full" />
                ))}
              </div>
            ) : favoriteSurahs.length === 0 ? (
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
                {favoriteSurahs.map(surah => (
                  <SurahCard
                    key={surah.id}
                    surah={surah}
                    isFavorite={true}
                    onToggleFavorite={() => removeSurahFromFavorites(surah.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Favorite Verses */}
          <TabsContent value="verses" className="mt-4 space-y-4">
            {isLoadingVerses ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-24 w-full" />
                ))}
              </div>
            ) : favoriteVerses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {translations["favorites.empty"] || "No favorites yet"}
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/">Browse Surahs</Link>
                </Button>
              </div>
            ) : (
              favoriteVerses.map(verse => (
                <Link
                  key={`${verse.surahId}-${verse.id}`}
                  to={`/surah/${verse.surahId}#verse-${verse.verse_number}`}
                >
                  <Card className="hover:bg-accent transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-md flex items-center gap-2">
                          <span>{verse.surahName}</span>
                          <span className="text-sm text-muted-foreground">
                            • Verse {verse.verse_number}
                          </span>
                        </CardTitle>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.preventDefault();
                            removeVerseFromFavorites(verse.id, verse.surahId);
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2 text-sm" dir="rtl">
                        {verse.text}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {verse.translation}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default FavoritesPage;
