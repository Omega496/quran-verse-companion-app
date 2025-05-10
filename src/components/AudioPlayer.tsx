
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AudioPlayerProps {
  audioUrl: string;
  onPlayStatusChange?: (isPlaying: boolean) => void;
  onEnded?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  onPlayStatusChange,
  onEnded,
  onNext,
  onPrevious
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isRepeat, setIsRepeat] = useState(false);
  const { translations } = useLanguage();

  // Update audio source when URL changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
      onPlayStatusChange?.(false);
    }
  }, [audioUrl]);

  // Handle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  // Handle timeupdate event
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle seeking
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  // Handle repeat toggle
  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
    if (audioRef.current) {
      audioRef.current.loop = !isRepeat;
    }
  };

  // Handle audio end
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    onPlayStatusChange?.(false);
    if (!isRepeat) {
      onEnded?.();
    }
  };

  // Format time (mm:ss)
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="bg-background border-t p-3 rounded-t-lg">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onPlay={() => {
          setIsPlaying(true);
          onPlayStatusChange?.(true);
        }}
        onPause={() => {
          setIsPlaying(false);
          onPlayStatusChange?.(false);
        }}
        onEnded={handleEnded}
      />

      {/* Time and progress */}
      <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="mx-2 flex-1"
        />
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleRepeat}
          className={`${isRepeat ? "text-primary" : ""}`}
          aria-label={translations["audio.repeat"] || "Repeat"}
        >
          <Repeat className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={onPrevious}
            disabled={!onPrevious}
            aria-label={translations["audio.previous"] || "Previous Verse"}
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            variant="default"
            className="h-10 w-10 rounded-full"
            onClick={togglePlayPause}
            aria-label={isPlaying ? (translations["audio.pause"] || "Pause") : (translations["audio.play"] || "Play")}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={onNext}
            disabled={!onNext}
            aria-label={translations["audio.next"] || "Next Verse"}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-24">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
