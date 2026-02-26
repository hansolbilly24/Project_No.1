
import React from 'react';
import { FoodAnalysis } from '../types';
import { Utensils, Info, FlaskConical, AlertTriangle, Layers } from 'lucide-react';

interface AnalysisResultProps {
  analysis: FoodAnalysis;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-4">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Utensils className="w-5 h-5" /> {analysis.name}
        </h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Description */}
        <section>
          <p className="text-slate-700 leading-relaxed text-sm">
            {analysis.description}
          </p>
        </section>

        <hr className="border-slate-100" />

        {/* Ingredients & Seasonings */}
        <div className="grid grid-cols-2 gap-4">
          <section>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Layers className="w-3 h-3" /> 주요 재료
            </h4>
            <div className="flex flex-wrap gap-1">
              {analysis.ingredients.map((ing, i) => (
                <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                  {ing}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <FlaskConical className="w-3 h-3" /> 양념/소스
            </h4>
            <div className="flex flex-wrap gap-1">
              {analysis.seasonings.map((sea, i) => (
                <span key={i} className="text-[11px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                  {sea}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Extra Info */}
        {analysis.extraInfo && (
          <section className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
            <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Info className="w-3 h-3" /> 참고사항 / 알레르기 정보
            </h4>
            <p className="text-sm text-orange-800 leading-relaxed">
              {analysis.extraInfo}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;
