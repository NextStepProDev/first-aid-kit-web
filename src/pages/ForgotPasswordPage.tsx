import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/auth';
import { Button, Input } from '../components/ui';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const forgotPasswordSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t('common:validation.invalidEmail')),
});

type ForgotPasswordFormData = {
  email: string;
};

export function ForgotPasswordPage() {
  const { t } = useTranslation(['auth', 'common']);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema(t)),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authApi.forgotPassword(data);
      setIsSuccess(true);
    } catch {
      // Backend always returns success for security reasons
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success-500/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-success-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">
          {t('auth:forgotPassword.title')}
        </h2>
        <p className="text-gray-400 mb-8">
          {t('auth:forgotPassword.successMessage')}
        </p>
        <Link to="/login">
          <Button variant="secondary" className="w-full">
            <ArrowLeft className="w-4 h-4" />
            {t('auth:forgotPassword.backToLogin')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-100 mb-2">
        {t('auth:forgotPassword.title')}
      </h2>
      <p className="text-gray-400 mb-8">
        {t('auth:forgotPassword.subtitle')}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label={t('auth:forgotPassword.email')}
          type="email"
          placeholder="twoj@email.pl"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isSubmitting}
        >
          {t('auth:forgotPassword.submitButton')}
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
}
