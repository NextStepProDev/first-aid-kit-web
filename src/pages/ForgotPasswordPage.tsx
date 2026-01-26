import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { Button, Input } from '../components/ui';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authApi.forgotPassword(data);
      setIsSuccess(true);
    } catch (error) {
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
          Sprawdź swoją skrzynkę
        </h2>
        <p className="text-gray-400 mb-8">
          Jeśli konto z podanym adresem email istnieje, wysłaliśmy link do
          resetowania hasła.
        </p>
        <Link to="/login">
          <Button variant="secondary" className="w-full">
            <ArrowLeft className="w-4 h-4" />
            Wróć do logowania
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-100 mb-2">
        Zapomniałeś hasła?
      </h2>
      <p className="text-gray-400 mb-8">
        Podaj swój adres email, a wyślemy Ci link do resetowania hasła.
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

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isSubmitting}
        >
          Wyślij link resetujący
        </Button>
      </form>

      <p className="mt-6 text-center">
        <Link
          to="/login"
          className="text-gray-400 hover:text-gray-300 inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Wróć do logowania
        </Link>
      </p>
    </div>
  );
}
