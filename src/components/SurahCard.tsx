
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import { Surah } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface SurahCardProps {
  surah: Surah;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const SurahCard: React.FC<SurahCardProps> = ({
  surah,
  isFavorite = false,
  onToggleFavorite
}) => {
  const { language, translations } = useLanguage();
  const isRTL = language === "ar";
  
  return (
    <Link to={`/surah/${surah.id}`}>
      <Card className={`hover:bg-accent transition-colors ${isRTL ? 'text-right' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {surah.id}
              </div>
              {isFavorite && (
                <Bookmark
                  className="h-4 w-4 text-yellow-500 cursor-pointer"
                  fill="currentColor"
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleFavorite?.();
                  }}
                />
              )}
            </div>
            <Badge variant="outline">
              {surah.revelation_place === "Mecca" 
                ? translations["revelationPlace.mecca"] || "Mecca"
                : translations["revelationPlace.medina"] || "Medina"}
            </Badge>
          </div>
          <CardTitle className={`text-lg ${isRTL ? 'mt-2' : ''}`}>
            {language === "ar" ? surah.name_arabic : surah.name}
          </CardTitle>
          <CardDescription>
            {language !== "ar" && surah.name_arabic}
            {language !== "ar" && " - "}
            {surah.name_translation}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground">
            {surah.total_verses} verses
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SurahCard;
