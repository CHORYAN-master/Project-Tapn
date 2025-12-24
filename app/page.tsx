"use client";

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import Editor from '@/components/Editor';
import HomeView from '@/components/HomeView';
import PlayerModal from '@/components/PlayerModal';

export default function Home() {
  const { currentView, setView } = useStore();
  const [videoSrc] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

  return (
    <main className="w-screen h-screen overflow-hidden">
      {currentView === 'home' && <HomeView />}
      
      {currentView === 'editor' && <Editor />}

      {currentView === 'player' && (
        <PlayerModal 
          isOpen={true} 
          onClose={() => setView('home')}
          videoSrc={videoSrc}
        />
      )}
    </main>
  );
}
