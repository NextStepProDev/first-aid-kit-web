import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/auth';
import { Button, Input } from '../components/ui';
import { Lock, Check, X, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import type { ApiError } from '../types';

const resetPasswordSchema = (t: (key: string) => string) => z
  .object({
    newPassword: z
      .string()
      .min(8, t('auth:register.validation.passwordMinLength'))
      .regex(/[A-Z]/, t('auth:register.validation.passwordUppercase'))
      .regex(/[a-z]/, t('auth:register.validation.passwordLowercase'))
      .regex(/[0-9]/, t('auth:register.validation.passwordDigit'))
      .regex(/[^A-Za-z0-9]/, t('auth:register.validation.passwordSpecial')),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: t('auth:register.validation.passwordsDoNotMatch'),
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

export const ResetPasswordPage = () => {
  const { t } = useTranslation(['auth', 'common']);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema(t)),
    mode: 'onChange',
  });

  const password = watch('newPassword', '');

  const passwordRequirements = [
    { label: t('auth:register.passwordRequirements.minLength'), met: password.length >= 8 },
    { label: t('auth:register.passwordRequirements.uppercase'), met: /[A-Z]/.test(password) },
    { label: t('auth:register.passwordRequirements.lowercase'), met: /[a-z]/.test(password) },
    { label: t('auth:register.passwordRequirements.digit'), met: /[0-9]/.test(password) },
    { label: t('auth:register.passwordRequirements.special'), met: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      if (!token) {
        toast.error(t('auth:resetPassword.invalidToken'));
        return;
      }
      await authApi.resetPassword({
        token: token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success(t('auth:resetPassword.successMessage'));
      navigate('/login');
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || t('auth:errors.networkError');
      toast.error(message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-100 mb-2">{t('auth:resetPassword.title')}</h2>
      <p className="text-gray-400 mb-8">
        {t('auth:resetPassword.subtitle')}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Input
            label={t('auth:resetPassword.password')}
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
          label={t('auth:resetPassword.confirmPassword')}
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
          {t('auth:resetPassword.submitButton')}
        </Button>
      </form>

      <Link to="/login">
        <p className="mt-6 text-center text-sm text-primary-400 hover:text-primary-300 transition-colors">
          <ArrowLeft className="w-4 h-4 inline mr-1" />
          {t('auth:forgotPassword.backToLogin')}
        </p>
      </Link>
    </div>
  );
};
