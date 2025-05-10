
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Language, AppSettings } from "@/types";
import { useToast } from "@/hooks/use-toast";

const SettingsPage: React.FC = () => {
  const { language, setLanguage, translations } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Load settings from localStorage or use defaults
    const savedSettings = localStorage.getItem("quran-app-settings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          language: language,
          theme: theme,
          fontSize: 16,
          reciter: "AbdulBaset",
          showTranslation: true,
          showTransliteration: false,
          audioQuality: "medium"
        };
  });
  
  // Update language when it changes
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    updateSettings("language", newLanguage);
  };
  
  // Update theme when it changes
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    updateSettings("theme", newTheme);
  };
  
  // Update a setting
  const updateSettings = (key: keyof AppSettings, value: any) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings, [key]: value };
      localStorage.setItem("quran-app-settings", JSON.stringify(newSettings));
      return newSettings;
    });
  };
  
  // Clear all app data
  const clearAppData = () => {
    const keysToPreserve = ["quran-app-language", "quran-app-theme"];
    
    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    
    // Remove all quran-app-* keys except language and theme
    keys.forEach(key => {
      if (key.startsWith("quran-app-") && !keysToPreserve.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    toast({
      description: "All app data has been cleared",
    });
  };
  
  // Get app version (would be dynamic in a real app)
  const getAppVersion = () => {
    return "1.0.0";
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {translations["settings.title"] || "Settings"}
          </h1>
        </div>
        
        <Tabs defaultValue="display" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          {/* Display Settings */}
          <TabsContent value="display" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{translations["settings.language"] || "Language"}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={language}
                  onValueChange={(value) => handleLanguageChange(value as Language)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ar" id="arabic" />
                    <Label htmlFor="arabic">العربية</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="en" id="english" />
                    <Label htmlFor="english">English</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bn" id="bengali" />
                    <Label htmlFor="bengali">বাংলা</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hi" id="hindi" />
                    <Label htmlFor="hindi">हिन्दी</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{translations["settings.theme"] || "Theme"}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={theme}
                  onValueChange={(value) => handleThemeChange(value as "light" | "dark" | "system")}
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">{translations["theme.light"] || "Light"}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark">{translations["theme.dark"] || "Dark"}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system">{translations["theme.system"] || "System"}</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{translations["settings.fontSize"] || "Font Size"}</CardTitle>
                <CardDescription>Adjust the font size for reading</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">A</span>
                    <Slider
                      value={[settings.fontSize]}
                      min={12}
                      max={24}
                      step={1}
                      onValueChange={([value]) => updateSettings("fontSize", value)}
                      className="w-[80%] mx-4"
                    />
                    <span className="text-lg font-bold">A</span>
                  </div>
                  <p className="text-muted-foreground text-center">
                    Current size: {settings.fontSize}px
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Display Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-translation">
                    {translations["settings.showTranslation"] || "Show Translation"}
                  </Label>
                  <Switch
                    id="show-translation"
                    checked={settings.showTranslation}
                    onCheckedChange={(checked) => updateSettings("showTranslation", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-transliteration">
                    {translations["settings.showTransliteration"] || "Show Transliteration"}
                  </Label>
                  <Switch
                    id="show-transliteration"
                    checked={settings.showTransliteration}
                    onCheckedChange={(checked) => updateSettings("showTransliteration", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Audio Settings */}
          <TabsContent value="audio" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{translations["settings.reciter"] || "Reciter"}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={settings.reciter}
                  onValueChange={(value) => updateSettings("reciter", value)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="AbdulBaset" id="abdulbaset" />
                    <Label htmlFor="abdulbaset">Abdul Basit Abdul Samad</Label>
                    <Badge variant="outline" className="ml-auto">Default</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Alafasy" id="alafasy" />
                    <Label htmlFor="alafasy">Mishary Rashid Alafasy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Minshawi" id="minshawi" />
                    <Label htmlFor="minshawi">Mohamed Siddiq Al-Minshawi</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Husary" id="husary" />
                    <Label htmlFor="husary">Mahmoud Khalil Al-Husary</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{translations["settings.audioQuality"] || "Audio Quality"}</CardTitle>
                <CardDescription>Higher quality uses more data</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={settings.audioQuality}
                  onValueChange={(value) => updateSettings("audioQuality", value)}
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* About */}
          <TabsContent value="about" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>About This App</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Version:</strong> {getAppVersion()}
                </p>
                <p>
                  <strong>API Source:</strong>{" "}
                  <a
                    href="https://alquran.cloud/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    AlQuran Cloud API
                  </a>
                </p>
                <p>
                  <strong>Prayer Times API:</strong>{" "}
                  <a
                    href="https://aladhan.com/prayer-times-api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Aladhan API
                  </a>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>App Data</CardTitle>
                <CardDescription>
                  Clear all your data including favorites, bookmarks, and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={clearAppData}
                >
                  Clear All Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
