
"use client";

import React, { useState, useEffect, useRef } from 'react';

interface PlayerWrapperProps {
  videoId: string;
  startTime?: number;
  onTimeUpdate?: (time: number) => void;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

const PlayerWrapper: React.FC<PlayerWrapperProps> = ({ 
  videoId,
  startTime = 0,
  onTimeUpdate 
}) => {
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Add YouTube API script to the page if it's not already there
  useEffect(() => {
    // Only execute this code client-side
    if (typeof window !== 'undefined') {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        
        window.onYouTubeIframeAPIReady = () => {
          setIsReady(true);
        };
      } else {
        setIsReady(true);
      }
    }
  }, []);
  
  // Initialize the player
  useEffect(() => {
    if (isReady && containerRef.current && typeof window.YT !== 'undefined') {
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          start: Math.floor(startTime),
        },
        events: {
          onStateChange: handleStateChange,
        },
      });
    }
    
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [isReady, videoId, startTime]);
  
  // Handle player state changes
  const handleStateChange = (event: any) => {
    // Update parent with current time for tracking
    if (event.data === window.YT?.PlayerState?.PLAYING && onTimeUpdate) {
      const interval = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          onTimeUpdate(playerRef.current.getCurrentTime());
        }
      }, 5000); // Update every 5 seconds
      
      return () => clearInterval(interval);
    }
  };
  
  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
      <div ref={containerRef} className="w-full h-full"></div>
    </div>
  );
};

export default PlayerWrapper;
