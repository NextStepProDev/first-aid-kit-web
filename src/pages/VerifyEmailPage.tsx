import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { Button, Input } from '../components/ui';
import { CheckCircle, XCircle, ArrowLeft, RefreshCw, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import type { ApiError } from '../types';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Brak tokenu weryfikacyjnego w linku.');
        return;
      }

      try {
        await authApi.verifyEmail(token);
        setStatus('success');
      } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        setStatus('error');
        setErrorMessage(
          axiosError.response?.data?.message || 'Weryfikacja nie powiodła się.'
        );
      }
    };

    verify();
  }, [token]);

  const handleResendVerification = async () => {
    if (!resendEmail) {
      toast.error('Podaj adres email.');
      return;
    }
    setIsResending(true);
    try {
      await authApi.resendVerification(resendEmail);
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

  if (status === 'loading') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-500/20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">
          Weryfikacja konta...
        </h2>
        <p className="text-gray-400">Proszę czekać, trwa aktywacja konta.</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success-500/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-success-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">
          Konto aktywowane!
        </h2>
        <p className="text-gray-400 mb-8">
          Twój adres email został potwierdzony. Możesz się teraz zalogować.
        </p>
        <Link to="/login">
          <Button className="w-full" size="lg">
            Przejdź do logowania
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
        <XCircle className="w-8 h-8 text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-100 mb-2">
        Weryfikacja nie powiodła się
      </h2>
      <p className="text-gray-400 mb-8">{errorMessage}</p>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="twoj@email.pl"
            leftIcon={<Mail className="w-4 h-4" />}
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
          />
        </div>
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleResendVerification}
          isLoading={isResending}
        >
          <RefreshCw className="w-4 h-4" />
          Wyślij nowy link aktywacyjny
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
