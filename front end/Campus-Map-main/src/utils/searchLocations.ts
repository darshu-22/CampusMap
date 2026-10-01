import type { Location } from '../data/locations';
import { destinations } from '../data/destinations';
import { getPanoramaAliases } from '../data/panoramaMetadata';

export interface SearchMatch {
  location: Location;
  score: number;
  matchedAlias?: string;
}

// Known acronym mappings for campus nodes
const ACRONYM_MAP: Record<string, string[]> = {
  'swo': ['student welfare office', 'student welfare', 'welfare office'],
  'coe': ['center of excellence', 'cloud and data engineering lab'],
  'dsp': ['digital signal processing', 'dsp lab'],
  'nsoj': ['national school of journalism'],
  'mca': ['master of computer applications', 'mca lab'],
  'mba': ['master of business administration', 'mba block', 'mba entrance', 'mba corridor'],
  'vyom': ['vyom research lab', 'vyom lab'],
  'le': ['le building', 'le hub'],
  'bf': ['basement floor', 'basement level'],
  'ff': ['1st floor', 'first floor'],
  'gf': ['ground floor'],
};

// Common word expansions/synonyms
const SYNONYMS: Record<string, string[]> = {
  'canteen': ['food', 'mess', 'dining', 'cafeteria', 'eatery', 'snack', 'naveenshop'],
  'mess': ['canteen', 'dining hall', 'food'],
  'hall': ['seminar hall', 'auditorium'],
  'office': ['swo', 'admission', 'accounts', 'principal', 'counselling', 'security', 'dept office'],
  'lab': ['laboratory', 'dsp', 'coe', 'vyom', 'mca', 'circuits', 'machine shop'],
  'laboratory': ['lab'],
  'gate': ['entrance', 'main gate', 'exit'],
  'stairs': ['staircase', 'stair'],
  'staircase': ['stairs', 'stair'],
  'lift': ['elevator'],
  'sports': ['gym', 'games', 'sports room'],
  'hostel': ['boys hostel', 'dormitory'],
  'temple': ['au2', 'shrine'],
  'parking': ['vehicle parking', 'bike parking', 'car parking'],
  'exam': ['examination', 'test'],
  'fee': ['fees', 'accounts', 'payment'],
};

// Levenshtein edit distance for typo tolerance
function editDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Extracts all searchable metadata tokens & aliases for a location node.
 */
function getEnrichedAliases(loc: Location): { aliases: string[]; explicitAliases: Set<string>; roomNumber?: string } {
  const aliases = new Set<string>();
  const explicitAliases = new Set<string>();
  const name = loc.name;
  const nameLower = name.toLowerCase().trim();
  aliases.add(nameLower);
  explicitAliases.add(nameLower);

  // Add explicit aliases from panorama_location_names.json (loc.aliases or via getPanoramaAliases)
  const rawPanoAliases = loc.aliases || (loc.id ? getPanoramaAliases(loc.id) : []);
  for (const aliasItem of rawPanoAliases) {
    const aLower = aliasItem.toLowerCase().trim();
    if (aLower && aLower !== '.') {
      aliases.add(aLower);
      explicitAliases.add(aLower);
    }
  }

  // Strip filename extensions if ID is used
  const idLower = loc.id.toLowerCase().replace(/\.jpeg$/i, '').trim();
  aliases.add(idLower);

  // Extract room numbers in parentheses like (215), (102), (326), (306), (103)
  const roomMatch = name.match(/\((\d{3}[A-Z]?|\b\d{3}\b)\)/) || name.match(/\b(\d{3})\b/);
  let roomNumber: string | undefined;
  if (roomMatch) {
    roomNumber = roomMatch[1];
    aliases.add(roomNumber);
    aliases.add(`room ${roomNumber}`);
    aliases.add(`rm ${roomNumber}`);
    aliases.add(`classroom ${roomNumber}`);
    aliases.add(`lab ${roomNumber}`);
  }

  // Extract text inside parentheses, e.g. (SWO) -> SWO
  const parenMatch = name.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const inside = parenMatch[1].toLowerCase().trim();
    aliases.add(inside);
    // Remove parentheses from main name to create cleaner alias
    const cleanedName = name.replace(/\([^)]+\)/g, '').toLowerCase().trim();
    if (cleanedName) aliases.add(cleanedName);
  }

  // Add explicit aliases from destinations.ts if matching anchorPanoramaId or ID
  for (const destKey in destinations) {
    const dest = destinations[destKey];
    if (dest.anchorPanoramaId === loc.id || dest.id.toLowerCase() === idLower) {
      dest.aliases.forEach(a => {
        const dLower = a.toLowerCase().trim();
        aliases.add(dLower);
        explicitAliases.add(dLower);
      });
    }
  }

  // Check Acronym Map
  for (const [acronym, expandedList] of Object.entries(ACRONYM_MAP)) {
    if (nameLower.includes(acronym) || idLower.includes(acronym)) {
      aliases.add(acronym);
      expandedList.forEach(exp => aliases.add(exp));
    }
  }

  return { aliases: Array.from(aliases), explicitAliases, roomNumber };
}

