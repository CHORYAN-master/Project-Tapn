"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Editor from '@/components/Editor';
import HomeView from '@/components/HomeView';
import PlayerModal from '@/components/PlayerModal';
import Dashboard from '@/components/Dashboard';
import GateView from '@/components/GateView';

export default function Home() {
  const { currentView, setView, lastView, isAuthenticated } = useStore();
  const [defaultVideoSrc] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isAuthenticated) {
    return <GateView />;
  }

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
