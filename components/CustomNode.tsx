"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Video, Disc, Play, X, Flag } from 'lucide-react';
import { useStore } from '@/store/useStore';

const CustomNode = ({ id, data, selected }: NodeProps) => {
  // ✨ setView 추가 (화면 전환 기능을 위해 필수)
  const { setPlayingNodeId, deleteNode, startNodeId, setView } = useStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('이 장면을 삭제하시겠습니까?')) {
      deleteNode(id);
    }
  };

  // ✨ 핵심 수정: 재생 버튼 클릭 핸들러
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // 노드 선택과 겹치지 않게 방지
    setPlayingNodeId(id); // 1. 어떤 영상을 틀지 정하고
    setView('player');    // 2. 화면을 '플레이어 모드'로 바꿈!
  };

  const isStartNode = startNodeId === id;

  return (
    <div className={`relative w-64 bg-white rounded-lg shadow-xl border-2 transition-all group/node ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'} ${isStartNode ? 'ring-2 ring-green-400 border-green-500' : ''}`}>
      
      {isStartNode && (
        <div className="absolute -top-3 -left-3 z-50 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
          <Flag size={10} fill="white" /> START
        </div>
      )}

      <button 
        onClick={handleDelete}
        className="absolute -top-3 -right-3 z-50 bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-300 rounded-full p-1.5 shadow-sm opacity-0 group-hover/node:opacity-100 transition-all scale-90 hover:scale-100"
      >
        <X size={14} strokeWidth={3} />
      </button>

      <div className="flex items-center gap-2 p-3 border-b bg-gray-50 rounded-t-lg">
        <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md"><Video size={16} /></div>
        <span className="font-bold text-sm text-gray-900 truncate">{data.label}</span>
      </div>

      <div className="p-3">
        {/* ✨ 여기가 수정된 재생 버튼 부분입니다 */}
        <div 
          onClick={handlePlay} 
          className="h-24 bg-gray-100 rounded-md flex flex-col items-center justify-center text-gray-700 mb-3 relative overflow-hidden group cursor-pointer hover:bg-gray-200 transition-colors border border-gray-200"
        >
          {data.videoUrl ? (
            <video src={data.videoUrl} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
          ) : null}

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Play fill="black" size={32} className="text-black drop-shadow-lg" />
          </div>
          <Disc size={24} className="mb-2 opacity-50 group-hover:scale-110 transition-transform z-0" />
          <span className="text-xs font-bold z-0">{data.videoUrl ? "Preview" : "Upload"}</span>
        </div>
        
        <div className="text-sm text-gray-900 font-bold px-1 truncate">
          Q: {data.question || "질문을 입력하세요"}
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400 !border-2 !border-white hover:bg-blue-500 transition-colors" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500 !border-2 !border-white hover:scale-125 transition-transform" />
    </div>
  );
};
export default memo(CustomNode);