"use client";

import React, { useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { Save, Plus, UploadCloud, ArrowLeft, Edit2, Menu } from 'lucide-react';

export default function Toolbar() {
  const { saveDraft, addNode, nodes, setView, publishProject, projectTitle, setProjectTitle } = useStore();

  const handleAddNode = useCallback(() => {
    const id = Math.random().toString(36).substr(2, 9);
    addNode({
      id, 
      type: 'videoNode', 
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { 
        label: `Scene ${nodes.length + 1}`, 
        videoUrl: '', 
        question: '질문을 입력하세요', 
        choices: [], 
      },
    });
  }, [addNode, nodes.length]);

  return (
    <div className="flex flex-col md:flex-row gap-2 p-2 md:p-2 bg-white/90 backdrop-blur shadow-lg rounded-lg border border-gray-200">
      
      {/* Mobile: Top Row (Back + Title) */}
      <div className="flex md:hidden items-center gap-2 w-full">
        <button 
          onClick={() => setView('dashboard')} 
          className="flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors shrink-0"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md border focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all flex-1">
          <Edit2 size={14} className="text-gray-400 shrink-0" />
          <input 
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="영상 제목"
            className="bg-transparent border-none outline-none text-sm font-bold text-gray-800 w-full placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Desktop: Left Section */}
      <div className="hidden md:flex items-center gap-2">
        <button 
          onClick={() => setView('dashboard')} 
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-md border focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all min-w-[200px]">
          <Edit2 size={14} className="text-gray-400" />
          <input 
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="영상 제목을 입력하세요"
            className="bg-transparent border-none outline-none text-sm font-bold text-gray-800 w-full placeholder:text-gray-400"
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />
      </div>

      {/* Mobile & Desktop: Action Buttons */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        
        {/* Add Scene */}
        <button 
          onClick={handleAddNode} 
          className="flex items-center justify-center md:justify-start gap-1.5 px-3 md:px-3 py-2 md:py-1.5 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors flex-1 md:flex-initial"
        >
          <Plus size={16} /> 
          <span className="hidden sm:inline">씬 추가</span>
        </button>

        {/* Save */}
        <button 
          onClick={saveDraft} 
          className="flex items-center justify-center md:justify-start gap-1.5 px-3 md:px-3 py-2 md:py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex-1 md:flex-initial"
        >
          <Save size={16} /> 
          <span className="hidden sm:inline">저장</span>
        </button>

        {/* Publish */}
        <button 
          onClick={publishProject} 
          className="flex items-center justify-center md:justify-start gap-1.5 px-4 py-2 md:py-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md transition-all active:scale-95 flex-1 md:flex-initial"
        >
          <UploadCloud size={16} /> 
          <span className="hidden sm:inline">게시</span>
        </button>
      </div>
    </div>
  );
}
