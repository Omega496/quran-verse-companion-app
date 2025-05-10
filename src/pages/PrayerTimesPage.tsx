
import React, { useState, useEffect } from "react";
import { Clock, MapPin, Compass } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchPrayerTimes, calculateQiblaDirection } from "@/services/prayerTimesService";
import { PrayerTimes } from "@/types";
import { useToast } from "@/hooks/use-toast";

const PrayerTimesPage: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const { language, translations } = useLanguage();
  const { toast } = useToast();

  // Request user's location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          
          try {
            // Get location name
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
            );
            
            if (response.ok) {
              const data = await response.json();
              setLocationName(data.address.city || data.address.town || data.address.county || "");
            }
          } catch (error) {
            console.error("Error fetching location name:", error);
          }
          
          // Calculate qibla direction
          const qibla = calculateQiblaDirection(latitude, longitude);
          setQiblaDirection(qibla);
          
          setLocationError(null);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationError("Location permission denied. Please enable location access.");
          } else {
            setLocationError("Error getting location. Please try again.");
          }
          setIsLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoading(false);
    }
  }, []);
  
  // Fetch prayer times when location is available
  useEffect(() => {
    if (!location) return;
    
    const loadPrayerTimes = async () => {
      setIsLoading(true);
      
      try {
        const times = await fetchPrayerTimes(location.lat, location.lng);
        setPrayerTimes(times);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load prayer times. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPrayerTimes();
  }, [location]);
  
  // Format 24h time to 12h format
  const formatTimeToAmPm = (time: string): string => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${suffix}`;
  };
  
  // Find next prayer
  const getNextPrayer = (): { name: string; time: string } | null => {
    if (!prayerTimes) return null;
    
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHours * 60 + currentMinutes;
    
    const prayers = [
      { name: "Fajr", time: prayerTimes.fajr },
      { name: "Dhuhr", time: prayerTimes.dhuhr },
      { name: "Asr", time: prayerTimes.asr },
      { name: "Maghrib", time: prayerTimes.maghrib },
      { name: "Isha", time: prayerTimes.isha },
    ];
    
    // Convert each prayer time to minutes since midnight
    const prayerMinutes = prayers.map(prayer => {
      const [hours, minutes] = prayer.time.split(":");
      return {
        ...prayer,
        minutesSinceMidnight: parseInt(hours) * 60 + parseInt(minutes)
      };
    });
    
    // Find the next prayer
    const nextPrayer = prayerMinutes.find(
      prayer => prayer.minutesSinceMidnight > currentTime
    );
    
    // If no next prayer today, return first prayer for tomorrow
    return nextPrayer || prayerMinutes[0];
  };
  
  // Calculate time until next prayer
  const getTimeUntilNextPrayer = (): string => {
    const nextPrayer = getNextPrayer();
    if (!nextPrayer) return "";
    
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHours * 60 + currentMinutes;
    
    const [prayerHours, prayerMinutes] = nextPrayer.time.split(":");
    const prayerTime = parseInt(prayerHours) * 60 + parseInt(prayerMinutes);
    
    // Calculate time difference in minutes
    let diffMinutes = prayerTime - currentTime;
    if (diffMinutes < 0) {
      // Next prayer is tomorrow
      diffMinutes = (24 * 60) + diffMinutes;
    }
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };
  
  const nextPrayer = getNextPrayer();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {translations["prayerTimes.title"] || "Prayer Times"}
          </h1>
        </div>
        
        {locationError ? (
          <div className="text-center py-8">
            <p className="text-red-500">{locationError}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ) : prayerTimes ? (
          <>
            {/* Location and date */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <span>{locationName || "Current location"}</span>
              <span>•</span>
              <span>{prayerTimes.date}</span>
            </div>
            
            {/* Next prayer card */}
            {nextPrayer && (
              <Card className="mb-6 bg-primary text-primary-foreground">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {translations[`prayer.${nextPrayer.name.toLowerCase()}`] || nextPrayer.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-3xl font-bold">
                        {formatTimeToAmPm(nextPrayer.time)}
                      </p>
                      <p className="text-sm opacity-90 mt-1">
                        in {getTimeUntilNextPrayer()}
                      </p>
                    </div>
                    <Clock className="h-12 w-12 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* All prayer times */}
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 divide-x">
                    <div className="p-4">
                      <p className="text-muted-foreground text-sm">
                        {translations["prayer.fajr"] || "Fajr"}
                      </p>
                      <p className="text-lg font-medium mt-1">
                        {formatTimeToAmPm(prayerTimes.fajr)}
                      </p>
                    </div>
                    <div className="p-4">
                      <p className="text-muted-foreground text-sm">
                        {translations["prayer.sunrise"] || "Sunrise"}
                      </p>
                      <p className="text-lg font-medium mt-1">
                        {formatTimeToAmPm(prayerTimes.sunrise)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 divide-x">
                    <div className="p-4">
                      <p className="text-muted-foreground text-sm">
                        {translations["prayer.dhuhr"] || "Dhuhr"}
                      </p>
                      <p className="text-lg font-medium mt-1">
                        {formatTimeToAmPm(prayerTimes.dhuhr)}
                      </p>
                    </div>
                    <div className="p-4">
                      <p className="text-muted-foreground text-sm">
                        {translations["prayer.asr"] || "Asr"}
                      </p>
                      <p className="text-lg font-medium mt-1">
                        {formatTimeToAmPm(prayerTimes.asr)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 divide-x">
                    <div className="p-4">
                      <p className="text-muted-foreground text-sm">
                        {translations["prayer.maghrib"] || "Maghrib"}
                      </p>
                      <p className="text-lg font-medium mt-1">
                        {formatTimeToAmPm(prayerTimes.maghrib)}
                      </p>
                    </div>
                    <div className="p-4">
                      <p className="text-muted-foreground text-sm">
                        {translations["prayer.isha"] || "Isha"}
                      </p>
                      <p className="text-lg font-medium mt-1">
                        {formatTimeToAmPm(prayerTimes.isha)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Qibla direction */}
            {qiblaDirection !== null && (
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Compass className="h-5 w-5" />
                    {translations["qibla.title"] || "Qibla Direction"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center py-4">
                    <div
                      className="w-32 h-32 relative flex items-center justify-center"
                      style={{
                        background: "radial-gradient(circle, rgba(var(--primary), 0.1) 0%, rgba(var(--background), 0) 70%)"
                      }}
                    >
                      <div
                        className="absolute w-1 h-24 bg-primary origin-bottom"
                        style={{
                          transform: `rotate(${qiblaDirection}deg)`,
                          transformOrigin: 'bottom center'
                        }}
                      >
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary" />
                      </div>
                      <div className="w-4 h-4 rounded-full bg-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <p className="text-center text-muted-foreground text-sm mt-2">
                    {qiblaDirection.toFixed(1)}° from North
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default PrayerTimesPage;
