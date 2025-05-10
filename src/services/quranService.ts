
import { Surah, Verse } from "@/types";

// This is a mock service that would be replaced with actual API calls
// We'll simulate fetching data from an API for now

const API_BASE_URL = "https://api.alquran.cloud/v1";
const AUDIO_BASE_URL = "https://verses.quran.com/";

export const fetchSurahs = async (language: string = "en"): Promise<Surah[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/surah`);
    if (!response.ok) {
      throw new Error("Failed to fetch surahs");
    }
    const data = await response.json();
    return data.data.map((surah: any) => ({
      id: surah.number,
      name: surah.englishName,
      name_arabic: surah.name,
      name_translation: surah.englishNameTranslation,
      revelation_place: surah.revelationType === "Meccan" ? "Mecca" : "Medina",
      total_verses: surah.numberOfAyahs
    }));
  } catch (error) {
    console.error("Error fetching surahs:", error);
    throw error;
  }
};

export const fetchSurahDetails = async (
  surahId: number,
  language: string = "en"
): Promise<{ surah: Surah; verses: Verse[] }> => {
  try {
    // Fetch surah information
    const surahResponse = await fetch(`${API_BASE_URL}/surah/${surahId}`);
    if (!surahResponse.ok) {
      throw new Error("Failed to fetch surah details");
    }
    const surahData = await surahResponse.json();
    
    // Fetch verses in Arabic
    const versesArabicResponse = await fetch(`${API_BASE_URL}/surah/${surahId}/ar.alafasy`);
    if (!versesArabicResponse.ok) {
      throw new Error("Failed to fetch surah verses in Arabic");
    }
    const versesArabicData = await versesArabicResponse.json();
    
    // Fetch verses translation
    const versesTranslationResponse = await fetch(`${API_BASE_URL}/surah/${surahId}/en.asad`);
    if (!versesTranslationResponse.ok) {
      throw new Error("Failed to fetch surah verses translation");
    }
    const versesTranslationData = await versesTranslationResponse.json();
    
    const surah: Surah = {
      id: surahData.data.number,
      name: surahData.data.englishName,
      name_arabic: surahData.data.name,
      name_translation: surahData.data.englishNameTranslation,
      revelation_place: surahData.data.revelationType === "Meccan" ? "Mecca" : "Medina",
      total_verses: surahData.data.numberOfAyahs
    };
    
    const verses: Verse[] = versesArabicData.data.ayahs.map((ayah: any, index: number) => ({
      id: ayah.number,
      verse_number: ayah.numberInSurah,
      text: ayah.text,
      translation: versesTranslationData.data.ayahs[index]?.text || "",
      audio_url: `${AUDIO_BASE_URL}AbdulBaset/Mujawwad/mp3/${ayah.number}.mp3`
    }));
    
    return { surah, verses };
  } catch (error) {
    console.error("Error fetching surah details:", error);
    throw error;
  }
};

export const searchQuran = async (
  query: string,
  language: string = "en"
): Promise<{ verses: Verse[]; surahs: Surah[] }> => {
  try {
    // Search in verses
    const versesResponse = await fetch(`${API_BASE_URL}/search/${query}/all/en`);
    if (!versesResponse.ok) {
      throw new Error("Failed to search verses");
    }
    const versesData = await versesResponse.json();
    
    const verses: Verse[] = versesData.data.matches.map((match: any) => ({
      id: match.number,
      verse_number: match.numberInSurah,
      text: match.text, // This would be the Arabic text, but this API returns the matched text
      translation: match.text,
      audio_url: `${AUDIO_BASE_URL}AbdulBaset/Mujawwad/mp3/${match.number}.mp3`,
      surahId: match.surah.number,
      surahName: match.surah.englishName
    }));
    
    // Get unique surahs from the search results
    const surahIds = [...new Set(verses.map(v => v.surahId))];
    const surahs: Surah[] = await Promise.all(
      surahIds.map(async (id) => {
        const surahResponse = await fetch(`${API_BASE_URL}/surah/${id}`);
        if (!surahResponse.ok) {
          throw new Error(`Failed to fetch surah ${id}`);
        }
        const surahData = await surahResponse.json();
        return {
          id: surahData.data.number,
          name: surahData.data.englishName,
          name_arabic: surahData.data.name,
          name_translation: surahData.data.englishNameTranslation,
          revelation_place: surahData.data.revelationType === "Meccan" ? "Mecca" : "Medina",
          total_verses: surahData.data.numberOfAyahs
        };
      })
    );
    
    return { verses, surahs };
  } catch (error) {
    console.error("Error searching Quran:", error);
    throw error;
  }
};
