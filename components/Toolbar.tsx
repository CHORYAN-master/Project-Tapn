"use client";

import React, { useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { Save, Plus, UploadCloud, ArrowLeft, Edit2 } from 'lucide-react';

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
    <div className="flex gap-2 p-2 bg-white/90 backdrop-blur shadow-lg rounded-lg border border-gray-200 items-center">
      
      {/* 나가기 */}
      <button 
        onClick={() => setView('dashboard')} 
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
      >
        <ArrowLeft size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* ✨ 영상 제목 입력 필드 (가장 중요한 부분) */}
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-md border focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all flex-1 min-w-[200px]">
        <Edit2 size={14} className="text-gray-400" />
        <input 
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          placeholder="영상 제목을 입력하세요"
          className="bg-transparent border-none outline-none text-sm font-bold text-gray-800 w-full placeholder:text-gray-400"
        />
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* 씬 추가 */}
      <button 
        onClick={handleAddNode} 
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors whitespace-nowrap"
      >
        <Plus size={16} /> 씬 추가
      </button>

      {/* 저장 */}
      <button 
        onClick={saveDraft} 
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
      >
        <Save size={16} /> 저장
      </button>

      {/* 게시 */}
      <button 
        onClick={publishProject} 
        className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md transition-all animate-pulse hover:animate-none whitespace-nowrap"
      >
        <UploadCloud size={16} /> 게시
      </button>

    </div>
  );
}