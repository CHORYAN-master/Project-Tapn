"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { useStore } from '@/store/useStore';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
}

export default function PlayerModal({ isOpen, onClose, videoSrc }: PlayerModalProps) {
  const { nodes, playingNodeId, setPlayingNodeId } = useStore();
  const [showChoices, setShowChoices] = useState(false);

  const currentNode = nodes.find(n => n.id === playingNodeId);

  useEffect(() => {
    setShowChoices(false);
  }, [playingNodeId]);

  if (!isOpen || !currentNode) return null;

  const handleProgress = (state: any) => {
    if (state.played > 0.8 && !showChoices && currentNode.data.choices?.length > 0) {
      setShowChoices(true);
    }
  };

  const handleChoice = (targetNodeId: string) => {
    setPlayingNodeId(targetNodeId);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
      >
        <X size={32} />
      </button>

      <div className="w-full h-full">
        <VideoPlayer
          url={currentNode.data.videoUrl || videoSrc}
          playing={true}
          controls={true}
          onProgress={handleProgress}
        />
      </div>

      {showChoices && currentNode.data.choices && currentNode.data.choices.length > 0 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-4">
          {currentNode.data.choices.map((choice: any) => (
            <button
              key={choice.id}
              onClick={() => handleChoice(choice.targetNodeId)}
              className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all shadow-xl"
            >
              {choice.label}
            </button>
          ))}
        </div>
      )}

      {currentNode.data.question && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-lg backdrop-blur">
          {currentNode.data.question}
        </div>
      )}
    </div>
  );
}
