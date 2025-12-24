"use client";

import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Play, Plus, Film } from 'lucide-react';

export default function HomeView() {
  const { setView, loadProject, nodes, startNodeId, setPlayingNodeId } = useStore();

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handlePlayProject = () => {
    const targetId = startNodeId || nodes[0]?.id;
    if (targetId) {
      setPlayingNodeId(targetId);
      setView('player');
    }
  };

  const mainNode = nodes.find(n => n.id === startNodeId) || nodes[0];
  const thumbnailSrc = mainNode?.data?.videoUrl;
  const projectTitle = mainNode?.data?.label || "나의 첫 번째 인터랙티브 무비";

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-[#0f0f0f]/95 backdrop-blur z-50 border-b border-gray-800">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tighter text-white flex items-center gap-1">
            <span className="text-blue-500">▶</span> TAPN
          </h1>
          <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase ml-1">make your interactive</span>
        </div>

        <button 
          onClick={() => setView('editor')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/20"
        >
          <Plus size={18} />
          TAPN 만들기
        </button>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Film size={20} className="text-red-500" />
          최신 업로드
        </h2>

        {nodes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div onClick={handlePlayProject} className="group cursor-pointer">
              <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden mb-3 border border-gray-800 group-hover:border-gray-600 transition-all">
                {thumbnailSrc ? (
                  <video src={thumbnailSrc} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                    <Play size={48} className="mb-2 opacity-50" />
                    <span className="text-xs">No Thumbnail</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
                  <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm scale-75 group-hover:scale-100 transition-all duration-300">
                    <Play size={20} fill="white" />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-sm text-gray-100 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                    {projectTitle}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">TAPN Creator • 조회수 1회</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/50">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <Film size={40} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">아직 영상이 없습니다</h3>
            <p className="text-gray-400 mb-8">TAPN 만들기에서 영상을 제작해보세요</p>
            <button 
              onClick={() => setView('editor')}
              className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-xl"
            >
              지금 제작하러 가기
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
