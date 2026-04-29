import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';
import { Button, Input } from '../components/ui';
import { Mail, Lock, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import type { ApiError } from '../types';

const loginSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t('common:validation.invalidEmail')),
  password: z.string().min(1, t('common:validation.required')),
});

type LoginFormData = {
  email: string;
  password: string;
};

export function LoginPage() {
  const { t } = useTranslation(['auth', 'common']);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [inactiveEmail, setInactiveEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema(t)),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setInactiveEmail(null);
      await login(data);
      toast.success(t('common:messages.loginSuccess'));
      navigate('/');
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const status = axiosError.response?.status;

      if (status === 423) {
        const minutesLeft = axiosError.response?.data?.minutesLeft;
        toast.error(t('auth:errors.accountLocked', { minutes: minutesLeft || '15' }));
        return;
      }

      if (status === 403) {
        setInactiveEmail(data.email);
        toast.error(t('auth:errors.accountInactive'));
        return;
      }

      toast.error(t('auth:errors.invalidCredentials'));
    }
  };

  const handleResendVerification = async () => {
    if (!inactiveEmail) return;
    setIsResending(true);
    try {
      await authApi.resendVerification(inactiveEmail);
      toast.success(t('auth:login.verificationSent'));
    } catch {
      toast.error(t('auth:errors.networkError'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-100 mb-2">{t('auth:login.title')}</h2>
      <p className="text-gray-400 mb-8">
        {t('auth:login.subtitle')}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label={t('auth:login.email')}
          type="email"
          placeholder="twoj@email.pl"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label={t('auth:login.password')}
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            {t('auth:login.forgotPassword')}
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isSubmitting}
        >
          {t('auth:login.loginButton')}
        </Button>
      </form>

      {inactiveEmail && (
        <div className="mt-4 p-4 rounded-lg bg-dark-700 border border-dark-500">
          <p className="text-sm text-gray-400 mb-3">
            {t('auth:login.accountInactive')}
          </p>
          <Button
            variant="secondary"
            className="w-full"
            size="sm"
            onClick={handleResendVerification}
            isLoading={isResending}
          >
            <RefreshCw className="w-4 h-4" />
            {t('auth:login.resendVerification')}
          </Button>
        </div>
      )}

      <p className="mt-6 text-center text-gray-400">
        {t('auth:login.noAccount')}{' '}
        <Link
          to="/register"
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
        >
          {t('auth:login.registerLink')}
        </Link>
      </p>
    </div>
  );
}
