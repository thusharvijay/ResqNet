
import React from 'react';
import { RoomData } from '../types';
import { BrainCircuit, MessageSquareText, ShieldCheck } from 'lucide-react';

interface GlobalInsightsProps {
  rooms: RoomData[];
}

const GlobalInsights: React.FC<GlobalInsightsProps> = ({ rooms }) => {
  const activeAlerts = rooms.filter(r => r.status !== 'SAFE').length;
  const criticalCount = rooms.filter(r => r.status === 'CRITICAL').length;

  return (
    <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-base flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-blue-500" />
          AI Situation Report
        </h3>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Structural Analysis</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed bg-white/5 border border-white/5 p-3 rounded-lg">
                Integrity remains high. Primary hazard located on Floor 1 (Server Room). Smoke plume modeling suggests potential migration toward Conference Hall A via ventilation shafts within 4 minutes.
            </p>
        </div>

        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <MessageSquareText className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Strategic Recommendation</span>
            </div>
            <ul className="space-y-2">
                {[
                    "Deploy Team A to Floor 2 for immediate evacuation of Conference Hall A.",
                    "Isolate Floor 1 HVAC systems to contain CO2 dispersal.",
                    "Maintain continuous intercom connection with Office Suite 301.",
                    "Prioritize structural venting in the north-east wing."
                ].map((rec, i) => (
                    <li key={i} className="flex gap-2 text-xs text-gray-400">
                        <span className="text-blue-500 font-bold">•</span>
                        {rec}
                    </li>
                ))}
            </ul>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between">
          <div className="flex flex-col">
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">AI Confidence</span>
              <span className="text-sm font-black text-white">94.2%</span>
          </div>
          <div className="h-8 w-px bg-blue-500/20" />
          <div className="flex flex-col">
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">Data Points</span>
              <span className="text-sm font-black text-white">4.8k / sec</span>
          </div>
      </div>
    </div>
  );
};

export default GlobalInsights;
