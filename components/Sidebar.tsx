"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useStore } from '@/store/useStore';
import { X, Upload, Trash2, Plus, Check, RefreshCw, Flag, Youtube, Loader2, Film, CheckCircle } from 'lucide-react';

export default function Sidebar() {
  const { nodes, selectedNodeId, setSelectedNodeId, updateNodeData, startNodeId, setStartNodeId, syncEdges } = useStore();
  const [localData, setLocalData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showApplied, setShowApplied] = useState(false);

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

    } catch (error) {
      console.error(error);
      const objectUrl = URL.createObjectURL(file);
      setLocalData({ ...localData, videoUrl: objectUrl });
    } finally {
      setIsUploading(false);
    }
  };

  const clearVideo = () => {
    setLocalData({ ...localData, videoUrl: '' });
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
    
    setShowApplied(true);
    setTimeout(() => setShowApplied(false), 2000);
  };

  const toggleStartNode = () => {
    if (startNodeId === selectedNodeId) setStartNodeId(null);
    else setStartNodeId(selectedNodeId);
  };

  const isStartNode = startNodeId === selectedNodeId;
  const isYouTube = localData.videoUrl && (localData.videoUrl.includes('youtube.com') || localData.videoUrl.includes('youtu.be'));

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={() => setSelectedNodeId(null)}
      />
      
      <div className="fixed md:absolute top-0 md:top-4 right-0 md:right-4 w-full md:w-96 h-full md:h-auto md:max-h-[90vh] bg-white md:rounded-xl shadow-2xl border-0 md:border border-gray-200 flex flex-col overflow-hidden z-50">
        
        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 border-b flex justify-between items-center shrink-0">
          <h3 className="font-extrabold text-white text-base md:text-lg flex items-center gap-2">
            <span className="w-2 h-5 md:h-6 bg-white rounded-full" />
            Scene Editor
          </h3>
          <button 
            onClick={() => setSelectedNodeId(null)} 
            className="text-white hover:bg-white/20 transition-colors p-2 rounded-full"
            aria-label="닫기 (ESC)"
          >
            <X size={20} />
          </button>
        </div>

        {showApplied && (
          <div className="bg-green-500 text-white text-center py-2 text-sm font-bold animate-in slide-in-from-top">
            ✓ 변경사항이 적용되었습니다
          </div>
        )}

        <div className="p-4 md:p-5 overflow-y-auto flex-1 space-y-5 md:space-y-6">
          
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

          {/* 1. SCENE NAME */}
          <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label className="text-sm md:text-base font-extrabold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">①</span>
              SCENE NAME <span className="text-gray-500 font-normal text-xs">(장면 이름)</span>
            </label>
            <input 
              name="label" 
              value={localData.label} 
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base text-black font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="예: 오프닝, 엔딩, 분기점 등"
            />
          </div>

          {/* 2. QUESTION */}
          <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label className="text-sm md:text-base font-extrabold text-gray-900 flex items-center gap-2">
              <span className="text-purple-600">②</span>
              QUESTION <span className="text-gray-500 font-normal text-xs">(질문/대사)</span>
            </label>
            <textarea 
              name="question" 
              value={localData.question} 
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base text-black font-bold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none h-24 transition-all"
              placeholder="시청자에게 보여줄 질문이나 대사를 입력하세요"
            />
          </div>

          {/* 3. VIDEO SOURCE */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label className="text-sm md:text-base font-extrabold text-gray-900 flex items-center gap-2">
              <span className="text-green-600">③</span>
              VIDEO SOURCE <span className="text-gray-500 font-normal text-xs">(영상 소스)</span>
            </label>
            
            {/* 파일 업로드 우선 */}
            {localData.videoUrl ? (
              <div className="relative border-2 border-green-500 rounded-xl overflow-hidden aspect-video group bg-gradient-to-br from-green-50 to-blue-50">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {isYouTube ? (
                    <>
                      <Youtube size={48} className="text-red-500 mb-3" />
                      <span className="text-sm font-bold text-gray-800">YouTube 영상</span>
                      <span className="text-xs text-gray-500 mt-1">설정됨</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={48} className="text-green-500 mb-3" />
                      <span className="text-sm font-bold text-gray-800">영상 업로드 완료</span>
                      <div className="mt-2 bg-white/80 text-gray-600 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <Film size={12} />
                        <span>MP4 파일</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <label className="px-3 py-1.5 md:px-4 md:py-2 bg-white text-black rounded-full text-xs font-bold cursor-pointer hover:bg-gray-200 flex items-center gap-2">
                      <RefreshCw size={12} className="md:w-[14px] md:h-[14px]" /> 변경
                      <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <button 
                      onClick={clearVideo}
                      className="px-3 py-1.5 md:px-4 md:py-2 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className={`border-2 border-dashed rounded-xl p-5 md:p-6 text-center transition-all relative group cursor-pointer ${isUploading ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:bg-blue-50 hover:border-blue-400'}`}>
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
                        <Loader2 size={32} className="animate-spin text-blue-600" />
                        <span className="text-sm md:text-base font-bold text-blue-600">업로드 중...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={32} />
                        <span className="text-sm md:text-base font-bold">파일 업로드</span>
                        <span className="text-xs text-gray-500">MP4, MOV 등</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-300" />
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold">OR</span>
                  <div className="flex-grow border-t border-gray-300" />
                </div>

                <div className="flex gap-2 items-center">
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
                    <Youtube size={18} />
                  </div>
                  <input 
                    name="videoUrl" 
                    value={localData.videoUrl} 
                    onChange={handleChange}
                    placeholder="YouTube URL 입력..." 
                    className="flex-1 p-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none min-w-0 transition-all"
                  />
                </div>
              </>
            )}
          </div>

          {/* 4. CHOICES */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center">
              <label className="text-sm md:text-base font-extrabold text-gray-900 flex items-center gap-2">
                <span className="text-orange-600">④</span>
                CHOICES <span className="text-gray-500 font-normal text-xs">(선택지)</span>
              </label>
              <button 
                onClick={addChoice} 
                className="flex items-center gap-1.5 text-xs font-bold bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg active:scale-95 transition-all shadow"
              >
                <Plus size={14} /> 선택지 추가
              </button>
            </div>
            
            {localData.choices?.length > 0 ? (
              <div className="space-y-3">
                {localData.choices?.map((choice: any, idx: number) => (
                  <div key={idx} className="bg-white p-3 md:p-4 rounded-xl border-2 border-gray-200 shadow-sm space-y-2 relative hover:border-blue-400 transition-colors">
                    <input 
                      value={choice.label}
                      onChange={(e) => updateChoice(idx, 'label', e.target.value)}
                      placeholder={`선택지 ${idx + 1} 텍스트`}
                      className="w-full text-sm md:text-base font-bold text-black border-2 border-gray-200 rounded-lg py-2 px-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 shrink-0">연결 →</span>
                      <select
                        value={choice.targetNodeId}
                        onChange={(e) => updateChoice(idx, 'targetNodeId', e.target.value)}
                        className="flex-1 text-sm p-2 bg-gray-50 border-2 border-gray-200 rounded-lg text-black font-medium outline-none cursor-pointer min-w-0 focus:border-blue-500 transition-all"
                      >
                        <option value="">(다음 장면 선택)</option>
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
                      className="absolute -top-2 -right-2 bg-red-500 text-white border-2 border-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md active:scale-90"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-sm">
                선택지가 없습니다. 추가 버튼을 눌러 생성하세요.
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-white border-t shrink-0">
          <button 
            onClick={handleApply}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Check size={18} />
            적용하기
          </button>
        </div>
      </div>
    </>
  );
}
