import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { drugsApi } from '../api/drugs';
import { Card, Button, Input, Select, Textarea, Spinner } from '../components/ui';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import type { ApiError } from '../types';

const currentYear = new Date().getFullYear();

const drugSchema = (t: (key: string) => string) => z.object({
  name: z
    .string()
    .min(2, t('drugs:form.validation.nameMinLength'))
    .max(100, t('drugs:form.validation.nameMaxLength')),
  form: z.string().min(1, t('drugs:form.validation.formRequired')),
  expirationYear: z.string().min(1, t('drugs:form.validation.yearRequired')),
  expirationMonth: z.string().min(1, t('drugs:form.validation.monthRequired')),
  description: z
    .string()
    .trim()
    .max(2000, t('drugs:form.validation.descriptionMaxLength')),
}).refine((data) => {
  const year = Number(data.expirationYear);
  const month = Number(data.expirationMonth);
  const now = new Date();
  if (year > now.getFullYear()) return true;
  if (year === now.getFullYear()) return month >= (now.getMonth() + 1);
  return false;
}, {
  message: t('drugs:form.validation.dateInPast'),
  path: ['expirationMonth'],
});

type DrugFormData = {
  name: string;
  form: string;
  expirationYear: string;
  expirationMonth: string;
  description: string;
};

export function DrugFormPage() {
  const { t } = useTranslation(['drugs', 'common']);
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
    resolver: zodResolver(drugSchema(t)),
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
        form: drug.drugForm.toLowerCase(),
        expirationYear: String(expDate.getFullYear()),
        expirationMonth: String(expDate.getMonth() + 1),
        description: drug.drugDescription ?? '',
      });
    }
  }, [drug, reset]);

  const createMutation = useMutation({
    mutationFn: drugsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
      queryClient.invalidateQueries({ queryKey: ['drugStatistics'] });
      toast.success(t('drugs:messages.addSuccess'));
      navigate('/drugs');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || t('drugs:messages.addError');
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
      toast.success(t('drugs:messages.updateSuccess'));
      navigate('/drugs');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message || t('drugs:messages.updateError');
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
    { value: '1', label: t('drugs:form.months.1') },
    { value: '2', label: t('drugs:form.months.2') },
    { value: '3', label: t('drugs:form.months.3') },
    { value: '4', label: t('drugs:form.months.4') },
    { value: '5', label: t('drugs:form.months.5') },
    { value: '6', label: t('drugs:form.months.6') },
    { value: '7', label: t('drugs:form.months.7') },
    { value: '8', label: t('drugs:form.months.8') },
    { value: '9', label: t('drugs:form.months.9') },
    { value: '10', label: t('drugs:form.months.10') },
    { value: '11', label: t('drugs:form.months.11') },
    { value: '12', label: t('drugs:form.months.12') },
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
            {isEdit ? t('drugs:form.editTitle') : t('drugs:form.addTitle')}
          </h1>
          <p className="text-gray-400 mt-1">
            {isEdit
              ? t('drugs:form.editSubtitle')
              : t('drugs:form.addSubtitle')}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label={t('drugs:form.fields.name.label')}
            placeholder={t('drugs:form.fields.name.placeholder')}
            error={errors.name?.message}
            {...register('name')}
          />

          <Select
            label={t('drugs:form.fields.form.label')}
            placeholder={t('drugs:form.fields.form.placeholder')}
            options={forms || []}
            error={errors.form?.message}
            disabled={isLoadingForms}
            {...register('form')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label={t('drugs:form.fields.expirationYear')}
              options={yearOptions}
              error={errors.expirationYear?.message}
              {...register('expirationYear')}
            />
            <Select
              label={t('drugs:form.fields.expirationMonth')}
              options={monthOptions}
              error={errors.expirationMonth?.message}
              {...register('expirationMonth')}
            />
          </div>

          <Textarea
            label={t('drugs:form.fields.description.label')}
            placeholder={t('drugs:form.fields.description.placeholder')}
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
              {t('drugs:form.buttons.cancel')}
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
              {isEdit ? t('drugs:form.buttons.save') : t('drugs:form.buttons.add')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
