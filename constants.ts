
import { RoomData } from './types';

export const INITIAL_ROOMS: RoomData[] = [
  {
    id: 'r1',
    name: 'Main Lobby',
    floor: 1,
    peopleCount: 4,
    smokeLevel: 12,
    co2Level: 450,
    oxygenLevel: 20.8,
    temperature: 24,
    status: 'SAFE',
    cameraUrl: 'https://picsum.photos/seed/lobby/800/450'
  },
  {
    id: 'r2',
    name: 'Server Room',
    floor: 1,
    peopleCount: 0,
    smokeLevel: 85,
    co2Level: 1200,
    oxygenLevel: 18.2,
    temperature: 45,
    status: 'CRITICAL',
    cameraUrl: 'https://picsum.photos/seed/server/800/450'
  },
  {
    id: 'r3',
    name: 'Conference Hall A',
    floor: 2,
    peopleCount: 12,
    smokeLevel: 45,
    co2Level: 800,
    oxygenLevel: 19.5,
    temperature: 32,
    status: 'WARNING',
    cameraUrl: 'https://picsum.photos/seed/conf/800/450'
  },
  {
    id: 'r4',
    name: 'Office Suite 301',
    floor: 3,
    peopleCount: 2,
    smokeLevel: 5,
    co2Level: 400,
    oxygenLevel: 20.9,
    temperature: 22,
    status: 'SAFE',
    cameraUrl: 'https://picsum.photos/seed/office/800/450'
  }
];

export const DANGER_WEIGHTS = {
  SMOKE: 1.5,
  TEMP: 1.2,
  CO2: 1.0,
  PEOPLE: 2.5 // Higher priority if people are present in dangerous conditions
};
