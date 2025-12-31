
export interface RoomData {
  id: string;
  name: string;
  floor: number;
  peopleCount: number;
  smokeLevel: number; // 0-100
  co2Level: number; // ppm
  oxygenLevel: number; // %
  temperature: number; // Celsius
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
  cameraUrl: string;
}

export interface SensorAlert {
  id: string;
  roomId: string;
  roomName: string;
  type: 'SMOKE' | 'CO2' | 'TEMP' | 'PEOPLE';
  severity: 'MEDIUM' | 'HIGH';
  timestamp: Date;
}

export interface PriorityRoom extends RoomData {
  dangerScore: number;
  reason: string;
}
