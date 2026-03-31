import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { AlertTriangle, Lock } from 'lucide-react';

interface DeleteAllDrugsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  isLoading?: boolean;
}

export function DeleteAllDrugsModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteAllDrugsModalProps) {
  const { t } = useTranslation('drugs');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError(t('deleteAllModal.passwordRequired'));
      return;
    }
    setError('');
    onConfirm(password);
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm">
      <form onSubmit={handleSubmit}>
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-danger-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-danger-400" />
          </div>

          <h3 className="text-lg font-semibold text-gray-100 mb-2">
            {t('deleteAllModal.title')}
          </h3>
          <p className="text-gray-400 mb-4">
            {t('deleteAllModal.description')}
          </p>

          <div className="bg-danger-500/10 border border-danger-500/30 rounded-lg p-3 mb-4">
            <p className="text-danger-300 text-sm font-medium">
              {t('deleteAllModal.confirmation')}
            </p>
          </div>

          <div className="mb-6">
            <Input
              type="password"
              placeholder={t('deleteAllModal.passwordPlaceholder')}
              leftIcon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              error={error}
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={handleClose}
              disabled={isLoading}
            >
              {t('deleteAllModal.buttons.cancel')}
            </Button>
            <Button
              type="submit"
              variant="danger"
              className="flex-1"
              isLoading={isLoading}
              disabled={!password.trim()}
            >
              {t('deleteAllModal.buttons.confirm')}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
