"use client";

import React, { useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { Save, FolderOpen, RotateCcw, Plus, Home, UploadCloud } from 'lucide-react';

export default function Toolbar() {
  const { saveProject, loadProject, resetProject, addNode, nodes, setView, publishProject } = useStore();

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
    <div className="flex gap-2 p-2 bg-white/90 backdrop-blur shadow-lg rounded-lg border border-gray-200">
      
      <button 
        onClick={() => setView('home')} 
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
      >
        <Home size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button 
        onClick={handleAddNode} 
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
      >
        <Plus size={16} /> Add Scene
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button 
        onClick={saveProject} 
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
      >
        <Save size={16} /> Save
      </button>
      
      <button 
        onClick={loadProject} 
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
      >
        <FolderOpen size={16} /> Load
      </button>

      <button 
        onClick={resetProject} 
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-md transition-colors"
      >
        <RotateCcw size={16} /> Reset
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* ✨ 내보내기(게시) 버튼 */}
      <button 
        onClick={publishProject} 
        className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md transition-all animate-pulse hover:animate-none"
      >
        <UploadCloud size={16} /> TAPN으로 내보내기
      </button>

    </div>
  );
}
