import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '../api/auth';
import { Button, Input } from '../components/ui';
import { Lock, Check, X, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import type { ApiError } from '../types';

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Hasło musi mieć min. 8 znaków')
      .regex(/[A-Z]/, 'Hasło musi zawierać wielką literę')
      .regex(/[a-z]/, 'Hasło musi zawierać małą literę')
      .regex(/[0-9]/, 'Hasło musi zawierać cyfrę')
      .regex(/[^A-Za-z0-9]/, 'Hasło musi zawierać znak specjalny'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Hasła nie są identyczne',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const password = watch('newPassword', '');

  const passwordRequirements = [
    { label: 'Min. 8 znaków', met: password.length >= 8 },
    { label: 'Wielka litera', met: /[A-Z]/.test(password) },
    { label: 'Mała litera', met: /[a-z]/.test(password) },
    { label: 'Cyfra', met: /[0-9]/.test(password) },
    { label: 'Znak specjalny', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      if (!token) {
        toast.error('Brak poprawnego tokenu w linku.');
        return;
      }
      await authApi.resetPassword({
        token: token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success('Hasło zostało zmienione!');
      navigate('/login');
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || 'Błąd podczas resetowania hasła';
      toast.error(message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-100 mb-2">Ustaw nowe hasło</h2>
      <p className="text-gray-400 mb-8">
        Wprowadź nowe hasło dla swojego konta.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Input
            label="Nowe hasło"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />

          {password && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {passwordRequirements.map((req) => (
                <div
                  key={req.label}
                  className={`flex items-center gap-1.5 text-xs ${
                    req.met ? 'text-success-400' : 'text-gray-500'
                  }`}
                >
                  {req.met ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <X className="w-3 h-3" />
                  )}
                  {req.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <Input
          label="Potwierdź hasło"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isSubmitting}
        >
          Zmień hasło
        </Button>
      </form>

      <p className="mt-6 text-center text-gray-400">
        <Link
          to="/login"
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Wróć do logowania
        </Link>
      </p>
    </div>
  );
};
