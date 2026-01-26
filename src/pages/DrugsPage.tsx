import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
} from '../components/ui';
import {
  Search,
  PlusCircle,
  Pill,
  Pencil,
  Trash2,
  Download,
  Filter,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { formatDate, getExpirationStatus } from '../utils/formatDate';
import toast from 'react-hot-toast';
import type { FormOption } from '../types';

export function DrugsPage() {
  const queryClient = useQueryClient();
  
  // 1. ROZSZERZONY STAN O SORTOWANIE
  const [searchParams, setSearchParams] = useState({
    page: 0,
    size: 15,
    name: '',
    form: '',
    expired: '',
    sortBy: 'drugName', 
    sortDir: 'asc'      
  });

  const [searchInput, setSearchInput] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

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
        params.set('expired', 'false'); 
        params.set('size', '100'); 
        params.set('page', '0');   
      } else if (searchParams.expired === 'true' || searchParams.expired === 'false') {
        params.append('expired', searchParams.expired);
      }

      // 3. PRZEKAZANIE SORTOWANIA DO BACKENDU
      params.append('sort', `${searchParams.sortBy},${searchParams.sortDir}`);

      return drugsApi.search(Object.fromEntries(params));
    },
    retry: false,
  });

  const filteredDrugs = useMemo(() => {
    if (!data?.content) return [];
    
    if (searchParams.expired === 'expiring-soon') {
      const filtered = data.content.filter((drug) => {
        const status = getExpirationStatus(drug.expirationDate);
        return status === 'expiring-soon';
      });
      // Przy expiring-soon zostawiamy sortowanie po dacie (najpilniejsze na górze)
      return filtered.sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());
    }
    
    return data.content;
  }, [data, searchParams.expired]);

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

  const handleExportPdf = async () => {
  try {
    const params = new URLSearchParams();
    
    // Filtry (muszą być identyczne jak te w useQuery)
    if (searchParams.name) params.append('name', searchParams.name);
    if (searchParams.form) params.append('form', searchParams.form);
    
    if (searchParams.expired === 'expiring-soon') {
      params.append('expired', 'false');
    } else if (searchParams.expired) {
      params.append('expired', searchParams.expired);
    }

    // KLUCZ: To musi być jeden parametr o nazwie 'sort'
    params.append('sort', `${searchParams.sortBy},${searchParams.sortDir}`);
    
    // Zwiększamy limit dla PDF
    params.append('size', '1000'); 
    params.append('page', '0');

    // Wywołujemy api - zamieniamy params na obiekt
    // WAŻNE: Sprawdź czy drugsApi.exportPdf przyjmuje obiekt i zamienia go na ?sort=...
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
  } catch (error) {
    console.error("Błąd exportu PDF:", error);
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
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleExportPdf}><Download className="w-4 h-4" /> Eksport PDF</Button>
          <Link to="/drugs/new"><Button><PlusCircle className="w-4 h-4" /> Dodaj lek</Button></Link>
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
        ) : filteredDrugs.length === 0 ? (
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
                  {filteredDrugs.map((drug) => {
                    const status = getExpirationStatus(drug.expirationDate);
                    return (
                      <tr key={drug.drugId} className="border-b border-dark-700 hover:bg-dark-700/50 transition-colors">
                        <td className="py-4 px-4">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center"><Pill className="w-4 h-4 text-primary-400" /></div>
                             <div>
                               <p className="font-medium text-gray-200">{drug.drugName}</p>
                               <p className="text-sm text-gray-500 truncate max-w-xs">{drug.drugDescription}</p>
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
            
            {/* WIDOK MOBILNY - bez zmian, bo sortowanie i tak działa globalnie przez stan */}
            <div className="md:hidden space-y-3">
              {filteredDrugs.map((drug) => {
                const status = getExpirationStatus(drug.expirationDate);
                return (
                  <div key={drug.drugId} className="p-4 rounded-lg bg-dark-700 space-y-3">
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
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-dark-600">
                      <Link to={`/drugs/${drug.drugId}/edit`}><Button variant="secondary" size="sm"><Pencil className="w-4 h-4" /> Edytuj</Button></Link>
                      <Button variant="danger" size="sm" onClick={() => setDeleteId(drug.drugId)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {searchParams.expired !== 'expiring-soon' && data && data.totalPages > 1 && (
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
    </div>
  );
}