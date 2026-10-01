export interface Destination {
  id: string;
  name: string;
  type: "room" | "lab" | "office" | "facility" | "gate" | "other";

  aliases: string[];

  buildingId?: string;
  floorId?: string;

  anchorPanoramaId: string | null;

  position: {
    yaw: number;
    pitch: number;
  } | null;

  instruction?: string;
}

export const destinations: Record<string, Destination> = {
  "room-215": {
    id: "room-215",
    name: "Room 215",
    type: "room",
    aliases: ["Room 215", "215"],
    anchorPanoramaId: "9.jpeg",
    position: null,
    instruction: "You have arrived at Room 215."
  },
  "room-516": {
    id: "room-516",
    name: "Room 516",
    type: "room",
    aliases: ["516", "Room 516", "Classroom 516"],
    anchorPanoramaId: null,
    position: null
  },
  "chemistry-lab-le22": {
    id: "chemistry-lab-le22",
    name: "Chemistry Lab",
    type: "lab",
    aliases: ["Chemistry Lab", "LE-22", "LE 22"],
    anchorPanoramaId: null,
    position: null
  }
};

export function findDestination(query: string): Destination | null {
  if (!query) return null;
  
  // Normalize query: lowercase and remove extra whitespace
  const normalizedQuery = query.toLowerCase().replace(/\s+/g, ' ').trim();

  for (const key in destinations) {
    const dest = destinations[key];
    
    // Check exact name match
    if (dest.name.toLowerCase().replace(/\s+/g, ' ').trim() === normalizedQuery) {
      return dest;
    }
    
    // Check aliases
    for (const alias of dest.aliases) {
      if (alias.toLowerCase().replace(/\s+/g, ' ').trim() === normalizedQuery) {
        return dest;
      }
    }
  }
  
  return null;
}
