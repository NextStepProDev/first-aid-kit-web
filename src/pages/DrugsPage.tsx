import React, { useState, useEffect } from 'react';
import { Link, useSearchParams as useRouterSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { drugsApi } from '../api/drugs';
import {
  Card,
  Button,
  Input,
  Select,
  Badge,
  Spinner,
  Pagination,
  EmptyState,
  ConfirmDialog,
  Modal,
} from '../components/ui';
import {
  Search,
  PlusCircle,
  Pill,
  Pencil,
  Trash2,
  Download,
  Upload,
  FileText,
  Filter,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { formatDate, getExpirationStatus } from '../utils/formatDate';
import { ImportCsvModal } from '../components/ImportCsvModal';
import { DeleteAllDrugsModal } from '../components/DeleteAllDrugsModal';
import toast from 'react-hot-toast';
import type { Drug, FormOption } from '../types';

export function DrugsPage() {
  const queryClient = useQueryClient();
  const [urlSearchParams, setUrlSearchParams] = useRouterSearchParams();

  // 1. ROZSZERZONY STAN O SORTOWANIE
  const [searchParams, setSearchParams] = useState(() => {
    const formFromUrl = urlSearchParams.get('form') || '';
    return {
      page: 0,
      size: 15,
      name: '',
      form: formFromUrl,
      expired: '',
      sortBy: 'drugName',
      sortDir: 'asc'
    };
  });

  const [searchInput, setSearchInput] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [detailDrug, setDetailDrug] = useState<Drug | null>(null);

  // Clear URL query params after reading them on mount
  useEffect(() => {
    if (urlSearchParams.has('form')) {
      setUrlSearchParams({}, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => ({ ...prev, name: searchInput, page: 0 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // 2. INTELIGENTNA FUNKCJA SORTUJĄCA
  const handleSort = (field: string) => {
    setSearchParams(prev => ({
      ...prev,
      sortBy: field,
      sortDir: prev.sortBy === field && prev.sortDir === 'asc' ? 'desc' : 'asc',
      // Jeśli sortujemy po formie, czyścimy aktualny filtr formy
      form: field === 'drugForm.name' ? '' : prev.form,
      page: 0
    }));
  };

  const { data: forms } = useQuery({
    queryKey: ['drugForms'],
    queryFn: drugsApi.getForms,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['drugs', searchParams],
    queryFn: () => {
      const params = new URLSearchParams();

      params.append('page', searchParams.page.toString());
      params.append('size', searchParams.size.toString());

      if (searchParams.name) params.append('name', searchParams.name);
      if (searchParams.form) params.append('form', searchParams.form);

      if (searchParams.expired === 'expiring-soon') {
        params.append('expiringSoon', 'true');
      } else if (searchParams.expired === 'true' || searchParams.expired === 'false') {
        params.append('expired', searchParams.expired);
      }

      // 3. PRZEKAZANIE SORTOWANIA DO BACKENDU
      params.append('sort', `${searchParams.sortBy},${searchParams.sortDir}`);

      return drugsApi.search(Object.fromEntries(params));
    },
    retry: false,
  });

  const drugs = data?.content ?? [];

  const deleteMutation = useMutation({
    mutationFn: drugsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
      queryClient.invalidateQueries({ queryKey: ['drugStatistics'] });
      toast.success('Lek został usunięty');
      setDeleteId(null);
    },
    onError: () => toast.error('Nie udało się usunąć leku'),
  });

  const deleteAllMutation = useMutation({
    mutationFn: drugsApi.deleteAll,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
      queryClient.invalidateQueries({ queryKey: ['drugStatistics'] });
      toast.success(`Usunięto ${data.deletedCount} leków`);
      setShowDeleteAllModal(false);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Nie udało się usunąć leków';
      toast.error(message === 'Invalid password' ? 'Nieprawidłowe hasło' : message);
    },
  });

  const handleExportPdf = async () => {
  try {
    const params = new URLSearchParams();
    
    // Filtry (muszą być identyczne jak te w useQuery)
    if (searchParams.name) params.append('name', searchParams.name);
    if (searchParams.form) params.append('form', searchParams.form);
    
    if (searchParams.expired === 'expiring-soon') {
      params.append('expiringSoon', 'true');
    } else if (searchParams.expired) {
      params.append('expired', searchParams.expired);
    }

    params.append('sort', `${searchParams.sortBy},${searchParams.sortDir}`);
    params.append('size', '1000');
    params.append('page', '0');

    const blob = await drugsApi.exportPdf(Object.fromEntries(params));
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lista_lekow_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success('PDF został wygenerowany');
  } catch {
    toast.error('Błąd generowania pliku');
  }
};

  const handleExportCsv = async () => {
    try {
      const params = new URLSearchParams();

      // Filtry (identyczne jak dla PDF)
      if (searchParams.name) params.append('name', searchParams.name);
      if (searchParams.form) params.append('form', searchParams.form);

      if (searchParams.expired === 'expiring-soon') {
        params.append('expiringSoon', 'true');
      } else if (searchParams.expired) {
        params.append('expired', searchParams.expired);
      }

      params.append('sort', `${searchParams.sortBy},${searchParams.sortDir}`);
      params.append('size', '1000');
      params.append('page', '0');

      const blob = await drugsApi.exportCsv(Object.fromEntries(params));

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lista_lekow_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('CSV został wygenerowany');
    } catch {
      toast.error('Błąd generowania pliku');
    }
  };

  const statusOptions = [
    { value: '', label: 'Wszystkie' },
    { value: 'false', label: 'Aktywne' },
    { value: 'true', label: 'Po terminie' },
    { value: 'expiring-soon', label: 'Wygasające wkrótce' },
  ];

  const formOptions: FormOption[] = [
    { value: '', label: 'Wszystkie formy' },
    ...(forms || []),
  ];

  // Helper do renderowania ikonki sortowania
  const SortIcon = ({ field }: { field: string }) => {
    if (searchParams.sortBy !== field) return null;
    return searchParams.sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Leki</h1>
          <p className="text-gray-400 mt-1">Zarządzaj lekami w swojej apteczce</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button variant="secondary" onClick={handleExportCsv}><Upload className="w-4 h-4" /> Eksport CSV</Button>
          <Button variant="secondary" onClick={handleExportPdf}><FileText className="w-4 h-4" /> Eksport PDF</Button>
          <Button variant="secondary" onClick={() => setShowImportModal(true)}><Download className="w-4 h-4" /> Import CSV</Button>
          <Link to="/drugs/new"><Button><PlusCircle className="w-4 h-4" /> Dodaj lek</Button></Link>
          <Button variant="danger" onClick={() => setShowDeleteAllModal(true)}><Trash2 className="w-4 h-4" /> Usuń wszystko</Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <Input
              label="Szukaj"
              placeholder="Wpisz nazwę leku lub zastosowanie..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <Select
              label="Forma leku"
              options={formOptions}
              value={searchParams.form}
              onChange={(e) => setSearchParams(prev => ({ ...prev, form: e.target.value, page: 0 }))}
            />
          </div>
          <div className="md:col-span-3">
            <Select
              label="Status ważności"
              options={statusOptions}
              value={searchParams.expired}
              onChange={(e) => setSearchParams(prev => ({ ...prev, expired: e.target.value, page: 0 }))}
            />
          </div>
          <div className="md:col-span-1 flex items-end pb-0.5">
            <Button variant="ghost" size="sm" onClick={() => { setSearchParams({ page: 0, size: 15, name: '', form: '', expired: '', sortBy: 'drugName', sortDir: 'asc' }); setSearchInput(''); }} title="Wyczyść filtry">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : drugs.length === 0 ? (
          <EmptyState
            icon={<Pill className="w-12 h-12" />}
            title="Brak leków"
            description="Nie znaleziono leków spełniających te kryteria."
            action={<Link to="/drugs/new"><Button><PlusCircle className="w-4 h-4" /> Dodaj pierwszy lek</Button></Link>}
          />
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-600">
                    {/* 4. KLIKALNE NAGŁÓWKI Z IKONAMI */}
                    <th 
                      className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-primary-400 transition-colors"
                      onClick={() => handleSort('drugName')}
                    >
                      <div className="flex items-center gap-1">Nazwa <SortIcon field="drugName" /></div>
                    </th>
                    <th 
                      className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-primary-400 transition-colors"
                      onClick={() => handleSort('drugForm.name')}
                    >
                      <div className="flex items-center gap-1">Forma <SortIcon field="drugForm.name" /></div>
                    </th>
                    <th 
                      className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-primary-400 transition-colors"
                      onClick={() => handleSort('expirationDate')}
                    >
                      <div className="flex items-center gap-1">Data ważności <SortIcon field="expirationDate" /></div>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {drugs.map((drug) => {
                    const status = getExpirationStatus(drug.expirationDate);
                    return (
                      <tr key={drug.drugId} className="border-b border-dark-700 hover:bg-dark-700/50 transition-colors">
                        <td className="py-4 px-4">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center"><Pill className="w-4 h-4 text-primary-400" /></div>
                             <div>
                               <p className="font-medium text-gray-200">{drug.drugName}</p>
                               {drug.drugDescription && <p className="text-sm text-gray-500 truncate max-w-xs">{drug.drugDescription}</p>}
                             </div>
                           </div>
                        </td>
                        <td className="py-4 px-4"><Badge>{drug.drugForm}</Badge></td>
                        <td className="py-4 px-4 text-gray-300">{formatDate(drug.expirationDate)}</td>
                        <td className="py-4 px-4">
                          <Badge variant={status === 'expired' ? 'danger' : status === 'expiring-soon' ? 'warning' : 'success'}>
                            {status === 'expired' ? 'Po terminie' : status === 'expiring-soon' ? 'Wygasa wkrótce' : 'Aktywny'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/drugs/${drug.drugId}/edit`}><Button variant="ghost" size="sm"><Pencil className="w-4 h-4" /></Button></Link>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteId(drug.drugId)} className="text-danger-400 hover:text-danger-300"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* WIDOK MOBILNY */}
            <div className="md:hidden space-y-3">
              {/* Sortowanie mobilne */}
              <div className="flex items-center gap-2 pb-1">
                <span className="text-xs text-gray-500 shrink-0">Sortuj:</span>
                {[
                  { field: 'drugName', label: 'Nazwa' },
                  { field: 'drugForm.name', label: 'Forma' },
                  { field: 'expirationDate', label: 'Data' },
                ].map(({ field, label }) => (
                  <button
                    key={field}
                    onClick={() => handleSort(field)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      searchParams.sortBy === field
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'bg-dark-600 text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {label}
                    {searchParams.sortBy === field && (
                      searchParams.sortDir === 'asc'
                        ? <ChevronUp className="w-3 h-3" />
                        : <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                ))}
              </div>

              {drugs.map((drug) => {
                const status = getExpirationStatus(drug.expirationDate);
                return (
                  <div
                    key={drug.drugId}
                    className="p-4 rounded-lg bg-dark-700 space-y-3 cursor-pointer active:bg-dark-600 transition-colors"
                    onClick={() => setDetailDrug(drug)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center"><Pill className="w-5 h-5 text-primary-400" /></div>
                        <div>
                          <p className="font-medium text-gray-200">{drug.drugName}</p>
                          <p className="text-sm text-gray-400">{formatDate(drug.expirationDate)}</p>
                        </div>
                      </div>
                      <Badge variant={status === 'expired' ? 'danger' : status === 'expiring-soon' ? 'warning' : 'success'}>
                        {status === 'expired' ? 'Po terminie' : status === 'expiring-soon' ? 'Wygasa' : 'Aktywny'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2"><Badge>{drug.drugForm}</Badge></div>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-dark-600" onClick={(e) => e.stopPropagation()}>
                      <Link to={`/drugs/${drug.drugId}/edit`}><Button variant="secondary" size="sm"><Pencil className="w-4 h-4" /> Edytuj</Button></Link>
                      <Button variant="danger" size="sm" onClick={() => setDeleteId(drug.drugId)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {data && data.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={data.number}
                  totalPages={data.totalPages}
                  onPageChange={(page) => setSearchParams((prev) => ({ ...prev, page }))}
                />
              </div>
            )}
          </>
        )}
      </Card>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Usuń lek"
        message="Czy na pewno chcesz usunąć ten lek? Tej operacji nie można cofnąć."
        confirmText="Usuń"
        isLoading={deleteMutation.isPending}
      />

      <ImportCsvModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <DeleteAllDrugsModal
        isOpen={showDeleteAllModal}
        onClose={() => setShowDeleteAllModal(false)}
        onConfirm={(password) => deleteAllMutation.mutate(password)}
        isLoading={deleteAllMutation.isPending}
      />

      <Modal
        isOpen={detailDrug !== null}
        onClose={() => setDetailDrug(null)}
        title={detailDrug?.drugName}
        size="md"
      >
        {detailDrug && (() => {
          const status = getExpirationStatus(detailDrug.expirationDate);
          return (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Forma</p>
                <Badge>{detailDrug.drugForm}</Badge>
              </div>
              {detailDrug.drugDescription && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Opis</p>
                  <p className="text-sm text-gray-300">{detailDrug.drugDescription}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-1">Data ważności</p>
                <p className="text-sm text-gray-300">{formatDate(detailDrug.expirationDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <Badge variant={status === 'expired' ? 'danger' : status === 'expiring-soon' ? 'warning' : 'success'}>
                  {status === 'expired' ? 'Po terminie' : status === 'expiring-soon' ? 'Wygasa wkrótce' : 'Aktywny'}
                </Badge>
              </div>
              <div className="flex gap-2 pt-3 border-t border-dark-600">
                <Link to={`/drugs/${detailDrug.drugId}/edit`} className="flex-1">
                  <Button variant="secondary" className="w-full"><Pencil className="w-4 h-4" /> Edytuj</Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={() => { setDeleteId(detailDrug.drugId); setDetailDrug(null); }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}