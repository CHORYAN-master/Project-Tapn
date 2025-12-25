"use client";

import React, { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
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
        className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-gray-300 transition-colors z-50 bg-black/50 hover:bg-black/70 p-2 rounded-full backdrop-blur-sm"
      >
        <X size={24} className="md:w-8 md:h-8" />
      </button>

      <div className="w-full h-full">
        <VideoPlayer
          url={currentNode.data.videoUrl || videoSrc}
          playing={true}
          controls={true}
          onProgress={handleProgress}
        />
      </div>

      {/* 질문 + 선택지 함께 표시 */}
      {showChoices && currentNode.data.choices && currentNode.data.choices.length > 0 && (
        <div className="absolute bottom-8 md:bottom-16 left-1/2 -translate-x-1/2 w-[90%] md:w-auto max-w-3xl">
          
          {/* 질문 박스 */}
          {currentNode.data.question && (
            <div className="mb-4 bg-gradient-to-r from-blue-600/95 to-purple-600/95 backdrop-blur-xl text-white px-5 py-4 md:px-6 md:py-5 rounded-2xl shadow-2xl border-2 border-white/20 animate-in slide-in-from-bottom-4">
              <div className="flex items-start gap-3">
                <MessageCircle size={20} className="md:w-6 md:h-6 text-white/90 flex-shrink-0 mt-0.5" />
                <p className="text-sm md:text-lg font-bold leading-relaxed text-white">
                  {currentNode.data.question}
                </p>
              </div>
            </div>
          )}

          {/* 선택지 */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
            {currentNode.data.choices.map((choice: any, index: number) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice.targetNodeId)}
                className="group relative px-6 py-4 md:px-8 md:py-5 bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-100 text-black font-bold rounded-2xl transition-all shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-95 border-2 border-gray-200 hover:border-blue-400 animate-in slide-in-from-bottom-5"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg md:text-xl font-black text-blue-600 group-hover:text-purple-600 transition-colors">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-sm md:text-base">{choice.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
