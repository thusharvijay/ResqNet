
import React from 'react';
import { RoomData } from '../types';
import { Wind, Thermometer, Droplets, Users, AlertCircle, Info } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface RoomStatsProps {
  room: RoomData;
}

const RoomStats: React.FC<RoomStatsProps> = ({ room }) => {
  // Generate mock trend data
  const trendData = Array.from({ length: 10 }).map((_, i) => ({
    time: i,
    smoke: room.smokeLevel + (Math.random() * 5 - 2.5),
    temp: room.temperature + (Math.random() * 2 - 1)
  }));

  return (
    <div className="space-y-6">
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-400" />
            Sensor Telemetry
          </h3>
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
            room.status === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
            room.status === 'WARNING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
            'bg-green-500/10 text-green-500 border border-green-500/20'
          }`}>
            {room.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            label="Smoke Level" 
            value={`${room.smokeLevel}%`} 
            icon={<Wind className="w-4 h-4" />} 
            status={room.smokeLevel > 50 ? 'bad' : room.smokeLevel > 20 ? 'warn' : 'good'} 
          />
          <StatCard 
            label="Temperature" 
            value={`${room.temperature}°C`} 
            icon={<Thermometer className="w-4 h-4" />} 
            status={room.temperature > 50 ? 'bad' : room.temperature > 35 ? 'warn' : 'good'} 
          />
          <StatCard 
            label="Oxygen Level" 
            value={`${room.oxygenLevel}%`} 
            icon={<Droplets className="w-4 h-4" />} 
            status={room.oxygenLevel < 19 ? 'bad' : room.oxygenLevel < 20 ? 'warn' : 'good'} 
          />
          <StatCard 
            label="CO2 Density" 
            value={`${room.co2Level} ppm`} 
            icon={<AlertCircle className="w-4 h-4" />} 
            status={room.co2Level > 1000 ? 'bad' : room.co2Level > 700 ? 'warn' : 'good'} 
          />
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Atmospheric Trend (60s)</span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '10px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="smoke" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6">
        <h4 className="text-sm font-bold text-orange-400 mb-2 uppercase tracking-wide">Rescue Note</h4>
        <p className="text-xs text-gray-400 leading-relaxed">
          {room.peopleCount > 0 
            ? `DANGER: ${room.peopleCount} survivors detected. Immediate extraction required due to deteriorating atmosphere.`
            : `SECURE: No thermal signature for personnel. Monitor structural integrity closely.`}
        </p>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  status: 'good' | 'warn' | 'bad';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, status }) => {
  const colorClass = status === 'bad' ? 'text-red-500' : status === 'warn' ? 'text-yellow-500' : 'text-green-500';
  const bgClass = status === 'bad' ? 'bg-red-500/10' : status === 'warn' ? 'bg-yellow-500/10' : 'bg-green-500/10';

  return (
    <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col gap-2">
      <div className={`p-1.5 w-fit rounded-lg ${bgClass} ${colorClass}`}>
        {icon}
      </div>
      <div>
        <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest">{label}</span>
        <span className={`text-lg font-black tracking-tight ${colorClass}`}>{value}</span>
      </div>
    </div>
  );
};

export default RoomStats;
