import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';
import { Button, Input } from '../components/ui';
import { Mail, Lock, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import type { ApiError } from '../types';

const loginSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
  password: z.string().min(1, 'Hasło jest wymagane'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [inactiveEmail, setInactiveEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setInactiveEmail(null);
      await login(data);
      toast.success('Zalogowano pomyślnie!');
      navigate('/');
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const status = axiosError.response?.status;
      const message = axiosError.response?.data?.message || 'Nieprawidłowy email lub hasło';

      if (status === 403 && message.includes('nieaktywne')) {
        setInactiveEmail(data.email);
      }

      toast.error(message);
    }
  };

  const handleResendVerification = async () => {
    if (!inactiveEmail) return;
    setIsResending(true);
    try {
      await authApi.resendVerification(inactiveEmail);
      toast.success('Nowy link aktywacyjny został wysłany.');
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || 'Nie udało się wysłać emaila';
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-100 mb-2">Zaloguj się</h2>
      <p className="text-gray-400 mb-8">
        Witaj! Wprowadź dane logowania z łaski swojej.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="twoj@email.pl"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Hasło"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-dark-500 bg-dark-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-900"
            />
            Zapamiętaj mnie
          </label>

          <Link
            to="/forgot-password"
            className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            Zapomniałeś hasła?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isSubmitting}
        >
          Zaloguj się
        </Button>
      </form>

      {inactiveEmail && (
        <div className="mt-4 p-4 rounded-lg bg-dark-700 border border-dark-500">
          <p className="text-sm text-gray-400 mb-3">
            Twoje konto nie jest jeszcze aktywowane. Sprawdź skrzynkę email lub wyślij nowy link aktywacyjny.
          </p>
          <Button
            variant="secondary"
            className="w-full"
            size="sm"
            onClick={handleResendVerification}
            isLoading={isResending}
          >
            <RefreshCw className="w-4 h-4" />
            Wyślij ponownie link aktywacyjny
          </Button>
        </div>
      )}

      <p className="mt-6 text-center text-gray-400">
        Nie masz konta?{' '}
        <Link
          to="/register"
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
        >
          Zarejestruj się
        </Link>
      </p>
    </div>
  );
}
