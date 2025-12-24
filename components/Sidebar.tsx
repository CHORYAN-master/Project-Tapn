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

  if (!selectedNodeId || !localData) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
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
    alert('✅ 변경사항 적용!');
  };

  const toggleStartNode = () => {
    if (startNodeId === selectedNodeId) setStartNodeId(null);
    else setStartNodeId(selectedNodeId);
  };

  const isStartNode = startNodeId === selectedNodeId;

  return (
    <div className="absolute top-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden max-h-[90vh] z-50">
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="font-extrabold text-black text-lg flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
          Scene Editor
        </h3>
        <button onClick={() => setSelectedNodeId(null)} className="text-gray-500 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="p-5 overflow-y-auto flex-1 space-y-6">
        
        <div 
          onClick={toggleStartNode}
          className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${isStartNode ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
        >
          <div className={`p-2 rounded-full ${isStartNode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
            <Flag size={20} fill={isStartNode ? "currentColor" : "none"} />
          </div>
          <div>
            <h4 className={`text-sm font-bold ${isStartNode ? 'text-blue-700' : 'text-gray-500'}`}>
              {isStartNode ? "현재 시작 장면" : "시작 장면으로 설정"}
            </h4>
            <p className="text-xs text-gray-400">첫 번째 재생 장면</p>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-extrabold text-black uppercase tracking-wider">Scene Name</label>
          <input 
            name="label" 
            value={localData.label} 
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-black font-bold focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="장면 이름"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-extrabold text-black uppercase tracking-wider">Question</label>
          <textarea 
            name="question" 
            value={localData.question} 
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-black font-bold focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
            placeholder="질문 입력"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-extrabold text-black uppercase tracking-wider flex items-center gap-2">
            Video Source
          </label>
          
          <div className="flex gap-2 items-center">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Youtube size={18} /></div>
            <input 
              name="videoUrl" 
              value={localData.videoUrl} 
              onChange={handleChange}
              placeholder="YouTube URL..." 
              className="flex-1 p-2 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-[10px] font-bold uppercase">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {localData.videoUrl && !localData.videoUrl.startsWith('blob:') ? (
            <div className="relative border-2 border-green-500 rounded-xl overflow-hidden aspect-video group bg-black">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900">
                <Check size={32} className="text-green-500 mb-2" />
                <span className="text-xs font-bold text-gray-300">영상 설정 완료</span>
              </div>
              
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <label className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold cursor-pointer hover:bg-gray-200 flex items-center gap-2">
                  <RefreshCw size={14} /> 파일 변경
                  <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          ) : (
            <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all relative group cursor-pointer ${isUploading ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:bg-blue-50'}`}>
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
                    <Loader2 size={28} className="animate-spin text-blue-600" />
                    <span className="text-sm font-bold text-blue-600">업로드 중...</span>
                  </>
                ) : (
                  <>
                    <Upload size={28} />
                    <span className="text-sm font-bold">Click to Upload</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-end">
            <label className="text-xs font-extrabold text-black uppercase tracking-wider">Choices</label>
            <button 
              onClick={addChoice} 
              className="flex items-center gap-1 text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-200"
            >
              <Plus size={14} /> Add
            </button>
          </div>
          
          <div className="space-y-3">
            {localData.choices?.map((choice: any, idx: number) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-2 relative hover:border-blue-400 transition-colors">
                <input 
                  value={choice.label}
                  onChange={(e) => updateChoice(idx, 'label', e.target.value)}
                  placeholder={`선택지 ${idx + 1}`}
                  className="w-full text-sm font-bold text-black border border-gray-200 rounded-lg py-2 px-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">To:</span>
                  <select
                    value={choice.targetNodeId}
                    onChange={(e) => updateChoice(idx, 'targetNodeId', e.target.value)}
                    className="flex-1 text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg text-black font-medium outline-none cursor-pointer"
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
                  className="absolute -top-2 -right-2 bg-white text-gray-300 border border-gray-200 rounded-full p-1 hover:text-red-500 hover:border-red-500 transition-colors shadow-sm"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t flex gap-2">
        <button 
          onClick={handleApply}
          className="flex-1 bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <Check size={18} />
          Apply
        </button>
      </div>
    </div>
  );
}
