"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useStore } from '@/store/useStore';
import { X, Upload, Trash2, Plus, Check, RefreshCw, Flag, Youtube, Loader2 } from 'lucide-react';

export default function Sidebar() {
  const { nodes, selectedNodeId, setSelectedNodeId, updateNodeData, startNodeId, setStartNodeId, syncEdges } = useStore();
  const [localData, setLocalData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (selectedNodeId) {
      const node = nodes.find((n) => n.id === selectedNodeId);
      if (node) {
        setLocalData(JSON.parse(JSON.stringify(node.data)));
      }
    } else {
      setLocalData(null);
    }
  }, [selectedNodeId, nodes]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedNodeId) {
        setSelectedNodeId(null);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedNodeId, setSelectedNodeId]);

  if (!selectedNodeId || !localData) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) throw new Error("Upload Failed");

      const newBlob = await response.json();
      setLocalData({ ...localData, videoUrl: newBlob.url });
      alert("☁️ 서버 업로드 성공!");

    } catch (error) {
      console.error(error);
      const objectUrl = URL.createObjectURL(file);
      setLocalData({ ...localData, videoUrl: objectUrl });
      alert("⚠️ 임시 저장소에 저장됨");
    } finally {
      setIsUploading(false);
    }
  };

  const addChoice = () => {
    const currentCount = localData.choices?.length || 0;
    const newChoices = [
      ...(localData.choices || []),
      { id: Date.now().toString(), label: `선택지 ${currentCount + 1}`, targetNodeId: '' }
    ];
    setLocalData({ ...localData, choices: newChoices });
  };

  const updateChoice = (index: number, field: string, value: string) => {
    const newChoices = [...(localData.choices || [])];
    newChoices[index] = { ...newChoices[index], [field]: value };
    setLocalData({ ...localData, choices: newChoices });
  };

  const removeChoice = (index: number) => {
    const newChoices = localData.choices.filter((_: any, i: number) => i !== index);
    setLocalData({ ...localData, choices: newChoices });
  };

  const handleApply = () => {
    updateNodeData(selectedNodeId, localData);
    setTimeout(() => { syncEdges(); }, 100);
  };

  const toggleStartNode = () => {
    if (startNodeId === selectedNodeId) setStartNodeId(null);
    else setStartNodeId(selectedNodeId);
  };

  const isStartNode = startNodeId === selectedNodeId;

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={() => setSelectedNodeId(null)}
      />
      
      {/* Sidebar */}
      <div className="fixed md:absolute top-0 md:top-4 right-0 md:right-4 w-full md:w-96 h-full md:h-auto md:max-h-[90vh] bg-white md:rounded-xl shadow-2xl border-0 md:border border-gray-200 flex flex-col overflow-hidden z-50">
        
        {/* Header */}
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center shrink-0">
          <h3 className="font-extrabold text-black text-base md:text-lg flex items-center gap-2">
            <span className="w-2 h-5 md:h-6 bg-blue-600 rounded-full" />
            Scene Editor
          </h3>
          <button 
            onClick={() => setSelectedNodeId(null)} 
            className="text-gray-500 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded-full"
            aria-label="닫기 (ESC)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-5 overflow-y-auto flex-1 space-y-4 md:space-y-6">
          
          {/* Start Node Toggle */}
          <div 
            onClick={toggleStartNode}
            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 active:scale-95 ${isStartNode ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
          >
            <div className={`p-2 rounded-full ${isStartNode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
              <Flag size={18} fill={isStartNode ? "currentColor" : "none"} />
            </div>
            <div>
              <h4 className={`text-xs md:text-sm font-bold ${isStartNode ? 'text-blue-700' : 'text-gray-500'}`}>
                {isStartNode ? "현재 시작 장면" : "시작 장면으로 설정"}
              </h4>
              <p className="text-[10px] md:text-xs text-gray-400">첫 번째 재생 장면</p>
            </div>
          </div>

          {/* Scene Name */}
          <div className="space-y-1">
            <label className="text-[10px] md:text-xs font-extrabold text-black uppercase tracking-wider">Scene Name</label>
            <input 
              name="label" 
              value={localData.label} 
              onChange={handleChange}
              className="w-full p-2.5 md:p-3 border border-gray-300 rounded-lg text-sm md:text-base text-black font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="장면 이름"
            />
          </div>

          {/* Question */}
          <div className="space-y-1">
            <label className="text-[10px] md:text-xs font-extrabold text-black uppercase tracking-wider">Question</label>
            <textarea 
              name="question" 
              value={localData.question} 
              onChange={handleChange}
              className="w-full p-2.5 md:p-3 border border-gray-300 rounded-lg text-sm md:text-base text-black font-bold focus:ring-2 focus:ring-blue-500 outline-none resize-none h-20 md:h-24"
              placeholder="질문 입력"
            />
          </div>

          {/* Video Source */}
          <div className="space-y-3">
            <label className="text-[10px] md:text-xs font-extrabold text-black uppercase tracking-wider">Video Source</label>
            
            <div className="flex gap-2 items-center">
              <div className="p-1.5 md:p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
                <Youtube size={16} className="md:w-[18px] md:h-[18px]" />
              </div>
              <input 
                name="videoUrl" 
                value={localData.videoUrl} 
                onChange={handleChange}
                placeholder="YouTube URL..." 
                className="flex-1 p-2 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none min-w-0"
              />
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200" />
              <span className="flex-shrink-0 mx-3 md:mx-4 text-gray-400 text-[10px] font-bold uppercase">OR</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            {localData.videoUrl && !localData.videoUrl.startsWith('blob:') ? (
              <div className="relative border-2 border-green-500 rounded-xl overflow-hidden aspect-video group bg-black">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900">
                  <Check size={28} className="md:w-8 md:h-8 text-green-500 mb-2" />
                  <span className="text-xs font-bold text-gray-300">영상 설정 완료</span>
                </div>
                
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label className="px-3 py-1.5 md:px-4 md:py-2 bg-white text-black rounded-full text-xs font-bold cursor-pointer hover:bg-gray-200 flex items-center gap-2">
                    <RefreshCw size={12} className="md:w-[14px] md:h-[14px]" /> 변경
                    <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <div className={`border-2 border-dashed rounded-xl p-4 md:p-6 text-center transition-all relative group cursor-pointer ${isUploading ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:bg-blue-50'}`}>
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={handleFileUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isUploading}
                />
                <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-blue-600">
                  {isUploading ? (
                    <>
                      <Loader2 size={24} className="md:w-7 md:h-7 animate-spin text-blue-600" />
                      <span className="text-xs md:text-sm font-bold text-blue-600">업로드 중...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={24} className="md:w-7 md:h-7" />
                      <span className="text-xs md:text-sm font-bold">Click to Upload</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Choices */}
          <div className="space-y-3 pt-3 md:pt-4 border-t border-gray-100">
            <div className="flex justify-between items-end">
              <label className="text-[10px] md:text-xs font-extrabold text-black uppercase tracking-wider">Choices</label>
              <button 
                onClick={addChoice} 
                className="flex items-center gap-1 text-xs font-bold bg-blue-100 text-blue-700 px-2.5 md:px-3 py-1.5 rounded-full hover:bg-blue-200 active:scale-95 transition-transform"
              >
                <Plus size={12} className="md:w-[14px] md:h-[14px]" /> Add
              </button>
            </div>
            
            <div className="space-y-2 md:space-y-3">
              {localData.choices?.map((choice: any, idx: number) => (
                <div key={idx} className="bg-white p-2.5 md:p-3 rounded-xl border border-gray-200 shadow-sm space-y-2 relative hover:border-blue-400 transition-colors">
                  <input 
                    value={choice.label}
                    onChange={(e) => updateChoice(idx, 'label', e.target.value)}
                    placeholder={`선택지 ${idx + 1}`}
                    className="w-full text-xs md:text-sm font-bold text-black border border-gray-200 rounded-lg py-2 px-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 shrink-0">To:</span>
                    <select
                      value={choice.targetNodeId}
                      onChange={(e) => updateChoice(idx, 'targetNodeId', e.target.value)}
                      className="flex-1 text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg text-black font-medium outline-none cursor-pointer min-w-0"
                    >
                      <option value="">(연결 선택)</option>
                      {nodes
                        .filter((n) => n.id !== selectedNodeId)
                        .map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.data.label}
                          </option>
                        ))}
                    </select>
                  </div>
                  <button 
                    onClick={() => removeChoice(idx)} 
                    className="absolute -top-2 -right-2 bg-white text-gray-300 border border-gray-200 rounded-full p-1 hover:text-red-500 hover:border-red-500 transition-colors shadow-sm active:scale-90"
                  >
                    <Trash2 size={10} className="md:w-3 md:h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 md:p-4 bg-white border-t shrink-0">
          <button 
            onClick={handleApply}
            className="w-full bg-black text-white font-bold py-2.5 md:py-3 rounded-xl hover:bg-gray-800 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Check size={16} className="md:w-[18px] md:h-[18px]" />
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
