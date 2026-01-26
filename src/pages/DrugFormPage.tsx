import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { drugsApi } from '../api/drugs';
import { Card, Button, Input, Select, Textarea, Spinner } from '../components/ui';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import type { ApiError } from '../types';

const currentYear = new Date().getFullYear();

const drugSchema = z.object({
  name: z
    .string()
    .min(2, 'Nazwa musi mieć min. 2 znaki')
    .max(100, 'Nazwa może mieć max. 100 znaków'),
  form: z.string().min(1, 'Wybierz formę leku'),
  expirationYear: z.string().min(1, 'Wybierz rok'),
  expirationMonth: z.string().min(1, 'Wybierz miesiąc'),
  description: z
    .string()
    .min(1, 'Opis jest wymagany')
    .max(2000, 'Opis może mieć max. 2000 znaków'),
});

type DrugFormData = z.infer<typeof drugSchema>;

export function DrugFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: forms, isLoading: isLoadingForms } = useQuery({
    queryKey: ['drugForms'],
    queryFn: drugsApi.getForms,
  });

  const { data: drug, isLoading: isLoadingDrug } = useQuery({
    queryKey: ['drug', id],
    queryFn: () => drugsApi.getById(Number(id)),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DrugFormData>({
    resolver: zodResolver(drugSchema),
    defaultValues: {
      name: '',
      form: '',
      expirationYear: String(currentYear),
      expirationMonth: '1',
      description: '',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (drug) {
      const expDate = new Date(drug.expirationDate);
      reset({
        name: drug.drugName,
        form: drug.drugForm,
        expirationYear: String(expDate.getFullYear()),
        expirationMonth: String(expDate.getMonth() + 1),
        description: drug.drugDescription,
      });
    }
  }, [drug, reset]);

  const createMutation = useMutation({
    mutationFn: drugsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
      queryClient.invalidateQueries({ queryKey: ['drugStatistics'] });
      toast.success('Lek został dodany');
      navigate('/drugs');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || 'Nie udało się dodać leku';
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string; form: string; expirationYear: number; expirationMonth: number; description: string } }) =>
      drugsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
      queryClient.invalidateQueries({ queryKey: ['drug', id] });
      queryClient.invalidateQueries({ queryKey: ['drugStatistics'] });
      toast.success('Lek został zaktualizowany');
      navigate('/drugs');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message || 'Nie udało się zaktualizować leku';
      toast.error(message);
    },
  });

  const onSubmit = (data: DrugFormData) => {
    const drugRequest = {
      name: data.name,
      form: data.form.toUpperCase(),
      expirationYear: Number(data.expirationYear),
      expirationMonth: Number(data.expirationMonth),
      description: data.description,
    };

    if (isEdit) {
      updateMutation.mutate({ id: Number(id), data: drugRequest });
    } else {
      createMutation.mutate(drugRequest);
    }
  };

  const yearOptions = Array.from({ length: 11 }, (_, i) => ({
    value: String(currentYear + i),
    label: String(currentYear + i),
  }));

  const monthOptions = [
    { value: '1', label: 'Styczeń' },
    { value: '2', label: 'Luty' },
    { value: '3', label: 'Marzec' },
    { value: '4', label: 'Kwiecień' },
    { value: '5', label: 'Maj' },
    { value: '6', label: 'Czerwiec' },
    { value: '7', label: 'Lipiec' },
    { value: '8', label: 'Sierpień' },
    { value: '9', label: 'Wrzesień' },
    { value: '10', label: 'Październik' },
    { value: '11', label: 'Listopad' },
    { value: '12', label: 'Grudzień' },
  ];

  if (isEdit && isLoadingDrug) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">
            {isEdit ? 'Edytuj lek' : 'Dodaj nowy lek'}
          </h1>
          <p className="text-gray-400 mt-1">
            {isEdit
              ? 'Zaktualizuj informacje o leku'
              : 'Wprowadź informacje o nowym leku'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Nazwa leku"
            placeholder="np. Ibuprofen, Paracetamol"
            error={errors.name?.message}
            {...register('name')}
          />

          <Select
            label="Forma leku"
            placeholder="Wybierz formę"
            options={forms || []}
            error={errors.form?.message}
            disabled={isLoadingForms}
            {...register('form')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Rok ważności"
              options={yearOptions}
              error={errors.expirationYear?.message}
              {...register('expirationYear')}
            />
            <Select
              label="Miesiąc ważności"
              options={monthOptions}
              error={errors.expirationMonth?.message}
              {...register('expirationMonth')}
            />
          </div>

          <Textarea
            label="Opis"
            placeholder="Opisz zastosowanie leku, dawkowanie, uwagi..."
            rows={4}
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={
                isSubmitting ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              <Save className="w-4 h-4" />
              {isEdit ? 'Zapisz zmiany' : 'Dodaj lek'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
