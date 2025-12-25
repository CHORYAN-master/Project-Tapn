"use client";

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Plus, Edit3, Trash2, Film, Home } from 'lucide-react';

export default function Dashboard() {
  const { setView, createProject, loadDraftProjects, openProject, deleteDraft } = useStore();
  const [drafts, setDrafts] = useState<any[]>([]);

  useEffect(() => {
    setDrafts(loadDraftProjects());
  }, [loadDraftProjects]);

  const handleCreate = () => {
    createProject();
    setView('editor');
  };

  const handleEdit = (project: any) => {
    openProject(project);
    setView('editor');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteDraft(id);
    setDrafts(loadDraftProjects()); 
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
      <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        
        {/* 홈 화면으로 나가기 - 왼쪽으로 이동 */}
        <button 
          onClick={() => setView('home')} 
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 rounded-xl font-bold transition-all border border-gray-700 hover:border-gray-500 shadow-lg"
        >
          <Home size={20} /> 
          홈 화면으로 나가기
        </button>

        {/* Creative Studio - 오른쪽으로 이동 */}
        <div className="text-right">
          <h1 className="text-3xl font-black mb-1">Creative Studio</h1>
          <p className="text-gray-400 text-sm">내 프로젝트 보관함</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <button 
          onClick={handleCreate}
          className="aspect-video rounded-xl border-2 border-dashed border-gray-700 hover:border-blue-500 bg-gray-900/50 hover:bg-gray-800 flex flex-col items-center justify-center gap-4 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-gray-800 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
            <Plus size={32} className="text-gray-400 group-hover:text-white" />
          </div>
          <span className="font-bold text-gray-400 group-hover:text-blue-400">새 TAPN 만들기</span>
        </button>

        {drafts.map((draft) => (
          <div 
            key={draft.id} 
            onClick={() => handleEdit(draft)}
            className="group relative aspect-video bg-gray-800 rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-gray-500 transition-all"
          >
            {draft.thumbnail ? (
              <video src={draft.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                <Film size={40} className="mb-2" />
                <span className="text-xs">No Preview</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-4 flex flex-col justify-end">
              <h3 className="font-bold text-lg truncate">{draft.title}</h3>
              <p className="text-xs text-gray-400">
                {new Date(draft.updatedAt).toLocaleDateString()} 수정됨
              </p>
            </div>

            <button 
              onClick={(e) => handleDelete(draft.id, e)}
              className="absolute top-2 right-2 p-2 bg-black/50 text-red-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"
            >
              <Trash2 size={16} />
            </button>
            
            <div className="absolute top-2 left-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100">
              <Edit3 size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
