"use client";

import React, { useEffect, useState } from 'react';

interface VideoPlayerProps {
  url: string;
  onProgress?: (state: any) => void;
  onEnded?: () => void;
  playing?: boolean;
  controls?: boolean;
}

export default function VideoPlayer({ url, onProgress, onEnded, playing, controls }: VideoPlayerProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !url) return <div className="w-full h-full bg-black" />;

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYoutubeId(url);

  if (youtubeId) {
    return (
      <div className="w-full h-full bg-black relative">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${playing ? 1 : 0}&controls=${controls ? 1 : 0}&enablejsapi=1`}
          className="w-full h-full absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <video
        src={url}
        className="w-full h-full object-contain"
        controls={controls}
        autoPlay={playing}
        onEnded={onEnded}
        onTimeUpdate={(e) => {
          if (onProgress) {
            const video = e.target as HTMLVideoElement;
            onProgress({
              played: video.currentTime / video.duration,
              playedSeconds: video.currentTime,
              loaded: 0,
              loadedSeconds: 0
            });
          }
        }}
      />
    </div>
  );
}