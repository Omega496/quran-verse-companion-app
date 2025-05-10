
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { searchQuran } from "@/services/quranService";
import { Surah, Verse } from "@/types";
import { useToast } from "@/hooks/use-toast";
import SearchInput from "@/components/search/SearchInput";
import SearchHistory from "@/components/search/SearchHistory";
import SearchResults from "@/components/search/SearchResults";

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

  const handleSelectHistoryItem = (query: string) => {
    setSearchQuery(query);
    setTimeout(handleSearch, 100);
  };

  const handleClearResults = () => {
    setSearchResults(null);
    setSearchQuery("");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {translations["navigation.search"] || "Search"}
          </h1>
        </div>
        
        <SearchInput 
          searchQuery={searchQuery}
          isSearching={isSearching}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
          onKeyDown={handleKeyDown}
        />
        
        {!searchResults && (
          <SearchHistory 
            searchHistory={searchHistory}
            onClearHistory={clearSearchHistory}
            onSelectHistoryItem={handleSelectHistoryItem}
          />
        )}
        
        <SearchResults 
          isSearching={isSearching}
          searchResults={searchResults}
          searchQuery={searchQuery}
          onClearResults={handleClearResults}
        />
      </div>
    </MainLayout>
  );
};

export default SearchPage;
