"use client";

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import Editor from '@/components/Editor';
import HomeView from '@/components/HomeView';
import PlayerModal from '@/components/PlayerModal';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const { currentView, setView, lastView } = useStore();
  const [defaultVideoSrc] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

  // ✨ 플레이어 닫으면 '아까 보던 화면(lastView)'으로 복귀
  const handleClosePlayer = () => {
    setView(lastView); 
  };

  return (
    <main className="w-screen h-screen overflow-hidden">
      {currentView === 'home' && <HomeView />}
      
      {currentView === 'dashboard' && <Dashboard />}
      
      {currentView === 'editor' && <Editor />}

      {currentView === 'player' && (
        <PlayerModal 
          isOpen={true} 
          onClose={handleClosePlayer}
          videoSrc={defaultVideoSrc}
        />
      )}
    </main>
  );
}