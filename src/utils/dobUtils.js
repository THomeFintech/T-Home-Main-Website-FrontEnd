/**
 * Utility functions for Date of Birth parsing, formatting, and age calculation
 */

export function calculateAgeFromDob(dob) {
  if (!dob) return "";
  const s = String(dob).trim();
  let day, month, year;

  // Format 1: 8 digits DDMMYYYY (e.g. 27092004)
  if (/^\d{8}$/.test(s)) {
    day = parseInt(s.substring(0, 2), 10);
    month = parseInt(s.substring(2, 4), 10);
    year = parseInt(s.substring(4, 8), 10);
  }
  // Format 2: YYYY-MM-DD or YYYY/MM/DD
  else if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(s)) {
    const parts = s.split(/[-/]/);
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    day = parseInt(parts[2], 10);
  }
  // Format 3: DD-MM-YYYY or DD/MM/YYYY
  else if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(s)) {
    const parts = s.split(/[-/]/);
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    year = parseInt(parts[2], 10);
  }
  // Format 4: YYYY only
  else if (/^\d{4}$/.test(s)) {
    year = parseInt(s, 10);
    const today = new Date();
    return Math.max(18, today.getFullYear() - year);
  }
  // Format 5: Date parseable string
  else {
    const parsed = new Date(s);
    if (!isNaN(parsed.getTime())) {
      day = parsed.getDate();
      month = parsed.getMonth() + 1;
      year = parsed.getFullYear();
    }
  }

  if (year && month && day) {
    const today = new Date();
    let age = today.getFullYear() - year;
    const m = today.getMonth() + 1 - month;
    if (m < 0 || (m === 0 && today.getDate() < day)) {
      age--;
    }
    return age > 0 ? age : "";
  }
  return "";
}

export function formatDobDisplay(dob) {
  if (!dob) return "";
  const s = String(dob).trim();
  if (/^\d{8}$/.test(s)) {
    const day = s.substring(0, 2);
    const month = s.substring(2, 4);
    const year = s.substring(4, 8);
    return `${day}/${month}/${year}`;
  }
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(s)) {
    const parts = s.split(/[-/]/);
    return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
  }
  if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(s)) {
    const parts = s.split(/[-/]/);
    return `${parts[0].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[2]}`;
  }
  return s;
}
