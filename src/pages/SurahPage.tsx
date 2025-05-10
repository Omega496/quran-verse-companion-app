
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookmarkPlus, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VerseCard from "@/components/VerseCard";
import AudioPlayer from "@/components/AudioPlayer";
import MainLayout from "@/components/layout/MainLayout";
import { fetchSurahDetails } from "@/services/quranService";
import { useLanguage } from "@/contexts/LanguageContext";
import { Surah, Verse } from "@/types";
import { useToast } from "@/hooks/use-toast";

const SurahPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, translations } = useLanguage();
  const { toast } = useToast();
  
  const [surah, setSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>("");
  const [currentVerseId, setCurrentVerseId] = useState<number | null>(null);
  const [isFavoriteSurah, setIsFavoriteSurah] = useState(false);
  
  const verseRefs = useRef<Record<number, HTMLDivElement>>({});
  
  // Check if the current surah is in favorites
  useEffect(() => {
    if (!surah) return;
    
    const favoriteSurahsStr = localStorage.getItem("quran-app-favorite-surahs");
    const favoriteSurahs = favoriteSurahsStr ? JSON.parse(favoriteSurahsStr) : [];
    setIsFavoriteSurah(favoriteSurahs.includes(surah.id));
    
  }, [surah]);
  
  // Load surah details
  useEffect(() => {
    const loadSurahDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchSurahDetails(parseInt(id), language);
        setSurah(data.surah);
        setVerses(data.verses);
        
        // Add to recently read surahs
        const recentSurahsStr = localStorage.getItem("quran-app-recent-surahs");
        const recentSurahs = recentSurahsStr ? JSON.parse(recentSurahsStr) : [];
        
        // Remove if already in list and add to beginning
        const updatedRecentSurahs = [
          parseInt(id),
          ...recentSurahs.filter((surahId: number) => surahId !== parseInt(id))
        ].slice(0, 5); // Keep only the 5 most recent
        
        localStorage.setItem("quran-app-recent-surahs", JSON.stringify(updatedRecentSurahs));
      } catch (err) {
        setError("Failed to load surah details. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load surah details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSurahDetails();
  }, [id, language]);
  
  // Toggle favorite status for the surah
  const toggleFavoriteSurah = () => {
    if (!surah) return;
    
    const favoriteSurahsStr = localStorage.getItem("quran-app-favorite-surahs");
    const favoriteSurahs = favoriteSurahsStr ? JSON.parse(favoriteSurahsStr) : [];
    
    if (isFavoriteSurah) {
      const updatedFavorites = favoriteSurahs.filter((id: number) => id !== surah.id);
      localStorage.setItem("quran-app-favorite-surahs", JSON.stringify(updatedFavorites));
      setIsFavoriteSurah(false);
      toast({
        description: "Surah removed from favorites",
      });
    } else {
      const updatedFavorites = [...favoriteSurahs, surah.id];
      localStorage.setItem("quran-app-favorite-surahs", JSON.stringify(updatedFavorites));
      setIsFavoriteSurah(true);
      toast({
        description: "Surah added to favorites",
      });
    }
  };
  
  // Toggle favorite status for a verse
  const toggleFavoriteVerse = (verseId: number) => {
    if (!surah) return;
    
    const favoriteVersesStr = localStorage.getItem("quran-app-favorite-verses");
    const favoriteVerses = favoriteVersesStr ? JSON.parse(favoriteVersesStr) : [];
    
    const existingIndex = favoriteVerses.findIndex(
      (fav: any) => fav.surahId === surah.id && fav.verseId === verseId
    );
    
    if (existingIndex !== -1) {
      favoriteVerses.splice(existingIndex, 1);
      localStorage.setItem("quran-app-favorite-verses", JSON.stringify(favoriteVerses));
      toast({
        description: "Verse removed from favorites",
      });
    } else {
      favoriteVerses.push({
        id: Date.now(),
        surahId: surah.id,
        verseId: verseId,
        timestamp: Date.now()
      });
      localStorage.setItem("quran-app-favorite-verses", JSON.stringify(favoriteVerses));
      toast({
        description: "Verse added to favorites",
      });
    }
  };
  
  // Toggle bookmark for a verse
  const toggleBookmarkVerse = (verseId: number) => {
    if (!surah) return;
    
    const bookmarksStr = localStorage.getItem("quran-app-bookmarks");
    const bookmarks = bookmarksStr ? JSON.parse(bookmarksStr) : [];
    
    const existingIndex = bookmarks.findIndex(
      (bookmark: any) => bookmark.surahId === surah.id && bookmark.verseId === verseId
    );
    
    if (existingIndex !== -1) {
      bookmarks.splice(existingIndex, 1);
      localStorage.setItem("quran-app-bookmarks", JSON.stringify(bookmarks));
      toast({
        description: "Bookmark removed",
      });
    } else {
      bookmarks.push({
        id: Date.now(),
        surahId: surah.id,
        verseId: verseId,
        timestamp: Date.now()
      });
      localStorage.setItem("quran-app-bookmarks", JSON.stringify(bookmarks));
      toast({
        description: "Bookmark added",
      });
    }
  };
  
  // Add note to a verse
  const addNoteToVerse = (verseId: number) => {
    if (!surah) return;
    
    // In a real app, this would open a modal or navigate to a note editor
    // For now, we'll just show a toast
    toast({
      description: "Note taking feature coming soon!",
    });
  };
  
  // Check if a verse is favorited
  const isVerseFavorite = (verseId: number): boolean => {
    if (!surah) return false;
    
    const favoriteVersesStr = localStorage.getItem("quran-app-favorite-verses");
    const favoriteVerses = favoriteVersesStr ? JSON.parse(favoriteVersesStr) : [];
    
    return favoriteVerses.some(
      (fav: any) => fav.surahId === surah.id && fav.verseId === verseId
    );
  };
  
  // Check if a verse is bookmarked
  const isVerseBookmarked = (verseId: number): boolean => {
    if (!surah) return false;
    
    const bookmarksStr = localStorage.getItem("quran-app-bookmarks");
    const bookmarks = bookmarksStr ? JSON.parse(bookmarksStr) : [];
    
    return bookmarks.some(
      (bookmark: any) => bookmark.surahId === surah.id && bookmark.verseId === verseId
    );
  };
  
  // Play audio for a specific verse
  const playVerseAudio = (verse: Verse) => {
    setCurrentAudioUrl(verse.audio_url);
    setCurrentVerseId(verse.id);
    
    // Scroll to the verse
    if (verseRefs.current[verse.verse_number]) {
      verseRefs.current[verse.verse_number].scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };
  
  // Handle next verse
  const handleNextVerse = () => {
    if (!currentVerseId || !verses.length) return;
    
    const currentIndex = verses.findIndex(verse => verse.id === currentVerseId);
    if (currentIndex < verses.length - 1) {
      const nextVerse = verses[currentIndex + 1];
      playVerseAudio(nextVerse);
    }
  };
  
  // Handle previous verse
  const handlePreviousVerse = () => {
    if (!currentVerseId || !verses.length) return;
    
    const currentIndex = verses.findIndex(verse => verse.id === currentVerseId);
    if (currentIndex > 0) {
      const prevVerse = verses[currentIndex - 1];
      playVerseAudio(prevVerse);
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Surah header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          {!isLoading && surah && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavoriteSurah}
              className={isFavoriteSurah ? "text-yellow-500" : ""}
            >
              {isFavoriteSurah ? (
                <Bookmark className="h-5 w-5" fill="currentColor" />
              ) : (
                <BookmarkPlus className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : surah ? (
          <>
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold">
                {language === "ar" ? surah.name_arabic : surah.name}
              </h1>
              <p className="text-lg text-muted-foreground">{surah.name_translation}</p>
              
              <div className="flex items-center justify-center space-x-2">
                <Badge variant="outline">
                  {surah.revelation_place === "Mecca"
                    ? translations["revelationPlace.mecca"] || "Mecca"
                    : translations["revelationPlace.medina"] || "Medina"}
                </Badge>
                <Badge variant="outline">{surah.total_verses} verses</Badge>
              </div>
            </div>
            
            {/* Bismillah */}
            {surah.id !== 9 && (
              <div className="text-center my-8">
                <p className="text-2xl font-arabic" dir="rtl">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            )}
            
            {/* Verses */}
            <div className="space-y-4">
              {verses.map((verse) => (
                <div
                  key={verse.id}
                  ref={(el) => {
                    if (el) verseRefs.current[verse.verse_number] = el;
                  }}
                >
                  <VerseCard
                    verse={verse}
                    surahId={surah.id}
                    isPlaying={currentVerseId === verse.id}
                    isBookmarked={isVerseBookmarked(verse.id)}
                    isFavorite={isVerseFavorite(verse.id)}
                    onPlay={() => playVerseAudio(verse)}
                    onPause={() => setCurrentVerseId(null)}
                    onToggleBookmark={() => toggleBookmarkVerse(verse.id)}
                    onToggleFavorite={() => toggleFavoriteVerse(verse.id)}
                    onAddNote={() => addNoteToVerse(verse.id)}
                  />
                </div>
              ))}
            </div>
            
            {/* Audio player */}
            {currentAudioUrl && (
              <div className="sticky bottom-16 left-0 right-0">
                <AudioPlayer
                  audioUrl={currentAudioUrl}
                  onPlayStatusChange={(isPlaying) => {
                    if (!isPlaying) {
                      setCurrentVerseId(null);
                    }
                  }}
                  onEnded={handleNextVerse}
                  onNext={handleNextVerse}
                  onPrevious={handlePreviousVerse}
                />
              </div>
            )}
          </>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default SurahPage;
