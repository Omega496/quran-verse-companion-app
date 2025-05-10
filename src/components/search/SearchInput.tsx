
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  searchQuery: string;
  isSearching: boolean;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  isSearching,
  onSearchQueryChange,
  onSearch,
  onKeyDown,
}) => {
  return (
    <div className="flex space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder="Search surah or verse"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </div>
      <Button onClick={onSearch} disabled={isSearching}>
        {isSearching ? "Searching..." : "Search"}
      </Button>
    </div>
  );
};

export default SearchInput;
