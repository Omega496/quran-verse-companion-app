
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Verse } from "@/types";

interface VerseResultsProps {
  verses: Verse[];
}

const VerseResults: React.FC<VerseResultsProps> = ({ verses }) => {
  if (verses.length === 0) return null;
  
  return (
    <div className="space-y-4">
      {verses.map((verse) => (
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
    </div>
  );
};

export default VerseResults;
