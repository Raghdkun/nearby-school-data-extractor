
import { School } from '../types'; // Assuming School is the primary type we export

/**
 * Converts an array of objects to a CSV string.
 * @param data Array of objects (e.g., School[]).
 * @returns A string in CSV format.
 */
function convertToCSV(data: School[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]) as (keyof School)[];
  const csvRows: string[] = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '""'); // Escape double quotes
      return `"${escaped}"`; // Enclose in double quotes
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Triggers a CSV file download in the browser.
 * @param filename The desired filename for the downloaded CSV.
 * @param rows An array of objects to be converted to CSV.
 */
export function exportToCsv(filename: string, rows: School[]): void {
  if (!rows || rows.length === 0) {
    console.warn("No data provided to exportToCsv.");
    // Optionally throw an error or show a user message
    // throw new Error("No data to export.");
    return;
  }

  const csvString = convertToCSV(rows);
  if (!csvString) {
    console.warn("CSV string is empty after conversion.");
    // Optionally throw an error or show a user message
    return;
  }

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) { // Check for browser compatibility
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // Fallback for older browsers or environments where download attribute is not supported
    console.error("CSV download not supported in this browser.");
    // You could display the CSV data in a textarea for manual copy-pasting as a fallback.
    alert("CSV download is not directly supported. The data will be logged to the console.");
    console.log("CSV Data:\n", csvString);
  }
}
    