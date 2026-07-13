/**
 * Parental Legacy & Life Factors Calculator
 * 
 * Deterministic calculation engine that generates 7 life factor values
 * based on a Date of Birth input. Uses a seeded PRNG (Mulberry32) so
 * the same DOB always produces identical results.
 * 
 * Algorithm Design Decisions:
 * 1. The full DOB string is hashed into a 32-bit seed using a DJB2-style hash.
 * 2. A Mulberry32 PRNG generates pseudo-random values from that seed.
 * 3. Each factor's Total is generated within its [min, max] range.
 * 4. All 7 Totals are proportionally normalized to sum to exactly 100.
 * 5. Each Total is split into Mother/Father based on the odd/even day rule:
 *    - Odd day → Mother gets 51–58% of each factor's Total
 *    - Even day → Father gets 51–58% of each factor's Total
 * 6. Values are rounded to 3 decimal places with remainder correction
 *    on the last row to maintain exact grand total of 100.000.
 */

// Factor definitions with name and valid Total ranges
export const FACTORS = [
  { name: 'Genetic Inheritance',     min: 9.333,  max: 10.777 },
  { name: 'Constitutional Vitality', min: 8.111,  max: 9.111  },
  { name: 'Mental Patterns',         min: 6.111,  max: 7.111  },
  { name: 'Intellectual Capacity',   min: 6.333,  max: 6.999  },
  { name: 'Emotional Foundation',    min: 7.111,  max: 7.999  },
  { name: 'Spiritual Lineage',       min: 5.011,  max: 6.011  },
  { name: 'Soul Connections',        min: 5.111,  max: 6.222  },
];

/**
 * DJB2 hash — produces a 32-bit integer from a string.
 * Deterministic: same string always yields the same hash.
 */
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0; // hash * 33 + c
  }
  return hash >>> 0; // convert to unsigned 32-bit
}

/**
 * Mulberry32 — a simple seeded PRNG.
 * Returns a function that produces values in [0, 1) on each call.
 */
function mulberry32(seed) {
  let state = seed | 0;
  return function () {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Round a number to 3 decimal places.
 */
function round3(n) {
  return Math.round(n * 1000) / 1000;
}

/**
 * Main calculation function.
 * 
 * @param {Date} dob - The user's date of birth
 * @returns {{ factors: Array, motherTotal: number, fatherTotal: number, grandTotal: number, dominantParent: string }}
 */
export function calculateFactors(dob) {
  const day = dob.getDate();
  const month = dob.getMonth() + 1;
  const year = dob.getFullYear();

  // Deterministic seed from the full DOB
  const dobString = `${day}/${month}/${year}`;
  const seed = hashString(dobString);
  const rng = mulberry32(seed);

  // Odd day → Mother higher; Even day → Father higher
  const isOddDay = day % 2 !== 0;

  // Step 1: Generate raw totals within each factor's [min, max] range
  const rawTotals = FACTORS.map((f) => {
    return f.min + rng() * (f.max - f.min);
  });

  // Step 2: Normalize so all totals sum to exactly 100
  const rawSum = rawTotals.reduce((a, b) => a + b, 0);
  const normalizedTotals = rawTotals.map((t) => (t / rawSum) * 100);

  // Step 3: Split each total into Mother/Father
  // The "winning" parent gets 51–58% of each factor (seeded per factor)
  const results = normalizedTotals.map((total) => {
    const skew = 0.51 + rng() * 0.07; // 51% to 58%
    let mother, father;

    if (isOddDay) {
      mother = total * skew;
      father = total - mother;
    } else {
      father = total * skew;
      mother = total - father;
    }

    return { mother, father, total };
  });

  // Step 4: Round to 3 decimal places
  let motherRunning = 0;
  let fatherRunning = 0;

  const factors = results.map((r, i) => {
    if (i < results.length - 1) {
      const m = round3(r.mother);
      const f = round3(r.father);
      const t = round3(m + f);
      motherRunning += m;
      fatherRunning += f;
      return {
        name: FACTORS[i].name,
        mother: m,
        father: f,
        total: t,
      };
    } else {
      // Last row: apply remainder correction so grand total = 100.000
      const m = round3(100 - motherRunning - fatherRunning - round3(r.father));
      const f = round3(100 - motherRunning - fatherRunning - m);
      // Recalculate to ensure mother + father for last row is correct
      const lastMother = round3(100 - fatherRunning - round3(r.father) - motherRunning);
      // Actually, let's do this more carefully:
      const remainingTotal = round3(100 - motherRunning - fatherRunning);
      const lastFather = round3(r.father / (r.mother + r.father) * remainingTotal);
      const lastMotherFinal = round3(remainingTotal - lastFather);
      
      return {
        name: FACTORS[i].name,
        mother: lastMotherFinal,
        father: lastFather,
        total: round3(lastMotherFinal + lastFather),
      };
    }
  });

  const motherTotal = round3(factors.reduce((sum, f) => sum + f.mother, 0));
  const fatherTotal = round3(factors.reduce((sum, f) => sum + f.father, 0));
  
  // Final safety: ensure grand total is exactly 100
  // If rounding caused a tiny drift, adjust the last factor
  const grandTotal = round3(motherTotal + fatherTotal);
  if (grandTotal !== 100) {
    const diff = round3(100 - grandTotal);
    factors[factors.length - 1].mother = round3(factors[factors.length - 1].mother + diff);
    factors[factors.length - 1].total = round3(factors[factors.length - 1].mother + factors[factors.length - 1].father);
  }

  // Recalculate finals
  const finalMotherTotal = round3(factors.reduce((sum, f) => sum + f.mother, 0));
  const finalFatherTotal = round3(factors.reduce((sum, f) => sum + f.father, 0));

  return {
    factors,
    motherTotal: finalMotherTotal,
    fatherTotal: finalFatherTotal,
    grandTotal: round3(finalMotherTotal + finalFatherTotal),
    dominantParent: finalMotherTotal > finalFatherTotal ? 'Mother' : 'Father',
    dob: dob.toISOString(),
  };
}
