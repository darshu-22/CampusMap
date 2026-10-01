import { getAllPanoramas } from '../utils/panorama';
import { getPanoramaAliases } from './panoramaMetadata';

export interface Location {
  id: string;
  name: string;
  image: string;
  aliases?: string[];
}

export function getLocations(): Location[] {
  return getAllPanoramas().map(node => ({
    id: node.id,
    name: node.displayName,
    image: node.imagePath,
    aliases: getPanoramaAliases(node.id)
  }));
}

export const locations: Location[] = getLocations();

