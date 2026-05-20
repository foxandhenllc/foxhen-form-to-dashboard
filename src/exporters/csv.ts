import type { SubmissionRow } from "../lib/types.js";

function parseCsvRows(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const nextCharacter = input[index + 1];

    if (character === "\"") {
      if (inQuotes && nextCharacter === "\"") {
        value += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === "," && !inQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && nextCharacter === "\n") {
        index += 1;
      }
      row.push(value);
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      value = "";
      continue;
    }

    value += character;
  }

  if (inQuotes) {
    throw new Error("CSV has an unmatched quote.");
  }

  row.push(value);
  if (row.some((cell) => cell.length > 0)) {
    rows.push(row);
  }

  return rows;
}

export function parseCsv(input: string): SubmissionRow[] {
  const [headers, ...records] = parseCsvRows(input.trim());

  if (!headers || headers.length === 0) {
    return [];
  }

  const normalizedHeaders = headers.map((header) => header.trim());

  return records.map((record) =>
    normalizedHeaders.reduce<SubmissionRow>((row, header, index) => {
      row[header] = record[index] ?? "";
      return row;
    }, {}),
  );
}

function escapeCsvValue(value: string): string {
  if (!/[",\n\r]/.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, "\"\"")}"`;
}

export function serializeCsv(rows: SubmissionRow[], preferredColumns?: string[]): string {
  const discoveredColumns = rows.flatMap((row) => Object.keys(row));
  const columns = Array.from(new Set([...(preferredColumns ?? []), ...discoveredColumns])).filter(Boolean);

  if (columns.length === 0) {
    return "";
  }

  const lines = [
    columns.map(escapeCsvValue).join(","),
    ...rows.map((row) => columns.map((column) => escapeCsvValue(row[column] ?? "")).join(",")),
  ];

  return `${lines.join("\n")}\n`;
}
