"use client";

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Lock, ArrowRight } from 'lucide-react';

export default function GateView() {
  const { login } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(password)) {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-white p-4">
      <div className="max-w-md w-full flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500">
        
        {/* 타이틀 */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-blue-900/30 text-blue-500 border border-blue-800">
              <Lock size={40} />
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            Welcome to <span className="text-blue-500">TAPN</span>
          </h1>
          <p className="text-gray-400">Interactive Video Platform</p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 text-center text-xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-sm placeholder:text-gray-600"
              autoFocus
            />
            {error && (
              <p className="absolute -bottom-6 left-0 right-0 text-center text-xs text-red-500 font-bold animate-pulse">
                비밀번호가 올바르지 않습니다.
              </p>
            )}
          </div>
          
          <button 
            type="submit"
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group"
          >
            입장하기 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* 하단 데모 메시지 */}
        <div className="text-center border-t border-gray-800 pt-6 w-full">
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            본 서비스는 TAPN의 기획, 개발 및 테스트를 위한<br/>
            <span className="text-blue-500">데모 버전</span>입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
