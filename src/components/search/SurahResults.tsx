
import React from "react";
import SurahCard from "@/components/SurahCard";
import { Surah } from "@/types";

interface SurahResultsProps {
  surahs: Surah[];
}

const SurahResults: React.FC<SurahResultsProps> = ({ surahs }) => {
  if (surahs.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {surahs.map((surah) => (
        <SurahCard key={surah.id} surah={surah} />
      ))}
    </div>
  );
};

export default SurahResults;
