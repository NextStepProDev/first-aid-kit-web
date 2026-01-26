import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';
import { Card, Button, Input } from '../components/ui';
import { User, Lock, Trash2, LogOut, Check, X, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import type { ApiError } from '../types';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Aktualne hasło jest wymagane'),
    newPassword: z
      .string()
      .min(8, 'Hasło musi mieć min. 8 znaków')
      .regex(/[A-Z]/, 'Hasło musi zawierać wielką literę')
      .regex(/[a-z]/, 'Hasło musi zawierać małą literę')
      .regex(/[0-9]/, 'Hasło musi zawierać cyfrę')
      .regex(/[^A-Za-z0-9]/, 'Hasło musi zawierać znak specjalny'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Hasła nie są identyczne',
    path: ['confirmPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Hasło jest wymagane'),
});

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

const editProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Imię musi mieć min. 2 znaki')
    .max(100, 'Imię może mieć max. 100 znaków'),
  username: z
    .string()
    .min(5, 'Nazwa użytkownika musi mieć min. 5 znaków')
    .max(50, 'Nazwa użytkownika może mieć max. 50 znaków'),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors, isSubmitting: isChangingPassword },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const {
    register: registerDelete,
    handleSubmit: handleSubmitDelete,
    reset: resetDelete,
    formState: { errors: deleteErrors },
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isUpdatingProfile },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
    },
  });

  const newPassword = watch('newPassword', '');

  const passwordRequirements = [
    { label: 'Min. 8 znaków', met: newPassword.length >= 8 },
    { label: 'Wielka litera', met: /[A-Z]/.test(newPassword) },
    { label: 'Mała litera', met: /[a-z]/.test(newPassword) },
    { label: 'Cyfra', met: /[0-9]/.test(newPassword) },
    { label: 'Znak specjalny', met: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  const onChangePassword = async (data: ChangePasswordFormData) => {
    try {
      await authApi.changePassword(data);
      toast.success('Hasło zostało zmienione');
      resetPassword();
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || 'Nie udało się zmienić hasła';
      toast.error(message);
    }
  };

  const onUpdateProfile = async (data: EditProfileFormData) => {
    try {
      await authApi.updateProfile(data);
      toast.success('Profil został zaktualizowany');
      setIsEditingProfile(false);
      refreshUser();
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || 'Nie udało się zaktualizować profilu';
      toast.error(message);
    }
  };

  const onDeleteAccount = async (data: DeleteAccountFormData) => {
    setIsDeleting(true);
    try {
      await authApi.deleteAccount(data);
      toast.success('Konto zostało usunięte');
      logout();
      navigate('/login');
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || 'Nie udało się usunąć konta';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartEdit = () => {
    resetProfile({
      name: user?.name || '',
      username: user?.username || '',
    });
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    resetProfile({
      name: user?.name || '',
      username: user?.username || '',
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Profil</h1>
        <p className="text-gray-400 mt-1">Zarządzaj swoim kontem</p>
      </div>

      {/* User Info */}
      <Card title="Informacje o koncie">
        {!isEditingProfile ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-dark-700 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-200">{user?.name || user?.username}</p>
                <p className="text-sm text-gray-400">@{user?.username}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleStartEdit}>
                <Pencil className="w-4 h-4" />
                Edytuj
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Email nie może być zmieniony.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
            <Input
              label="Imię i nazwisko"
              type="text"
              placeholder="Jan Kowalski"
              leftIcon={<User className="w-4 h-4" />}
              error={profileErrors.name?.message}
              {...registerProfile('name')}
            />

            <Input
              label="Nazwa użytkownika"
              type="text"
              placeholder="jan_kowalski"
              leftIcon={<User className="w-4 h-4" />}
              error={profileErrors.username?.message}
              {...registerProfile('username')}
            />

            <div className="p-3 bg-dark-700 rounded-lg">
              <p className="text-sm text-gray-400">Email (nie może być zmieniony)</p>
              <p className="text-gray-200">{user?.email}</p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelEdit}
              >
                Anuluj
              </Button>
              <Button type="submit" isLoading={isUpdatingProfile}>
                Zapisz zmiany
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Change Password */}
      <Card title="Zmień hasło">
        <form
          onSubmit={handleSubmitPassword(onChangePassword)}
          className="space-y-4"
        >
          <Input
            label="Aktualne hasło"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={passwordErrors.currentPassword?.message}
            {...registerPassword('currentPassword')}
          />

          <div>
            <Input
              label="Nowe hasło"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={passwordErrors.newPassword?.message}
              {...registerPassword('newPassword')}
            />

            {newPassword && (
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
            label="Potwierdź nowe hasło"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={passwordErrors.confirmPassword?.message}
            {...registerPassword('confirmPassword')}
          />

          <Button type="submit" isLoading={isChangingPassword}>
            Zmień hasło
          </Button>
        </form>
      </Card>

      {/* Logout */}
      <Card title="Sesja">
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          Wyloguj się
        </Button>
      </Card>

      {/* Delete Account */}
      <Card title="Strefa niebezpieczna" className="border-danger-500/30">
        <p className="text-gray-400 mb-4">
          Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane zostaną
          trwale usunięte.
        </p>
        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
          <Trash2 className="w-4 h-4" />
          Usuń konto
        </Button>
      </Card>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowDeleteModal(false);
              resetDelete();
            }}
          />
          <div className="relative w-full max-w-md mx-4 bg-dark-800 border border-dark-600 rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              Usuń konto
            </h3>
            <p className="text-gray-400 mb-4">
              Wpisz swoje hasło, aby potwierdzić usunięcie konta.
            </p>

            <form onSubmit={handleSubmitDelete(onDeleteAccount)}>
              <Input
                type="password"
                placeholder="Twoje hasło"
                error={deleteErrors.password?.message}
                {...registerDelete('password')}
              />

              <div className="flex gap-3 mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowDeleteModal(false);
                    resetDelete();
                  }}
                >
                  Anuluj
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  className="flex-1"
                  isLoading={isDeleting}
                >
                  Usuń konto
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
