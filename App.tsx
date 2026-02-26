
import React, { useState, useCallback, useRef } from 'react';
import { AppState, FoodAnalysis, AnalysisResponse } from './types';
import { analyzeMenuImage } from './services/geminiService';
import CameraView from './components/CameraView';
import AnalysisResult from './components/AnalysisResult';
import LoadingState from './components/LoadingState';
import { Camera, RefreshCcw, AlertCircle, Info } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('IDLE');
  const [results, setResults] = useState<FoodAnalysis[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleCapture = async (base64Image: string) => {
    try {
      setState('LOADING');
      const response = await analyzeMenuImage(base64Image);
      setResults(response.items);
      setState('RESULT');
    } catch (error) {
      console.error('Analysis failed:', error);
      setErrorMessage('이미지 분석 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setState('ERROR');
    }
  };

  const reset = () => {
    setState('IDLE');
    setResults([]);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Camera className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">푸드카메라</h1>
        </div>
        {state === 'RESULT' && (
          <button 
            onClick={reset}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <RefreshCcw className="w-5 h-5 text-slate-600" />
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col overflow-y-auto pb-20">
        {state === 'IDLE' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6">
            <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
              <Camera className="w-16 h-16 text-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">메뉴판이나 음식을 찍어보세요</h2>
              <p className="text-slate-500">AI가 재료와 설명을 순식간에 분석해드립니다.</p>
            </div>
            <button 
              onClick={() => setState('CAPTURING')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-95"
            >
              카메라 시작하기
            </button>
            
            <div className="mt-8 bg-white p-4 rounded-xl border border-slate-200 text-left">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Info className="w-4 h-4 text-blue-500" /> 이런 분들께 추천해요!
              </h3>
              <ul className="text-xs text-slate-500 space-y-2">
                <li>• 처음 보는 음식의 정보가 궁금할 때</li>
                <li>• 알레르기 성분이 걱정되는 분</li>
                <li>• 해외 여행 중 메뉴판 해독이 필요할 때</li>
              </ul>
            </div>
          </div>
        )}

        {state === 'CAPTURING' && (
          <CameraView onCapture={handleCapture} onCancel={reset} />
        )}

        {state === 'LOADING' && (
          <LoadingState />
        )}

        {state === 'RESULT' && (
          <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {results.length > 0 ? (
              results.map((item, idx) => (
                <AnalysisResult key={idx} analysis={item} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <AlertCircle className="w-12 h-12 mb-2" />
                <p>분석된 메뉴가 없습니다.</p>
              </div>
            )}
            <button 
              onClick={reset}
              className="w-full mt-4 py-4 border-2 border-orange-500 text-orange-500 font-bold rounded-2xl hover:bg-orange-50 transition-colors"
            >
              다른 사진 찍기
            </button>
          </div>
        )}

        {state === 'ERROR' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
            <AlertCircle className="w-16 h-16 text-red-500" />
            <h2 className="text-xl font-bold text-slate-800">오류가 발생했습니다</h2>
            <p className="text-slate-500">{errorMessage}</p>
            <button 
              onClick={reset}
              className="mt-4 px-8 py-3 bg-slate-800 text-white rounded-xl"
            >
              홈으로 돌아가기
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white/80 backdrop-blur-md border-t px-6 py-3 text-center text-xs text-slate-400 absolute bottom-0 w-full max-w-md">
        © 2024 Food Camera AI • Powered by Gemini
      </footer>
    </div>
  );
};

export default App;
