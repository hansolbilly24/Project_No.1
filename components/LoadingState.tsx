
import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';

const messages = [
  "이미지를 읽어오고 있어요...",
  "AI가 메뉴를 분석 중입니다...",
  "맛있는 정보를 찾고 있어요!",
  "잠시만 기다려주세요...",
  "거의 다 되었습니다!"
];

const LoadingState: React.FC = () => {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8 animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-24 h-24 bg-orange-500 rounded-full animate-bounce flex items-center justify-center">
            <Search className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -inset-4 border-4 border-dashed border-orange-200 rounded-full animate-[spin_10s_linear_infinite]"></div>
      </div>
      
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
            <h2 className="text-xl font-bold text-slate-800">분석 중...</h2>
        </div>
        <p className="text-slate-500 animate-pulse min-h-[1.5rem]">
          {messages[msgIdx]}
        </p>
      </div>

      <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-orange-500 animate-[loading_2s_ease-in-out_infinite]"></div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; margin-left: 0; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;
