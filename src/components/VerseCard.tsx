
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Bookmark, BookmarkPlus, MessageSquarePlus } from "lucide-react";
import { Verse } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface VerseCardProps {
  verse: Verse;
  surahId: number;
  isPlaying: boolean;
  isBookmarked?: boolean;
  isFavorite?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onToggleBookmark?: () => void;
  onToggleFavorite?: () => void;
  onAddNote?: () => void;
}

const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  surahId,
  isPlaying,
  isBookmarked = false,
  isFavorite = false,
  onPlay,
  onPause,
  onToggleBookmark,
  onToggleFavorite,
  onAddNote
}) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  
  return (
    <Card id={`verse-${verse.verse_number}`} className={`mb-4 ${isPlaying ? 'border-primary' : ''}`}>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
            <span className="text-sm font-medium">{verse.verse_number}</span>
          </div>
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={isPlaying ? onPause : onPlay}
              aria-label={isPlaying ? "Pause recitation" : "Play recitation"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className={`mt-4 ${isRTL ? 'text-right' : ''}`}>
          {/* Arabic text with larger font */}
          <p className="text-2xl mb-4 font-arabic leading-loose" dir="rtl">
            {verse.text}
          </p>
          
          {/* Translation */}
          <p className="text-muted-foreground">
            {verse.translation}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2 pt-0 pb-3">
        <Button
          size="icon"
          variant="ghost"
          onClick={onToggleBookmark}
          className={isBookmarked ? "text-yellow-500" : ""}
          aria-label="Bookmark verse"
        >
          <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onToggleFavorite}
          className={isFavorite ? "text-red-500" : ""}
          aria-label="Add to favorites"
        >
          <BookmarkPlus className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onAddNote}
          aria-label="Add note"
        >
          <MessageSquarePlus className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerseCard;
