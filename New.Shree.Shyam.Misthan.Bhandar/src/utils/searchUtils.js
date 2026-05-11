export const fuzzyMatch = (query, text) => {
  if (!query || !text) return { isMatch: false, score: 0, indices: [] };
  
  const qObj = query.toLowerCase().trim();
  const tObj = text.toLowerCase();
  
  if (qObj.length === 0) return { isMatch: false, score: 0, indices: [] };

  // 1. Exact substring match (Highest priority)
  const exactIndex = tObj.indexOf(qObj);
  if (exactIndex !== -1) {
    const indices = [];
    for (let i = 0; i < qObj.length; i++) {
        indices.push(exactIndex + i);
    }
    return { isMatch: true, score: 100, indices };
  }

  // 2. Subsequence match (Handles skipped characters like "kju" for "kaju")
  let qIdx = 0;
  let tIdx = 0;
  const subIndices = [];
  while (tIdx < tObj.length && qIdx < qObj.length) {
    if (tObj[tIdx] === qObj[qIdx]) {
      subIndices.push(tIdx);
      qIdx++;
    }
    tIdx++;
  }
  
  const isSubMatch = qIdx === qObj.length;
  // Make sure they are relatively close together to avoid matching everything
  if (isSubMatch && (subIndices[subIndices.length - 1] - subIndices[0] < qObj.length * 2)) {
     return { isMatch: true, score: 50, indices: subIndices };
  }

  // 3. Typo match using Levenshtein distance on words
  const words = text.split(/(\s+)/); // Preserve spaces for index accuracy
  let wordIndices = [];
  let bestDist = Infinity;
  let matchFound = false;
  
  let currentWordOffset = 0;
  for(let i=0; i < words.length; i++) {
     const w = words[i];
     // Skip whitespace tokens
     if (w.trim().length === 0) {
         currentWordOffset += w.length;
         continue;
     }
     
     const dist = levenshtein(qObj, w.toLowerCase());
     const allowed = qObj.length <= 4 ? 1 : 2; // Allow 1 typo for small words, 2 for larger
     
     // Also check distance relative to length. If word is huge, it shouldn't match a tiny query.
     if (dist <= allowed && Math.abs(qObj.length - w.length) <= allowed && dist < bestDist) {
         matchFound = true;
         bestDist = dist;
         wordIndices = [];
         // For typo, just highlight the whole matching word to avoid messy disjointed character highlighting
         for(let j=0; j < w.length; j++){
             wordIndices.push(currentWordOffset + j);
         }
     }
     currentWordOffset += w.length;
  }
  
  if (matchFound) {
      return { isMatch: true, score: 25 - bestDist, indices: wordIndices };
  }
  
  return { isMatch: false, score: 0, indices: [] };
};

// Standard Levenshtein distance algorithm
function levenshtein(a, b) {
    const matrix = [];
    for(let i=0; i<=b.length; i++) {
        matrix[i] = [i];
    }
    for(let j=0; j<=a.length; j++) {
        matrix[0][j] = j;
    }
    for(let i=1; i<=b.length; i++) {
        for(let j=1; j<=a.length; j++) {
            if(b.charAt(i-1) === a.charAt(j-1)) {
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i-1][j-1] + 1,
                    Math.min(matrix[i][j-1] + 1, matrix[i-1][j] + 1)
                );
            }
        }
    }
    return matrix[b.length][a.length];
}
