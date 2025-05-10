
import { PrayerTimes } from "@/types";

const ALADHAN_API_URL = "https://api.aladhan.com/v1";

export const fetchPrayerTimes = async (
  latitude: number,
  longitude: number,
  date: Date = new Date()
): Promise<PrayerTimes> => {
  try {
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    
    const response = await fetch(
      `${ALADHAN_API_URL}/timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}&method=2`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch prayer times");
    }
    
    const data = await response.json();
    const timings = data.data.timings;
    
    return {
      fajr: timings.Fajr,
      sunrise: timings.Sunrise,
      dhuhr: timings.Dhuhr,
      asr: timings.Asr,
      maghrib: timings.Maghrib,
      isha: timings.Isha,
      date: data.data.date.readable
    };
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    throw error;
  }
};

export const calculateQiblaDirection = (latitude: number, longitude: number): number => {
  // Coordinates of the Kaaba in Mecca
  const kaabaLat = 21.422487;
  const kaabaLng = 39.826206;
  
  // Convert to radians
  const lat1 = latitude * Math.PI / 180;
  const lat2 = kaabaLat * Math.PI / 180;
  const lngDiff = (kaabaLng - longitude) * Math.PI / 180;
  
  // Calculate the qibla direction
  const y = Math.sin(lngDiff);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(lngDiff);
  
  // Convert to degrees and normalize
  let qibla = Math.atan2(y, x) * 180 / Math.PI;
  qibla = (qibla + 360) % 360;
  
  return qibla;
};
