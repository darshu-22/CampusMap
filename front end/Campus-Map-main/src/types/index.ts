export interface Room {
  id: string;
  number: string;
  name: string;
  buildingId: string;
  floorId: string;
  category: 'Classroom' | 'Lab' | 'Faculty Room' | 'Office' | 'Facility';
  department?: string;
  purpose: string;
  capacity?: number;
  nearbyRooms: string[];
  nearestLift: string;
  nearestWashroom: string;
  directions: string[]; // Step-by-step directions from the Main Gate
}

export interface Floor {
  id: string; // e.g. "ground", "floor-1", etc.
  buildingId: string;
  number: number; // 0 for ground, 1 for first, etc.
  name: string; // "Ground Floor", "First Floor", etc.
  department: string; // department occupying this floor
  roomsCount: number;
  labsCount: number;
  rooms: string[]; // room IDs
  washrooms: string; // location description
  lifts: string[]; // lift locations
  emergencyExit: string; // emergency exit description
  staircases: string; // staircase locations
}

export interface Building {
  id: string;
  name: string;
  description: string;
  floorsCount: number;
  floors: string[]; // floor IDs
  image?: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  iconName: string; // Lucide icon name
  floor: string;
  building: string;
  openHours: string;
}

export interface DirectoryItem {
  id: string;
  name: string;
  type: 'Department' | 'Office' | 'Facility' | 'Lab' | 'Classroom';
  link: string; // path to navigate to, e.g. "/room/admin-office" or "/building/academic-block"
}

export interface SearchResult {
  id: string;
  name: string;
  category: 'Classroom' | 'Lab' | 'Faculty Room' | 'Office' | 'Facility' | 'Building';
  floor?: string;
  building?: string;
  nearestLift?: string;
  iconName: string;
  link: string;
}
