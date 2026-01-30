import React, { useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Modal, Button, Badge } from './ui';
import { Upload, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { parseCsvFile, type CsvParseResult } from '../utils/csvUtils';
import { drugsApi } from '../api/drugs';
import toast from 'react-hot-toast';

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ImportState = 'idle' | 'parsed' | 'importing' | 'done';

export function ImportCsvModal({ isOpen, onClose }: ImportCsvModalProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<ImportState>('idle');
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, success: 0, failed: 0, skippedExpired: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [importErrors, setImportErrors] = useState<{ name: string; message: string }[]>([]);

  const resetState = useCallback(() => {
    setState('idle');
    setParseResult(null);
    setImportProgress({ current: 0, total: 0, success: 0, failed: 0, skippedExpired: 0 });
    setImportErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Wybierz plik CSV');
      return;
    }

    try {
      const result = await parseCsvFile(file);
      setParseResult(result);
      setState('parsed');
    } catch (error) {
      console.error('Parse error:', error);
      toast.error('Błąd podczas wczytywania pliku');
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleImport = useCallback(async () => {
    if (!parseResult || parseResult.valid.length === 0) return;

    setState('importing');
    setImportErrors([]);
    const total = parseResult.valid.length;
    const skippedExpired = parseResult.expired.length;
    let success = 0;
    let failed = 0;
    const errors: { name: string; message: string }[] = [];

    for (let i = 0; i < parseResult.valid.length; i++) {
      const drug = parseResult.valid[i];
      setImportProgress({ current: i + 1, total, success, failed, skippedExpired });

      try {
        await drugsApi.create(drug);
        success++;
      } catch (error: any) {
        failed++;
        // Próbujemy wyciągnąć szczegóły błędu z odpowiedzi API
        let errorMessage = 'Nieznany błąd';
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.response?.data?.fieldErrors?.length > 0) {
          errorMessage = error.response.data.fieldErrors.map((e: any) => e.message).join(', ');
        } else if (error?.message) {
          errorMessage = error.message;
        }
        errors.push({ name: drug.name, message: errorMessage });
      }
    }

    setImportErrors(errors);
    setImportProgress({ current: total, total, success, failed, skippedExpired });
    setState('done');

    // Odświeżenie listy leków
    queryClient.invalidateQueries({ queryKey: ['drugs'] });
    queryClient.invalidateQueries({ queryKey: ['drugStatistics'] });

    if (failed === 0 && skippedExpired === 0) {
      toast.success(`Zaimportowano ${success} leków`);
    } else if (failed === 0) {
      toast.success(`Zaimportowano ${success} leków, pominięto ${skippedExpired} przeterminowanych`);
    } else {
      toast.success(`Zaimportowano ${success} leków, ${failed} błędów, ${skippedExpired} przeterminowanych`);
    }
  }, [parseResult, queryClient]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import CSV" size="lg">
      <div className="space-y-4">
        {state === 'idle' && (
          <>
            {/* Drag & Drop area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                ${isDragging
                  ? 'border-primary-400 bg-primary-500/10'
                  : 'border-dark-500 hover:border-dark-400'
                }
              `}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-300 mb-2">
                Przeciągnij plik CSV tutaj lub kliknij, aby wybrać
              </p>
              <p className="text-sm text-gray-500">
                Format: Nazwa; Forma; Data ważności (YYYY-MM-DD); Opis
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
            />

            {/* Format info */}
            <div className="bg-dark-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Format pliku CSV:</h4>
              <code className="text-xs text-gray-400 block">
                Nazwa;Forma;Data ważności;Opis<br />
                Apap;PILLS;2026-12-31;Lek przeciwbólowy<br />
                Ibuprom;GEL;2027-06-15;Żel przeciwbólowy
              </code>
            </div>
          </>
        )}

        {state === 'parsed' && parseResult && (
          <>
            {/* Parse results summary */}
            <div className="flex flex-wrap items-center gap-4">
              {parseResult.valid.length > 0 && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>{parseResult.valid.length} do importu</span>
                </div>
              )}
              {parseResult.expired.length > 0 && (
                <div className="flex items-center gap-2 text-orange-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{parseResult.expired.length} przeterminowanych (pominięte)</span>
                </div>
              )}
              {parseResult.errors.length > 0 && (
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>{parseResult.errors.length} błędów</span>
                </div>
              )}
            </div>

            {/* Expired drugs warning */}
            {parseResult.expired.length > 0 && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-orange-400 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Przeterminowane leki - zostaną pominięte ({parseResult.expired.length}):
                </h4>
                <ul className="text-xs text-gray-400 space-y-1 max-h-24 overflow-y-auto">
                  {parseResult.expired.slice(0, 10).map((item, i) => (
                    <li key={i}>
                      <span className="text-orange-300">{item.drug.name}</span>
                      <span className="text-gray-500"> - ważny do {item.drug.expirationYear}-{String(item.drug.expirationMonth).padStart(2, '0')}</span>
                    </li>
                  ))}
                  {parseResult.expired.length > 10 && (
                    <li className="text-gray-500">... i {parseResult.expired.length - 10} więcej</li>
                  )}
                </ul>
              </div>
            )}

            {/* Errors list */}
            {parseResult.errors.length > 0 && (
              <div className="bg-dark-700 rounded-lg p-4 max-h-32 overflow-y-auto">
                <h4 className="text-sm font-medium text-red-400 mb-2">Błędy walidacji:</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  {parseResult.errors.slice(0, 10).map((error, i) => (
                    <li key={i}>
                      <span className="text-gray-500">Wiersz {error.row}:</span> {error.message}
                    </li>
                  ))}
                  {parseResult.errors.length > 10 && (
                    <li className="text-gray-500">... i {parseResult.errors.length - 10} więcej</li>
                  )}
                </ul>
              </div>
            )}

            {/* Preview table */}
            {parseResult.valid.length > 0 && (
              <div className="bg-dark-700 rounded-lg overflow-hidden">
                <div className="px-4 py-2 border-b border-dark-600">
                  <h4 className="text-sm font-medium text-gray-300">
                    Podgląd ({Math.min(parseResult.valid.length, 5)} z {parseResult.valid.length}):
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-dark-600">
                        <th className="text-left py-2 px-4 text-gray-400 font-medium">Nazwa</th>
                        <th className="text-left py-2 px-4 text-gray-400 font-medium">Forma</th>
                        <th className="text-left py-2 px-4 text-gray-400 font-medium">Data ważności</th>
                        <th className="text-left py-2 px-4 text-gray-400 font-medium">Opis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parseResult.valid.slice(0, 5).map((drug, i) => (
                        <tr key={i} className="border-b border-dark-700 last:border-0">
                          <td className="py-2 px-4 text-gray-300">{drug.name}</td>
                          <td className="py-2 px-4"><Badge>{drug.form}</Badge></td>
                          <td className="py-2 px-4 text-gray-300">
                            {drug.expirationYear}-{String(drug.expirationMonth).padStart(2, '0')}
                          </td>
                          <td className="py-2 px-4 text-gray-400 truncate max-w-[150px]">
                            {drug.description || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={resetState}>
                Wybierz inny plik
              </Button>
              <Button
                onClick={handleImport}
                disabled={parseResult.valid.length === 0}
              >
                Importuj {parseResult.valid.length} leków
              </Button>
            </div>
          </>
        )}

        {state === 'importing' && (
          <div className="py-8">
            <div className="text-center mb-4">
              <p className="text-gray-300">Importowanie leków...</p>
              <p className="text-sm text-gray-500 mt-1">
                {importProgress.current} / {importProgress.total}
              </p>
            </div>
            <div className="w-full bg-dark-600 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all"
                style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {state === 'done' && (
          <div className="py-6">
            <div className="text-center mb-4">
              <CheckCircle className="w-16 h-16 mx-auto text-green-400 mb-4" />
              <p className="text-lg text-gray-200 mb-2">Import zakończony</p>
              <div className="text-gray-400 space-y-1">
                <p>Dodano: <span className="text-green-400">{importProgress.success}</span></p>
                {importProgress.skippedExpired > 0 && (
                  <p>Pominięto przeterminowanych: <span className="text-orange-400">{importProgress.skippedExpired}</span></p>
                )}
                {importProgress.failed > 0 && (
                  <p>Błędów: <span className="text-red-400">{importProgress.failed}</span></p>
                )}
              </div>
            </div>

            {/* Szczegóły błędów importu */}
            {importErrors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4 text-left">
                <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Szczegóły błędów:
                </h4>
                <ul className="text-xs text-gray-400 space-y-1 max-h-32 overflow-y-auto">
                  {importErrors.map((error, i) => (
                    <li key={i}>
                      <span className="text-red-300">{error.name}</span>
                      <span className="text-gray-500"> - {error.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-center">
              <Button onClick={handleClose}>
                Zamknij
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
