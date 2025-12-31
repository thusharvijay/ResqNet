
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Radio, Waveform, PhoneCall } from 'lucide-react';
import { GoogleGenAI, Modality } from '@google/genai';

interface VoiceCommProps {
  roomId: string;
  roomName: string;
}

const VoiceComm: React.FC<VoiceCommProps> = ({ roomId, roomName }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [connectionTime, setConnectionTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCall = useCallback(() => {
    setIsCalling(true);
    setConnectionTime(0);
    timerRef.current = setInterval(() => {
      setConnectionTime(prev => prev + 1);
    }, 1000);
  }, []);

  const endCall = useCallback(() => {
    setIsCalling(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Note: Real Gemini Live API implementation would happen here if we had a full backend
  // For this dashboard, we simulate the UI behavior.

  return (
    <div className="flex items-center gap-2">
      {isCalling && (
        <div className="px-4 py-2 bg-black/80 backdrop-blur-xl border border-blue-500/30 rounded-xl flex items-center gap-4 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
              Live Intercom
            </span>
            <span className="text-xs font-bold text-white mono">{formatTime(connectionTime)}</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-lg transition-colors ${isMuted ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10 text-gray-400'}`}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button 
              onClick={endCall}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-red-600/20"
            >
              Terminate
            </button>
          </div>
        </div>
      )}
      
      {!isCalling && (
        <button 
          onClick={startCall}
          className="group px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 hover:scale-105"
        >
          <PhoneCall className="w-4 h-4" />
          Talk to Room
        </button>
      )}
    </div>
  );
};

export default VoiceComm;
