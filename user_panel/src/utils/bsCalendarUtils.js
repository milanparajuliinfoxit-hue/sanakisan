
// Constants
export const BS_MONTHS = [
  "बैशाख", "जेठ", "असार", "श्रावण", "भाद्र", "आश्विन",
  "कार्तिक", "मंसिर", "पुष", "माघ", "फाल्गुन", "चैत्र",
];

export const BS_MONTHS_EN = [
  "Baisakh", "Jestha", "Asar", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra",
];

export const BS_DAYS = ["आइत", "सोम", "मंगल", "बुध", "बिहि", "शुक्र", "शनि"];

const BS_MONTH_DAYS = {
  2079: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2080: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2081: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2084: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2085: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
};
const DEFAULT_BS_DAYS = [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30];

export function getDaysInBSMonth(year, month0) {
  return (BS_MONTH_DAYS[year] || DEFAULT_BS_DAYS)[month0];
}

export function adToBs(adDate) {
  const refAD = new Date(2026, 5, 9);
  const refBS = { year: 2083, month: 1, day: 26 };

  let diffDays = Math.floor((adDate - refAD) / 86400000);
  let year = refBS.year;
  let month = refBS.month;
  let day = refBS.day;

  if (diffDays < 0) {
    while (diffDays < 0) {
      month--;
      if (month < 0) {
        month = 11;
        year--;
      }
      const dim = getDaysInBSMonth(year, month);
      day = dim + diffDays + 1;
      diffDays = 0;
    }
    return { year, month, day };
  }

  while (diffDays > 0) {
    const dim = getDaysInBSMonth(year, month);
    const left = dim - (day - 1);
    if (diffDays < left) {
      day += diffDays;
      diffDays = 0;
    } else {
      diffDays -= left;
      day = 1;
      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
    }
  }
  return { year, month, day };
}

export function bsToAd(bsYear, bsMonth0, bsDay) {
  const refAD = new Date(2026, 5, 9);
  let days = 0;
  let y = 2083;
  let m = 1;
  let d = 26;

  while (y < bsYear || (y === bsYear && m < bsMonth0)) {
    days += getDaysInBSMonth(y, m);
    m++;
    if (m > 11) {
      m = 0;
      y++;
    }
  }

  days += bsDay - d;
  return new Date(refAD.getTime() + days * 86400000);
}

export function nepaliDigits(n) {
  const d = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(n).split("").map(c => d[+c] ?? c).join("");
}