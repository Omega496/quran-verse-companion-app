
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import VerseResults from "./VerseResults";
import SurahResults from "./SurahResults";
import { Surah, Verse } from "@/types";

interface SearchResultsProps {
  isSearching: boolean;
  searchResults: { verses: Verse[]; surahs: Surah[] } | null;
  searchQuery: string;
  onClearResults: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  isSearching,
  searchResults,
  searchQuery,
  onClearResults,
}) => {
  if (isSearching) {
    return (
      <div className="space-y-4 mt-6">
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!searchResults) return null;

  const { verses, surahs } = searchResults;
  const noResults = verses.length === 0 && surahs.length === 0;

  return (
    <div className="mt-6">
      {noResults ? (
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
              Verses ({verses.length})
            </TabsTrigger>
            <TabsTrigger value="surahs">
              Surahs ({surahs.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="verses" className="mt-4">
            <VerseResults verses={verses} />
          </TabsContent>
          
          <TabsContent value="surahs" className="mt-4">
            <SurahResults surahs={surahs} />
          </TabsContent>
        </Tabs>
      )}
      
      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          onClick={onClearResults}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear Results
        </Button>
      </div>
    </div>
  );
};

export default SearchResults;
