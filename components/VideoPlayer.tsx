"use client";

import React from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
  onProgress?: (state: any) => void;
  onEnded?: () => void;
  playing?: boolean;
  controls?: boolean;
}

const Player = ReactPlayer as any;

export default function VideoPlayer({ url, onProgress, onEnded, playing = false, controls = true }: VideoPlayerProps) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Player
        url={url}
        playing={playing}
        controls={controls}
        onProgress={onProgress}
        onEnded={onEnded}
        width="100%"
        height="100%"
      />
    </div>
  );
}
