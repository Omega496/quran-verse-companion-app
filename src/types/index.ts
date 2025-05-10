export type Language = "ar" | "en" | "bn" | "hi";

export interface Verse {
  id: number;
  verse_number: number;
  text: string;
  translation: string;
  audio_url: string;
  surahId?: number;
  surahName?: string;
}

export interface Surah {
  id: number;
  name: string;
  name_arabic: string;
  name_translation: string;
  revelation_place: "Mecca" | "Medina";
  total_verses: number;
  description?: string;
}

export interface Prayer {
  name: string;
  time: string;
}

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
}

export interface FavoriteSurah {
  id: number;
  surahId: number;
  timestamp: number;
}

export interface FavoriteVerse {
  id: number;
  surahId: number;
  verseId: number;
  timestamp: number;
}

export interface Bookmark {
  id: number;
  surahId: number;
  verseId: number;
  timestamp: number;
  notes?: string;
}

export interface AppSettings {
  language: Language;
  theme: "light" | "dark" | "system";
  fontSize: number;
  reciter: string;
  showTranslation: boolean;
  showTransliteration: boolean;
  audioQuality: "high" | "medium" | "low";
}
