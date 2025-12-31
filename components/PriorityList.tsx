
import React from 'react';
import { PriorityRoom } from '../types';
import { MapPin, ArrowUpRight, Skull } from 'lucide-react';

interface PriorityListProps {
  rooms: PriorityRoom[];
  onRoomSelect: (id: string) => void;
}

const PriorityList: React.FC<PriorityListProps> = ({ rooms, onRoomSelect }) => {
  return (
    <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-500" />
          Rescue Prioritization
        </h3>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sorted by Risk Index</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
        {rooms.map((room, index) => (
          <div 
            key={room.id}
            onClick={() => onRoomSelect(room.id)}
            className="group cursor-pointer bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/[0.08] p-4 rounded-xl transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                  index === 0 ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-400'
                }`}>
                  #{index + 1}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{room.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{room.reason}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest">Risk Index</span>
                <span className={`text-sm font-black ${room.dangerScore > 50 ? 'text-red-500' : 'text-orange-400'}`}>
                  {room.dangerScore.toFixed(0)}
                </span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center gap-4 border-t border-white/5 pt-3 opacity-60 group-hover:opacity-100 transition-opacity">
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                  <ArrowUpRight className="w-3 h-3" />
                  FLOOR {room.floor}
               </div>
               {room.peopleCount > 0 && (
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-400">
                    <Skull className="w-3 h-3" />
                    SURVIVORS DETECTED
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityList;
