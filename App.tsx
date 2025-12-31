
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RoomData, PriorityRoom } from './types';
import { INITIAL_ROOMS } from './constants';
import Sidebar from './components/Sidebar';
import CameraFeed from './components/CameraFeed';
import RoomStats from './components/RoomStats';
import GlobalInsights from './components/GlobalInsights';
import PriorityList from './components/PriorityList';
import { Activity, ShieldAlert, Users, Flame } from 'lucide-react';

const App: React.FC = () => {
  const [rooms, setRooms] = useState<RoomData[]>(INITIAL_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string>(INITIAL_ROOMS[0].id);

  // Simulate real-time sensor data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRooms(prevRooms => prevRooms.map(room => {
        // Randomly fluctuate values slightly
        const deltaSmoke = (Math.random() - 0.4) * 2;
        const deltaTemp = (Math.random() - 0.4) * 0.5;
        
        const newSmoke = Math.max(0, Math.min(100, room.smokeLevel + deltaSmoke));
        const newTemp = Math.max(15, Math.min(100, room.temperature + deltaTemp));
        
        let status: 'SAFE' | 'WARNING' | 'CRITICAL' = 'SAFE';
        if (newSmoke > 70 || newTemp > 60) status = 'CRITICAL';
        else if (newSmoke > 30 || newTemp > 40) status = 'WARNING';

        return {
          ...room,
          smokeLevel: Number(newSmoke.toFixed(1)),
          temperature: Number(newTemp.toFixed(1)),
          status
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const activeRoom = useMemo(() => 
    rooms.find(r => r.id === activeRoomId) || rooms[0],
  [rooms, activeRoomId]);

  const priorityRooms = useMemo((): PriorityRoom[] => {
    return rooms
      .map(room => {
        let score = (room.smokeLevel * 0.5) + (room.temperature * 0.3) + (room.peopleCount * 10);
        if (room.oxygenLevel < 19) score += 20;
        
        let reason = "Normal conditions";
        if (room.status === 'CRITICAL') reason = `High smoke (${room.smokeLevel}%) & heat.`;
        else if (room.peopleCount > 0 && room.smokeLevel > 20) reason = `Survivors detected in smoke zone.`;
        else if (room.peopleCount > 0) reason = `Personnel present.`;

        return { ...room, dangerScore: score, reason };
      })
      .sort((a, b) => b.dangerScore - a.dangerScore);
  }, [rooms]);

  const stats = useMemo(() => {
    const critical = rooms.filter(r => r.status === 'CRITICAL').length;
    const warning = rooms.filter(r => r.status === 'WARNING').length;
    const totalPeople = rooms.reduce((acc, r) => acc + r.peopleCount, 0);
    return { critical, warning, totalPeople };
  }, [rooms]);

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden text-gray-100">
      {/* Sidebar - Navigation */}
      <Sidebar 
        rooms={rooms} 
        activeRoomId={activeRoomId} 
        onRoomSelect={setActiveRoomId} 
      />

      {/* Main Dashboard Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0f0f0f]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500/20" />
            <h1 className="text-xl font-bold tracking-tight">RESQ<span className="text-orange-500">NET</span></h1>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <span className="text-sm font-medium text-gray-400 uppercase tracking-widest mono">Command Dashboard V1.0</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-xs font-bold uppercase">
              <ShieldAlert className="w-4 h-4" />
              <span>{stats.critical} Critical Zones</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase">
              <Users className="w-4 h-4" />
              <span>{stats.totalPeople} Total Detected</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-xs font-bold uppercase">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>System Live</span>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-12 gap-6">
            
            {/* Left Col: Camera & Comm */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <CameraFeed room={activeRoom} />
              <div className="grid grid-cols-2 gap-6">
                 <PriorityList rooms={priorityRooms} onRoomSelect={setActiveRoomId} />
                 <GlobalInsights rooms={rooms} />
              </div>
            </div>

            {/* Right Col: Stats & Details */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <RoomStats room={activeRoom} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
