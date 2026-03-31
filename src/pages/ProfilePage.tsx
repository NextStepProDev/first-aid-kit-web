import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';
import { Card, Button, Input } from '../components/ui';
import { User, Lock, Trash2, LogOut, Check, X, Pencil, Bell, BellOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import type { ApiError } from '../types';

const changePasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      currentPassword: z.string().min(1, t('profile:validation.currentPasswordRequired')),
      newPassword: z
        .string()
        .min(8, t('profile:validation.passwordMinLength'))
        .regex(/[A-Z]/, t('profile:validation.passwordUppercase'))
        .regex(/[a-z]/, t('profile:validation.passwordLowercase'))
        .regex(/[0-9]/, t('profile:validation.passwordDigit'))
        .regex(/[^A-Za-z0-9]/, t('profile:validation.passwordSpecial')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('profile:validation.passwordMismatch'),
      path: ['confirmPassword'],
    });

type ChangePasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const deleteAccountSchema = (t: (key: string) => string) =>
  z.object({
    password: z.string().min(1, t('profile:validation.passwordRequired')),
  });

type DeleteAccountFormData = {
  password: string;
};

const editProfileSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t('profile:validation.nameMinLength'))
      .max(100, t('profile:validation.nameMaxLength')),
    username: z
      .string()
      .min(5, t('profile:validation.usernameMinLength'))
      .max(36, t('profile:validation.usernameMaxLength')),
  });

type EditProfileFormData = {
  name: string;
  username: string;
};

export function ProfilePage() {
  const { t } = useTranslation(['profile', 'common']);
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(user?.alertsEnabled ?? true);
  const [isTogglingAlerts, setIsTogglingAlerts] = useState(false);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors, isSubmitting: isChangingPassword },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema(t)),
  });

  const {
    register: registerDelete,
    handleSubmit: handleSubmitDelete,
    reset: resetDelete,
    formState: { errors: deleteErrors },
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema(t)),
  });

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isUpdatingProfile },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema(t)),
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
    },
  });

  const newPassword = watch('newPassword', '');

  const passwordRequirements = [
    { label: t('profile:changePassword.requirements.minLength'), met: newPassword.length >= 8 },
    { label: t('profile:changePassword.requirements.uppercase'), met: /[A-Z]/.test(newPassword) },
    { label: t('profile:changePassword.requirements.lowercase'), met: /[a-z]/.test(newPassword) },
    { label: t('profile:changePassword.requirements.digit'), met: /[0-9]/.test(newPassword) },
    { label: t('profile:changePassword.requirements.special'), met: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  const onChangePassword = async (data: ChangePasswordFormData) => {
    try {
      await authApi.changePassword(data);
      toast.success(t('profile:messages.passwordChanged'));
      resetPassword();
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || t('profile:messages.passwordChangeFailed');
      toast.error(message);
    }
  };

  const onUpdateProfile = async (data: EditProfileFormData) => {
    try {
      await authApi.updateProfile(data);
      toast.success(t('profile:messages.profileUpdated'));
      setIsEditingProfile(false);
      refreshUser();
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || t('profile:messages.profileUpdateFailed');
      toast.error(message);
    }
  };

  const onDeleteAccount = async (data: DeleteAccountFormData) => {
    setIsDeleting(true);
    try {
      await authApi.deleteAccount(data);
      toast.success(t('profile:messages.accountDeleted'));
      logout();
      navigate('/login');
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || t('profile:messages.accountDeleteFailed');
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

  const handleToggleAlerts = async () => {
    const newValue = !alertsEnabled;
    setIsTogglingAlerts(true);
    try {
      await authApi.updateAlerts({ alertsEnabled: newValue });
      setAlertsEnabled(newValue);
      refreshUser();
      toast.success(
        newValue
          ? t('profile:messages.notificationsEnabled')
          : t('profile:messages.notificationsDisabled')
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || t('profile:messages.notificationsUpdateFailed');
      toast.error(message);
    } finally {
      setIsTogglingAlerts(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100">{t('profile:title')}</h1>
        <p className="text-gray-400 mt-1">{t('profile:subtitle')}</p>
      </div>

      {/* User Info */}
      <Card title={t('profile:profile.title')}>
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
                {t('profile:profile.editButton')}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              {t('profile:profile.emailNote')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
            <Input
              label={t('profile:profile.nameLabel')}
              type="text"
              placeholder={t('profile:profile.namePlaceholder')}
              leftIcon={<User className="w-4 h-4" />}
              error={profileErrors.name?.message}
              {...registerProfile('name')}
            />

            <Input
              label={t('profile:profile.usernameLabel')}
              type="text"
              placeholder={t('profile:profile.usernamePlaceholder')}
              leftIcon={<User className="w-4 h-4" />}
              error={profileErrors.username?.message}
              {...registerProfile('username')}
            />

            <div className="p-3 bg-dark-700 rounded-lg">
              <p className="text-sm text-gray-400">{t('profile:profile.emailLabelFixed')}</p>
              <p className="text-gray-200">{user?.email}</p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelEdit}
              >
                {t('common:buttons.cancel')}
              </Button>
              <Button type="submit" isLoading={isUpdatingProfile}>
                {t('profile:profile.saveButton')}
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Notifications */}
      <Card title={t('profile:notifications.title')}>
        <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
          <div className="flex items-center gap-3">
            {alertsEnabled ? (
              <Bell className="w-5 h-5 text-primary-400" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-500" />
            )}
            <div>
              <p className="font-medium text-gray-200">{t('profile:notifications.emailAlerts')}</p>
              <p className="text-sm text-gray-400">
                {t('profile:notifications.description')}
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={alertsEnabled}
            disabled={isTogglingAlerts}
            onClick={handleToggleAlerts}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 disabled:opacity-50 ${
              alertsEnabled ? 'bg-primary-500' : 'bg-dark-500'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                alertsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Change Password */}
      <Card title={t('profile:changePassword.title')}>
        <form
          onSubmit={handleSubmitPassword(onChangePassword)}
          className="space-y-4"
        >
          <Input
            label={t('profile:changePassword.currentPasswordLabel')}
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={passwordErrors.currentPassword?.message}
            {...registerPassword('currentPassword')}
          />

          <div>
            <Input
              label={t('profile:changePassword.newPasswordLabel')}
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
            label={t('profile:changePassword.confirmPasswordLabel')}
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={passwordErrors.confirmPassword?.message}
            {...registerPassword('confirmPassword')}
          />

          <Button type="submit" isLoading={isChangingPassword}>
            {t('profile:changePassword.submitButton')}
          </Button>
        </form>
      </Card>

      {/* Logout */}
      <Card title={t('profile:dangerZone.sessionTitle')}>
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          {t('common:nav.logout')}
        </Button>
      </Card>

      {/* Delete Account */}
      <Card title={t('profile:dangerZone.title')} className="border-danger-500/30">
        <p className="text-gray-400 mb-4">
          {t('profile:dangerZone.warning')}
        </p>
        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
          <Trash2 className="w-4 h-4" />
          {t('profile:dangerZone.deleteButton')}
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
              {t('profile:deleteAccount.title')}
            </h3>
            <p className="text-gray-400 mb-4">
              {t('profile:deleteAccount.confirmation')}
            </p>

            <form onSubmit={handleSubmitDelete(onDeleteAccount)}>
              <Input
                type="password"
                placeholder={t('profile:deleteAccount.passwordPlaceholder')}
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
                  {t('common:buttons.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  className="flex-1"
                  isLoading={isDeleting}
                >
                  {t('profile:deleteAccount.confirmButton')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
