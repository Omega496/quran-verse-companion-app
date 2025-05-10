import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import MainLayout from "@/components/layout/MainLayout";
import SurahCard from "@/components/SurahCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { searchQuran } from "@/services/quranService";
import { Surah, Verse } from "@/types";
import { useToast } from "@/hooks/use-toast";

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    verses: Verse[];
    surahs: Surah[];
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const history = localStorage.getItem("quran-app-search-history");
    return history ? JSON.parse(history) : [];
  });
  const { language, translations } = useLanguage();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      const results = await searchQuran(searchQuery, language);
      setSearchResults(results);
      
      // Update search history
      const updatedHistory = [
        searchQuery,
        ...searchHistory.filter((item) => item !== searchQuery),
      ].slice(0, 5); // Keep last 5 searches
      
      setSearchHistory(updatedHistory);
      localStorage.setItem("quran-app-search-history", JSON.stringify(updatedHistory));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("quran-app-search-history");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {translations["navigation.search"] || "Search"}
          </h1>
        </div>
        
        {/* Search bar */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10"
              placeholder={translations["search.placeholder"] || "Search surah or verse"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>
        
        {/* Search history */}
        {!searchResults && searchHistory.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Recent Searches</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearchHistory}
                className="text-muted-foreground"
              >
                Clear History
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((query) => (
                <Button
                  key={query}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => {
                    setSearchQuery(query);
                    setTimeout(handleSearch, 100);
                  }}
                >
                  <Search className="h-3 w-3" />
                  {query}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Search results */}
        {isSearching ? (
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-1 gap-4">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-24 w-full" />
              ))}
            </div>
          </div>
        ) : searchResults ? (
          <div className="mt-6">
            {searchResults.verses.length === 0 && searchResults.surahs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try using different keywords or check your spelling
                </p>
              </div>
            ) : (
              <Tabs defaultValue="verses">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="verses">
                    Verses ({searchResults.verses.length})
                  </TabsTrigger>
                  <TabsTrigger value="surahs">
                    Surahs ({searchResults.surahs.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="verses" className="mt-4 space-y-4">
                  {searchResults.verses.map((verse) => (
                    <Link key={verse.id} to={`/surah/${verse.surahId}#verse-${verse.verse_number}`}>
                      <Card className="hover:bg-accent transition-colors">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md flex justify-between">
                            <span>{verse.surahName}</span>
                            <span className="text-sm text-muted-foreground">
                              Verse {verse.verse_number}
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm line-clamp-2">{verse.translation}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </TabsContent>
                
                <TabsContent value="surahs" className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {searchResults.surahs.map((surah) => (
                      <SurahCard key={surah.id} surah={surah} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
            
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchResults(null);
                  setSearchQuery("");
                }}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Results
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default SearchPage;