/**
 * Intelligent location search with fuzzy matching, acronym expansion,
 * room number recognition, and relevance ranking.
 */
export function searchLocations(locationsList: Location[], query: string): Location[] {
  if (!query || !query.trim()) {
    return locationsList;
  }

  const rawQuery = query.toLowerCase().trim();
  // Normalize query tokens (remove non-alphanumeric except spaces)
  const queryClean = rawQuery.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const queryTokens = queryClean.split(' ').filter(Boolean);

  // Extract query room number if user typed e.g. "Room 215" -> "215"
  const queryRoomMatch = rawQuery.match(/\b(\d{3}[A-Z]?)\b/);
  const queryRoomNum = queryRoomMatch ? queryRoomMatch[1] : null;

  const matches: SearchMatch[] = [];

  for (const loc of locationsList) {
    const { aliases, explicitAliases, roomNumber } = getEnrichedAliases(loc);
    const locNameLower = loc.name.toLowerCase();
    const locIdLower = loc.id.toLowerCase();
    let maxScore = 0;
    let bestMatchedAlias: string | undefined;

    // 1. Exact ID match (e.g. "swo.jpeg" or "swo")
    if (locIdLower === rawQuery || locIdLower === `${rawQuery}.jpeg`) {
      maxScore = Math.max(maxScore, 130);
      bestMatchedAlias = loc.id;
    }

    // 2. Room number exact match (e.g. user typed "215" or "room 215")
    if (queryRoomNum && roomNumber && queryRoomNum === roomNumber) {
      maxScore = Math.max(maxScore, 125);
      bestMatchedAlias = `Room ${roomNumber}`;
    }

    // 3. Exact Primary Name or Explicit Alias match
    for (const expAlias of explicitAliases) {
      if (expAlias === rawQuery || expAlias === queryClean) {
        maxScore = Math.max(maxScore, expAlias === locNameLower ? 120 : 115);
        bestMatchedAlias = expAlias;
      }
    }

    // 4. Exact Derived Alias or Prefix match
    for (const alias of aliases) {
      if (alias === rawQuery || alias === queryClean) {
        maxScore = Math.max(maxScore, 95);
        bestMatchedAlias = alias;
      } else if (alias.startsWith(queryClean) || locNameLower.startsWith(queryClean)) {
        maxScore = Math.max(maxScore, 85);
        bestMatchedAlias = alias;
      }
    }

    // 4. Token Overlap & Fuzzy matching
    let tokenScore = 0;
    let matchedTokenCount = 0;

    for (const qToken of queryTokens) {
      // Ignore trivial 1-letter tokens unless query is single letter
      if (qToken.length < 2 && queryTokens.length > 1) continue;

      let tokenMatched = false;

      // Check if qToken matches any synonym or expansion
      const synList = SYNONYMS[qToken] || [];
      const expandedQueryTokens = [qToken, ...synList];

      for (const alias of aliases) {
        const isExplicit = explicitAliases.has(alias);
        const aliasTokens = alias.split(/\s+/);

        for (const eqToken of expandedQueryTokens) {
          // Exact token match in alias
          if (aliasTokens.includes(eqToken)) {
            tokenScore += 25 + (isExplicit ? 10 : 0);
            matchedTokenCount++;
            tokenMatched = true;
            break;
          }
          // Prefix token match (e.g., "stu" matches "student")
          if (aliasTokens.some(at => at.startsWith(eqToken))) {
            tokenScore += 20 + (isExplicit ? 10 : 0);
            matchedTokenCount++;
            tokenMatched = true;
            break;
          }
          // Substring match in location name or alias
          if (alias.includes(eqToken) || locNameLower.includes(eqToken)) {
            tokenScore += 15 + (isExplicit ? 10 : 0);
            matchedTokenCount++;
            tokenMatched = true;
            break;
          }
          // Fuzzy edit distance for typos (for words >= 4 chars)
          if (eqToken.length >= 4) {
            for (const aToken of aliasTokens) {
              if (aToken.length >= 4) {
                const dist = editDistance(eqToken, aToken);
                // Allow 1 typo for 4-5 char words, 2 typos for 6+ char words
                const maxDist = eqToken.length >= 6 ? 2 : 1;
                if (dist <= maxDist) {
                  tokenScore += 18 - dist * 3 + (isExplicit ? 10 : 0);
                  matchedTokenCount++;
                  tokenMatched = true;
                  break;
                }
              }
            }
          }
          if (tokenMatched) break;
        }
        if (tokenMatched) break;
      }
    }

    // All query tokens matched bonus
    if (queryTokens.length > 0 && matchedTokenCount >= queryTokens.length) {
      tokenScore += 30;
    }

    maxScore = Math.max(maxScore, tokenScore);

    if (maxScore > 10) {
      matches.push({
        location: loc,
        score: maxScore,
        matchedAlias: bestMatchedAlias
      });
    }
  }

  // Sort descending by score, and break ties alphabetically by location name
  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.location.name.localeCompare(b.location.name);
  });

  return matches.map(m => m.location);
}
