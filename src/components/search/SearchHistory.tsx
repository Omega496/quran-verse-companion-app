
import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchHistoryProps {
  searchHistory: string[];
  onClearHistory: () => void;
  onSelectHistoryItem: (query: string) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  searchHistory,
  onClearHistory,
  onSelectHistoryItem,
}) => {
  if (searchHistory.length === 0) return null;
  
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Recent Searches</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
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
            onClick={() => onSelectHistoryItem(query)}
          >
            <Search className="h-3 w-3" />
            {query}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
