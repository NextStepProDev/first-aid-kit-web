import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/auth';
import { Button, Input } from '../components/ui';
import { CheckCircle, XCircle, ArrowLeft, RefreshCw, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function VerifyEmailPage() {
  const { t } = useTranslation(['auth', 'common']);
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
        setErrorMessage(t('auth:verifyEmail.error'));
        return;
      }

      try {
        await authApi.verifyEmail(token);
        setStatus('success');
      } catch {
        setStatus('error');
        setErrorMessage(t('auth:verifyEmail.error'));
      }
    };

    verify();
  }, [token, t]);

  const handleResendVerification = async () => {
    if (!resendEmail) {
      toast.error(t('auth:errors.emailRequired'));
      return;
    }
    setIsResending(true);
    try {
      await authApi.resendVerification(resendEmail);
      toast.success(t('auth:login.verificationSent'));
    } catch {
      toast.error(t('auth:errors.networkError'));
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
          {t('auth:verifyEmail.title')}
        </h2>
        <p className="text-gray-400">{t('auth:verifyEmail.verifying')}</p>
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
          {t('auth:verifyEmail.success')}
        </h2>
        <p className="text-gray-400 mb-8">
          {t('auth:verifyEmail.goToLogin')}
        </p>
        <Link to="/login">
          <Button className="w-full" size="lg">
            {t('auth:verifyEmail.goToLogin')}
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
        {t('auth:verifyEmail.error')}
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
          {t('auth:login.resendVerification')}
        </Button>
        <Link to="/login">
          <Button variant="ghost" className="w-full">
            <ArrowLeft className="w-4 h-4" />
            {t('auth:forgotPassword.backToLogin')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
