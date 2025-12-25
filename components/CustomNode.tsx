"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Video, Disc, Play, X, Flag } from 'lucide-react';
import { useStore } from '@/store/useStore';

const CustomNode = ({ id, data, selected }: NodeProps) => {
  const { setPlayingNodeId, deleteNode, startNodeId, setView } = useStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('이 장면을 삭제하시겠습니까?')) {
      deleteNode(id);
    }
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingNodeId(id);
    setView('player');
  };

  const isStartNode = startNodeId === id;

  return (
    <div className={`relative w-56 md:w-64 bg-white rounded-lg shadow-xl border-2 transition-all group/node ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'} ${isStartNode ? 'ring-2 ring-green-400 border-green-500' : ''}`}>
      
      {isStartNode && (
        <div className="absolute -top-2 md:-top-3 -left-2 md:-left-3 z-50 bg-green-500 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full shadow-md flex items-center gap-1">
          <Flag size={8} className="md:w-[10px] md:h-[10px]" fill="white" /> START
        </div>
      )}

      <button 
        onClick={handleDelete}
        className="absolute -top-2 md:-top-3 -right-2 md:-right-3 z-50 bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-300 rounded-full p-1 md:p-1.5 shadow-sm opacity-0 group-hover/node:opacity-100 transition-all scale-90 hover:scale-100 active:scale-75"
        aria-label="삭제"
      >
        <X size={12} className="md:w-[14px] md:h-[14px]" strokeWidth={3} />
      </button>

      <div className="flex items-center gap-2 p-2.5 md:p-3 border-b bg-gray-50 rounded-t-lg">
        <div className="p-1 md:p-1.5 bg-blue-100 text-blue-600 rounded-md">
          <Video size={14} className="md:w-4 md:h-4" />
        </div>
        <span className="font-bold text-xs md:text-sm text-gray-900 truncate">{data.label}</span>
      </div>

      <div className="p-2.5 md:p-3">
        <div 
          onClick={handlePlay} 
          className="h-20 md:h-24 bg-gray-100 rounded-md flex flex-col items-center justify-center text-gray-700 mb-2.5 md:mb-3 relative overflow-hidden group cursor-pointer hover:bg-gray-200 active:bg-gray-300 transition-colors border border-gray-200"
        >
          {data.videoUrl ? (
            <video 
              src={data.videoUrl} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" 
            />
          ) : null}

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Play fill="black" size={28} className="md:w-8 md:h-8 text-black drop-shadow-lg" />
          </div>
          <Disc size={20} className="md:w-6 md:h-6 mb-1.5 md:mb-2 opacity-50 group-hover:scale-110 transition-transform z-0" />
          <span className="text-[10px] md:text-xs font-bold z-0">{data.videoUrl ? "Preview" : "Upload"}</span>
        </div>
        
        <div className="text-xs md:text-sm text-gray-900 font-bold px-1 truncate">
          Q: {data.question || "질문을 입력하세요"}
        </div>
      </div>

      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-2.5 h-2.5 md:w-3 md:h-3 bg-gray-400 !border-2 !border-white hover:bg-blue-500 transition-colors" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-2.5 h-2.5 md:w-3 md:h-3 bg-blue-500 !border-2 !border-white hover:scale-125 active:scale-150 transition-transform" 
      />
    </div>
  );
};
export default memo(CustomNode);
