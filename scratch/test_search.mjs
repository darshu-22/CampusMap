import fs from 'fs';
import path from 'path';

const rawData = JSON.parse(fs.readFileSync('./front end/Campus-Map-main/src/data/panorama_location_names.json', 'utf8'));

const locationsList = Object.entries(rawData).map(([id, displayName]) => ({
  id,
  name: displayName === '.' ? id : displayName,
  image: `/campus/${id}`
}));

// Known acronym mappings for campus nodes
const ACRONYM_MAP = {
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

const SYNONYMS = {
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

function editDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
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

function getEnrichedAliases(loc) {
  const aliases = new Set();
  const name = loc.name;
  const nameLower = name.toLowerCase().trim();
  aliases.add(nameLower);

  const idLower = loc.id.toLowerCase().replace(/\.jpeg$/i, '').trim();
  aliases.add(idLower);

  const roomMatch = name.match(/\((\d{3}[A-Z]?|\b\d{3}\b)\)/) || name.match(/\b(\d{3})\b/);
  let roomNumber;
  if (roomMatch) {
    roomNumber = roomMatch[1];
    aliases.add(roomNumber);
    aliases.add(`room ${roomNumber}`);
    aliases.add(`rm ${roomNumber}`);
    aliases.add(`classroom ${roomNumber}`);
    aliases.add(`lab ${roomNumber}`);
  }

  const parenMatch = name.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const inside = parenMatch[1].toLowerCase().trim();
    aliases.add(inside);
    const cleanedName = name.replace(/\([^)]+\)/g, '').toLowerCase().trim();
    if (cleanedName) aliases.add(cleanedName);
  }

  for (const [acronym, expandedList] of Object.entries(ACRONYM_MAP)) {
    if (nameLower.includes(acronym) || idLower.includes(acronym)) {
      aliases.add(acronym);
      expandedList.forEach(exp => aliases.add(exp));
    }
  }

  return { aliases: Array.from(aliases), roomNumber };
}

function searchLocations(locationsList, query) {
  if (!query || !query.trim()) {
    return locationsList;
  }

  const rawQuery = query.toLowerCase().trim();
  const queryClean = rawQuery.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const queryTokens = queryClean.split(' ').filter(Boolean);

  const queryRoomMatch = rawQuery.match(/\b(\d{3}[A-Z]?)\b/);
  const queryRoomNum = queryRoomMatch ? queryRoomMatch[1] : null;

  const matches = [];

  for (const loc of locationsList) {
    const { aliases, roomNumber } = getEnrichedAliases(loc);
    const locNameLower = loc.name.toLowerCase();
    const locIdLower = loc.id.toLowerCase();
    let maxScore = 0;

    if (locIdLower === rawQuery || locIdLower === `${rawQuery}.jpeg`) {
      maxScore = Math.max(maxScore, 100);
    }

    if (queryRoomNum && roomNumber && queryRoomNum === roomNumber) {
      maxScore = Math.max(maxScore, 95);
    }

    for (const alias of aliases) {
      if (alias === rawQuery || alias === queryClean) {
        maxScore = Math.max(maxScore, 90);
      } else if (alias.startsWith(queryClean) || locNameLower.startsWith(queryClean)) {
        maxScore = Math.max(maxScore, 80);
      }
    }

    let tokenScore = 0;
    let matchedTokenCount = 0;

    for (const qToken of queryTokens) {
      if (qToken.length < 2 && queryTokens.length > 1) continue;
      let tokenMatched = false;
      const synList = SYNONYMS[qToken] || [];
      const expandedQueryTokens = [qToken, ...synList];

      for (const alias of aliases) {
        const aliasTokens = alias.split(/\s+/);
        for (const eqToken of expandedQueryTokens) {
          if (aliasTokens.includes(eqToken)) {
            tokenScore += 25;
            matchedTokenCount++;
            tokenMatched = true;
            break;
          }
          if (aliasTokens.some(at => at.startsWith(eqToken))) {
            tokenScore += 20;
            matchedTokenCount++;
            tokenMatched = true;
            break;
          }
          if (alias.includes(eqToken) || locNameLower.includes(eqToken)) {
            tokenScore += 15;
            matchedTokenCount++;
            tokenMatched = true;
            break;
          }
          if (eqToken.length >= 4) {
            for (const aToken of aliasTokens) {
              if (aToken.length >= 4) {
                const dist = editDistance(eqToken, aToken);
                const maxDist = eqToken.length >= 6 ? 2 : 1;
                if (dist <= maxDist) {
                  tokenScore += 18 - dist * 3;
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

    if (queryTokens.length > 0 && matchedTokenCount >= queryTokens.length) {
      tokenScore += 30;
    }

    maxScore = Math.max(maxScore, tokenScore);

    if (maxScore > 10) {
      matches.push({ location: loc, score: maxScore });
    }
  }

  matches.sort((a, b) => b.score - a.score);
  return matches.map(m => m.location);
}

const testQueries = [
  "SWO",
  "swo",
  "stu",
  "student",
  "welfare",
  "student welfare",
  "student wellfare",
  "215",
  "Room 215",
  "lab",
  "office",
  "gate"
];

console.log("=== SEARCH TEST RESULTS ===");
for (const q of testQueries) {
  const results = searchLocations(locationsList, q);
  console.log(`\nQuery: "${q}" -> Top 3 Results (${results.length} total matches):`);
  results.slice(0, 3).forEach((r, idx) => {
    console.log(`  ${idx + 1}. [${r.id}] ${r.name}`);
  });
}
