import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';
import { Button, Input } from '../components/ui';
import { User, Mail, Lock, Check, X, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import type { ApiError } from '../types';

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Imię musi mieć min. 2 znaki')
      .max(100, 'Imię może mieć max. 100 znaków'),
    username: z
      .string()
      .min(5, 'Nazwa użytkownika musi mieć min. 5 znaków')
      .max(36, 'Nazwa użytkownika może mieć max. 36 znaków'),
    email: z.string().email('Nieprawidłowy adres email'),
    password: z
      .string()
      .min(8, 'Hasło musi mieć min. 8 znaków')
      .regex(/[A-Z]/, 'Hasło musi zawierać wielką literę')
      .regex(/[a-z]/, 'Hasło musi zawierać małą literę')
      .regex(/[0-9]/, 'Hasło musi zawierać cyfrę')
      .regex(/[^A-Za-z0-9]/, 'Hasło musi zawierać znak specjalny'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła nie są identyczne',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
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
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const password = watch('password', '');

  const passwordRequirements = [
    { label: 'Min. 8 znaków', met: password.length >= 8 },
    { label: 'Wielka litera', met: /[A-Z]/.test(password) },
    { label: 'Mała litera', met: /[a-z]/.test(password) },
    { label: 'Cyfra', met: /[0-9]/.test(password) },
    { label: 'Znak specjalny', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      });
      setRegisteredEmail(data.email);
      setIsSuccess(true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || 'Nie udało się utworzyć konta';
      toast.error(message);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await authApi.resendVerification(registeredEmail);
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

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success-500/20 flex items-center justify-center">
          <Mail className="w-8 h-8 text-success-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">
          Sprawdź swoją skrzynkę
        </h2>
        <p className="text-gray-400 mb-8">
          Wysłaliśmy link aktywacyjny na adres{' '}
          <span className="text-gray-200 font-medium">{registeredEmail}</span>.
          Kliknij w link, aby aktywować konto.
        </p>
        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleResendVerification}
            isLoading={isResending}
          >
            <RefreshCw className="w-4 h-4" />
            Nie otrzymałeś maila? Wyślij ponownie
          </Button>
          <Link to="/login">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="w-4 h-4" />
              Wróć do logowania
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-100 mb-2">Utwórz konto</h2>
      <p className="text-gray-400 mb-8">
        Dołącz do nas i zacznij zarządzać swoją apteczką.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Imię i nazwisko"
          type="text"
          placeholder="Jan Kowalski"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Nazwa użytkownika"
          type="text"
          placeholder="jan_kowalski"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.username?.message}
          {...register('username')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="twoj@email.pl"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <Input
            label="Hasło"
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
          Zarejestruj się
        </Button>
      </form>

      <p className="mt-6 text-center text-gray-400">
        Masz już konto?{' '}
        <Link
          to="/login"
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
        >
          Zaloguj się
        </Link>
      </p>
    </div>
  );
}
