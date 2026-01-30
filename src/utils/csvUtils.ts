import type { Drug, DrugRequest, DrugForm } from '../types';

// Dozwolone formy leków
const VALID_FORMS: DrugForm[] = [
  'PILLS', 'GEL', 'SYRUP', 'DROPS', 'SUPPOSITORIES', 'SACHETS',
  'CREAM', 'SPRAY', 'OINTMENT', 'LIQUID', 'POWDER', 'INJECTION',
  'BANDAGE', 'INHALER', 'PATCH', 'SOLUTION', 'OTHER'
];

// Nagłówki CSV
const CSV_HEADERS = ['Nazwa', 'Forma', 'Data ważności', 'Opis'];

/**
 * Generuje tekst CSV z tablicy leków (separator: średnik dla polskiego Excela)
 */
export function generateCsv(drugs: Drug[]): string {
  const SEPARATOR = ';';
  const rows = [CSV_HEADERS.join(SEPARATOR)];

  for (const drug of drugs) {
    // Wyciągamy tylko datę (YYYY-MM-DD) z formatu ISO
    const dateOnly = drug.expirationDate.split('T')[0];

    const row = [
      quoteCsvField(drug.drugName.trim()),
      drug.drugForm,
      dateOnly,
      quoteCsvField((drug.drugDescription || '').trim()),
    ];
    rows.push(row.join(SEPARATOR));
  }

  return rows.join('\n');
}

/**
 * Zawsze cytuje pole CSV - bezpieczniejsze dla pól tekstowych
 */
function quoteCsvField(field: string): string {
  // Escape'ujemy cudzysłowy wewnątrz pola (podwajamy je)
  const escaped = field.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Parsuje datę w różnych formatach
 * Obsługuje: YYYY-MM-DD, DD/MM/YYYY, DD.MM.YYYY, DD-MM-YYYY
 */
function parseDate(dateStr: string): { year: number; month: number; day: number } | null {
  // Format YYYY-MM-DD
  let match = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    return { year: parseInt(match[1], 10), month: parseInt(match[2], 10), day: parseInt(match[3], 10) };
  }

  // Format DD/MM/YYYY
  match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    return { year: parseInt(match[3], 10), month: parseInt(match[2], 10), day: parseInt(match[1], 10) };
  }

  // Format DD.MM.YYYY
  match = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (match) {
    return { year: parseInt(match[3], 10), month: parseInt(match[2], 10), day: parseInt(match[1], 10) };
  }

  // Format DD-MM-YYYY
  match = dateStr.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (match) {
    return { year: parseInt(match[3], 10), month: parseInt(match[2], 10), day: parseInt(match[1], 10) };
  }

  return null;
}

/**
 * Wynik parsowania CSV
 */
export interface CsvParseResult {
  valid: DrugRequest[];
  expired: { row: number; drug: DrugRequest }[];
  errors: { row: number; message: string }[];
}

/**
 * Parsuje plik CSV i zwraca tablicę DrugRequest
 */
export async function parseCsvFile(file: File): Promise<CsvParseResult> {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');

  if (lines.length < 2) {
    return { valid: [], expired: [], errors: [{ row: 0, message: 'Plik nie zawiera danych' }] };
  }

  const valid: DrugRequest[] = [];
  const expired: { row: number; drug: DrugRequest }[] = [];
  const errors: { row: number; message: string }[] = [];

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Pomijamy nagłówek (pierwsza linia)
  for (let i = 1; i < lines.length; i++) {
    const rowNumber = i + 1; // Numer wiersza dla użytkownika (1-based)
    const fields = parseCsvLine(lines[i]);

    if (fields.length < 3) {
      errors.push({ row: rowNumber, message: 'Za mało kolumn (wymagane: Nazwa, Forma, Data ważności)' });
      continue;
    }

    const [name, form, expirationDate, description] = fields;

    // Walidacja nazwy
    if (!name || name.trim() === '') {
      errors.push({ row: rowNumber, message: 'Nazwa jest wymagana' });
      continue;
    }

    // Walidacja formy
    const normalizedForm = form.toUpperCase() as DrugForm;
    if (!VALID_FORMS.includes(normalizedForm)) {
      errors.push({ row: rowNumber, message: `Nieznana forma leku: "${form}". Dozwolone: ${VALID_FORMS.join(', ')}` });
      continue;
    }

    // Walidacja daty - obsługa wielu formatów
    const parsedDate = parseDate(expirationDate);
    if (!parsedDate) {
      errors.push({ row: rowNumber, message: `Nieprawidłowy format daty: "${expirationDate}". Dozwolone formaty: YYYY-MM-DD, DD/MM/YYYY, DD.MM.YYYY` });
      continue;
    }

    const { year, month, day } = parsedDate;

    // Sprawdzenie czy data jest poprawna
    const testDate = new Date(year, month - 1, day);
    if (testDate.getFullYear() !== year || testDate.getMonth() !== month - 1 || testDate.getDate() !== day) {
      errors.push({ row: rowNumber, message: `Nieprawidłowa data: "${expirationDate}"` });
      continue;
    }

    const drug: DrugRequest = {
      name: name.trim(),
      form: normalizedForm,
      expirationYear: year,
      expirationMonth: month,
      description: description?.trim() || '',
    };

    // Sprawdzenie czy lek jest przeterminowany
    const isExpired = year < currentYear || (year === currentYear && month < currentMonth);

    if (isExpired) {
      expired.push({ row: rowNumber, drug });
    } else {
      valid.push(drug);
    }
  }

  return { valid, expired, errors };
}

/**
 * Parsuje pojedynczą linię CSV z obsługą cudzysłowów (obsługuje przecinek i średnik)
 */
function parseCsvLine(line: string): string[] {
  // Wykryj separator (średnik lub przecinek)
  const separator = line.includes(';') ? ';' : ',';

  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++; // Pomijamy następny cudzysłów
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === separator) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }

  result.push(current);
  return result;
}

/**
 * Pobiera plik CSV
 */
export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8' }); // BOM dla Excela
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
