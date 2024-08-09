'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  src: string;
  title: string;
  initialVolume?: number;
}

export function AudioPlayer({
  src,
  title,
  initialVolume = 50,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        audio.currentTime = 0; // Reset audio to start
      };

      if (audio.readyState >= 1) {
        handleLoadedMetadata();
      }

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSeekChange = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = (value[0] / 100) * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const maxDuration = formatTime(duration);
  const currentFormattedTime = formatTime(currentTime);

  return (
    <div className='bg-background rounded-lg border p-4 max-w-md w-full'>
      <audio ref={audioRef} src={src} preload='metadata'></audio>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='icon'
            className='w-8 h-8'
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className='w-5 h-5' />
            ) : (
              <Play className='w-5 h-5' />
            )}
          </Button>
          <div className='text-lg font-medium'>{title}</div>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='icon'
            className='w-8 h-8'
            onClick={toggleMute}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className='w-5 h-5' />
            ) : (
              <Volume2 className='w-5 h-5' />
            )}
          </Button>
          <Slider
            defaultValue={[initialVolume]}
            min={0}
            max={100}
            step={1}
            aria-label='Volume'
            className='w-20'
            value={[isMuted ? 0 : volume]}
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Slider
          defaultValue={[0]}
          min={0}
          max={100}
          step={1}
          aria-label='Seek'
          className='flex-1'
          value={[(currentTime / duration) * 100]}
          onValueChange={handleSeekChange}
        />
        <div
          className='text-sm text-muted-foreground'
          style={{
            fontFamily: 'monospace',
            minWidth: `${maxDuration.length + 1}ch`,
          }}
        >
          {currentFormattedTime} / {maxDuration}
        </div>
      </div>
    </div>
  );
}
