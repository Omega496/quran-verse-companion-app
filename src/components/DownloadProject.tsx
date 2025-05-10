
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DownloadProject = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      // In a real application, we would generate a zip file with all project files
      // For this demo, we'll just create a text file with project information
      
      const projectInfo = `
# Al Quran Companion App

A modern, responsive web application for reading, listening to, and studying the Quran.

## Features

- 📖 Complete Quran Text: All 114 surahs with Arabic text and translations
- 🔍 Advanced Search: Search through the Quran for specific verses or words
- 🔊 Audio Recitation: Listen to beautiful recitation of any verse
- 🔖 Bookmarks & Favorites: Save your favorite verses and surahs for quick access
- 📱 Responsive Design: Works on desktop, tablet, and mobile devices
- 🌙 Dark Mode: Easy on the eyes with light and dark theme options
- 🌐 Multi-language Support: Interface available in multiple languages

## Technologies Used

- React.js
- TypeScript
- Tailwind CSS
- Shadcn/UI Components
- React Router
- Tanstack Query

## Project Structure

src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── hooks/          # Custom React hooks
├── pages/          # Main application pages
├── services/       # API and data services
├── types/          # TypeScript type definitions
└── utils/          # Utility functions

## Installation Instructions

1. Clone the repository
2. Install dependencies with \`npm install\`
3. Start the development server with \`npm run dev\`
`;

      // Create a Blob from the text content
      const blob = new Blob([projectInfo], { type: 'text/plain' });
      
      // Create an object URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quran-companion-project.txt';
      
      // Trigger the download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download successful",
        description: "Project file has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to generate download file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isGenerating}
      className="w-full sm:w-auto"
      variant="outline"
    >
      <Download className="mr-2" />
      {isGenerating ? "Generating..." : "Download Project"}
    </Button>
  );
};

export default DownloadProject;
