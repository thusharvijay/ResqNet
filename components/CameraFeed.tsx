
import React, { useState } from 'react';
import { RoomData } from '../types';
import { Maximize2, Mic, MicOff, Camera, RefreshCw, Radio } from 'lucide-react';
import VoiceComm from './VoiceComm';

interface CameraFeedProps {
  room: RoomData;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ room }) => {
  const [isIntercomActive, setIsIntercomActive] = useState(false);

  return (
    <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Feed Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Camera className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-tight">{room.name} Live Feed</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">REC: L-CHANNEL-{room.id.toUpperCase()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Feed Content */}
      <div className="relative aspect-video bg-black group overflow-hidden">
        <img 
          src={room.cameraUrl} 
          alt="Surveillance" 
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2000ms]"
        />
        
        {/* Overlay Static */}
        <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent border-t-white/5 border-l-white/5 flex items-center justify-center">
            <div className="absolute top-6 right-6 mono text-[10px] text-white/40 space-y-1">
                <p>LAT: 40.7128 N</p>
                <p>LNG: 74.0060 W</p>
                <p>ALT: 2.5m</p>
            </div>
            <div className="absolute top-6 left-6 mono text-[10px] text-white/40">
                <p>03-24-2024</p>
                <p>{new Date().toLocaleTimeString()}</p>
            </div>
            
            {/* Visual Danger Indicator */}
            {room.status === 'CRITICAL' && (
                <div className="absolute inset-0 bg-red-900/10 animate-pulse pointer-events-none" />
            )}
        </div>

        {/* HUD Elements */}
        <div className="absolute bottom-6 left-6 flex gap-4">
            <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded border border-white/10 flex items-center gap-3">
                <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">People</span>
                    <span className="text-sm font-black text-white">{room.peopleCount}</span>
                </div>
                <div className="w-px h-6 bg-white/20" />
                <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Heat</span>
                    <span className={`text-sm font-black ${room.temperature > 50 ? 'text-red-500' : 'text-white'}`}>{room.temperature}°C</span>
                </div>
            </div>
        </div>

        {/* Intercom Control (VoiceComm) */}
        <div className="absolute bottom-6 right-6 flex items-center gap-3">
            <VoiceComm roomId={room.id} roomName={room.name} />
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;
