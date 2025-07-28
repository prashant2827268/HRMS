export function parseCustomDate(dateStr) {
  const [day, month, year] = dateStr.split("/");

  // Adjust year (assuming "25" means 2025, not 1925)
  const fullYear = parseInt(year.length === 2 ? `20${year}` : year);

  // Construct valid JS Date object (month is 0-based)
  return new Date(fullYear, parseInt(month) - 1, parseInt(day));
}

