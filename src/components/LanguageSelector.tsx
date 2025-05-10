
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/types";

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, translations } = useLanguage();
  
  const languages = [
    { code: "ar", name: translations["language.ar"] || "العربية" },
    { code: "en", name: translations["language.en"] || "English" },
    { code: "bn", name: translations["language.bn"] || "বাংলা" },
    { code: "hi", name: translations["language.hi"] || "हिन्दी" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {languages.find(l => l.code === language)?.name || "Language"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as Language)}
            className={language === lang.code ? "bg-accent" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
