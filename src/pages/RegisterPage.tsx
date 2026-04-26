import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';
import { Button, Input } from '../components/ui';
import { User, Mail, Lock, Check, X, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import type { ApiError } from '../types';

const registerSchema = (t: (key: string) => string) => z
  .object({
    name: z
      .string()
      .min(2, t('auth:register.validation.nameMinLength'))
      .max(100, t('auth:register.validation.nameMaxLength')),
    username: z
      .string()
      .min(5, t('auth:register.validation.usernameMinLength'))
      .max(36, t('auth:register.validation.usernameMaxLength')),
    email: z.string().email(t('common:validation.invalidEmail')),
    password: z
      .string()
      .min(8, t('auth:register.validation.passwordMinLength'))
      .regex(/[A-Z]/, t('auth:register.validation.passwordUppercase'))
      .regex(/[a-z]/, t('auth:register.validation.passwordLowercase'))
      .regex(/[0-9]/, t('auth:register.validation.passwordDigit'))
      .regex(/[^A-Za-z0-9]/, t('auth:register.validation.passwordSpecial')),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t('auth:register.validation.passwordsDoNotMatch'),
    path: ['confirmPassword'],
  });

type RegisterFormData = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterPage() {
  const { t, i18n } = useTranslation(['auth', 'common']);
  const { register: registerUser } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema(t)),
    mode: 'onChange',
  });

  const password = watch('password', '');

  const passwordRequirements = [
    { label: t('auth:register.passwordRequirements.minLength'), met: password.length >= 8 },
    { label: t('auth:register.passwordRequirements.uppercase'), met: /[A-Z]/.test(password) },
    { label: t('auth:register.passwordRequirements.lowercase'), met: /[a-z]/.test(password) },
    { label: t('auth:register.passwordRequirements.digit'), met: /[0-9]/.test(password) },
    { label: t('auth:register.passwordRequirements.special'), met: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        language: i18n.language,
      });
      setRegisteredEmail(data.email);
      setIsSuccess(true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || t('auth:register.validation.registerError');
      toast.error(message);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await authApi.resendVerification(registeredEmail);
      toast.success(t('auth:login.verificationSent'));
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || t('auth:errors.networkError');
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success-500/20 flex items-center justify-center">
          <Mail className="w-8 h-8 text-success-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">
          {t('auth:register.successTitle')}
        </h2>
        <p className="text-gray-400 mb-8">
          {t('auth:register.successMessage')}{' '}
          <span className="text-gray-200 font-medium">{registeredEmail}</span>.{' '}
          {t('auth:register.successAction')}
        </p>
        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleResendVerification}
            isLoading={isResending}
          >
            <RefreshCw className="w-4 h-4" />
            {t('auth:register.resendEmail')}
          </Button>
          <Link to="/login">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="w-4 h-4" />
              {t('auth:register.backToLogin')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-100 mb-2">{t('auth:register.title')}</h2>
      <p className="text-gray-400 mb-8">
        {t('auth:register.subtitle')}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label={t('auth:register.name')}
          type="text"
          placeholder="Jan Kowalski"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label={t('auth:register.username')}
          type="text"
          placeholder="jan_kowalski"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.username?.message}
          {...register('username')}
        />

        <Input
          label={t('auth:register.email')}
          type="email"
          placeholder="twoj@email.pl"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <Input
            label={t('auth:register.password')}
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
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
          label={t('auth:register.confirmPassword')}
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
          {t('auth:register.registerButton')}
        </Button>
      </form>

      <p className="mt-6 text-center text-gray-400">
        {t('auth:register.hasAccount')}{' '}
        <Link
          to="/login"
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
        >
          {t('auth:register.loginLink')}
        </Link>
      </p>
    </div>
  );
}
