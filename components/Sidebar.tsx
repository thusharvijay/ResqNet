
import React from 'react';
import { RoomData } from '../types';
import { LayoutGrid, AlertTriangle, CheckCircle, ChevronRight, Layers } from 'lucide-react';

interface SidebarProps {
  rooms: RoomData[];
  activeRoomId: string;
  onRoomSelect: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ rooms, activeRoomId, onRoomSelect }) => {
  const floors = Array.from(new Set(rooms.map(r => r.floor))).sort();

  return (
    <aside className="w-72 bg-[#0f0f0f] border-r border-white/10 flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-white/10 flex items-center gap-2 text-gray-400">
        <Layers className="w-5 h-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">Facility Layout</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-8">
        {floors.map(floor => (
          <div key={floor} className="space-y-2">
            <h3 className="px-4 text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Floor {floor}</h3>
            <div className="space-y-1">
              {rooms.filter(r => r.floor === floor).map(room => (
                <button
                  key={room.id}
                  onClick={() => onRoomSelect(room.id)}
                  className={`w-full group flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    activeRoomId === room.id 
                      ? 'bg-orange-500/10 border border-orange-500/30 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                      : 'hover:bg-white/5 text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full transition-shadow ${
                      room.status === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse' :
                      room.status === 'WARNING' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]' :
                      'bg-green-500'
                    }`} />
                    <span className="text-sm font-medium">{room.name}</span>
                  </div>
                  {activeRoomId === room.id && <ChevronRight className="w-4 h-4 opacity-50" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10 bg-black/40">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest">
            Legend
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase">
              <span className="w-2 h-2 bg-red-500 rounded-full" /> CRITICAL DANGER
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase">
              <span className="w-2 h-2 bg-yellow-500 rounded-full" /> HAZARD WARNING
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase">
              <span className="w-2 h-2 bg-green-500 rounded-full" /> SECURE
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
