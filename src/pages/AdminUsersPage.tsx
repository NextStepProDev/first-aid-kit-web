import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, UserResponse } from '../api/admin';
import { useAuth } from '../contexts/AuthContext';
import {
  Card,
  Button,
  Badge,
  Spinner,
  Pagination,
  Input,
  Modal,
  Textarea,
} from '../components/ui';
import {
  Users,
  Shield,
  Trash2,
  Mail,
  Calendar,
  Clock,
  AlertTriangle,
  Send,
  Download,
} from 'lucide-react';
import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';

const broadcastSchema = z.object({
  subject: z
    .string()
    .min(1, 'Temat jest wymagany')
    .max(200, 'Temat może mieć max. 200 znaków'),
  message: z
    .string()
    .min(1, 'Wiadomość jest wymagana')
    .max(10000, 'Wiadomość może mieć max. 10000 znaków'),
});

type BroadcastFormData = z.infer<typeof broadcastSchema>;

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [deleteModal, setDeleteModal] = useState<UserResponse | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [singleEmailUser, setSingleEmailUser] = useState<UserResponse | null>(null);

  const {
    register: registerBroadcast,
    handleSubmit: handleSubmitBroadcast,
    reset: resetBroadcast,
    formState: { errors: broadcastErrors, isSubmitting: isSendingBroadcast },
  } = useForm<BroadcastFormData>({
    resolver: zodResolver(broadcastSchema),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', page],
    queryFn: () => adminApi.getUsers(page, 20),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ userId, password }: { userId: number; password: string }) =>
      adminApi.deleteUser(userId, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Użytkownik został usunięty');
      setDeleteModal(null);
      setDeletePassword('');
    },
    onError: () => {
      toast.error('Nie udało się usunąć użytkownika. Sprawdź hasło.');
    },
  });

  const broadcastMutation = useMutation({
    mutationFn: (data: BroadcastFormData) => adminApi.broadcastEmail(data),
    onSuccess: (response) => {
      toast.success(response.message);
      setShowBroadcastModal(false);
      resetBroadcast();
    },
    onError: () => {
      toast.error('Nie udało się wysłać wiadomości');
    },
  });

  const singleEmailMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: BroadcastFormData }) => 
      adminApi.sendSingleEmail(userId, data),
    onSuccess: () => {
      toast.success('Wiadomość została wysłana');
      setSingleEmailUser(null);
      resetBroadcast();
    },
    onError: () => {
      toast.error('Nie udało się wysłać wiadomości');
    },
  });

  const handleDelete = () => {
    if (deleteModal && deletePassword) {
      deleteMutation.mutate({ userId: deleteModal.userId, password: deletePassword });
    }
  };

  const onSendBroadcast = (data: BroadcastFormData) => {
    broadcastMutation.mutate(data);
  };

  const handleExportCsv = async () => {
    try {
      const blob = await adminApi.exportEmailsCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users_emails.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Plik CSV został pobrany');
    } catch (error) {
      toast.error('Nie udało się pobrać pliku CSV');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-warning-400 mb-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Panel Administratora</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-100">Użytkownicy</h1>
          <p className="text-gray-400 mt-1">
            Zarządzaj kontami użytkowników w systemie
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleExportCsv}>
            <Download className="w-4 h-4" />
            Eksport CSV
          </Button>
          <Button onClick={() => setShowBroadcastModal(true)}>
            <Send className="w-4 h-4" />
            Wyślij do wszystkich
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-600">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Użytkownik</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Data rejestracji</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Ostatnie logowanie</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.content.map((user) => {
                    const isCurrentUser = user.userId === currentUser?.userId;
                    const isAdmin = user.roles?.includes('ADMIN');

                    return (
                      <tr key={user.userId} className="border-b border-dark-700 hover:bg-dark-700/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                              <Users className="w-5 h-5 text-primary-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-200">{user.name}</p>
                                {isCurrentUser && <Badge variant="info">Ty</Badge>}
                              </div>
                              <p className="text-sm text-gray-400">@{user.username}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {user.roles?.map((role) => (
                              <Badge key={role} variant={role === 'ADMIN' ? 'warning' : 'default'}>
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-300 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {user.createdAt ? formatDate(user.createdAt) : '-'}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-300 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-gray-500" />
                            {user.lastLogin ? formatDate(user.lastLogin) : 'Nigdy'}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {!isCurrentUser && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSingleEmailUser(user)}
                                  className="text-primary-400 hover:text-primary-300"
                                  title="Wyślij wiadomość"
                                >
                                  <Mail className="w-4 h-4" />
                                </Button>
                                {!isAdmin && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeleteModal(user)}
                                    className="text-danger-400 hover:text-danger-300"
                                    title="Usuń użytkownika"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </>
                            )}
                            {isAdmin && !isCurrentUser && <span className="text-xs text-gray-500">Chroniony</span>}
                            {isCurrentUser && <span className="text-xs text-gray-500">-</span>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {data && data.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={data.number}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Delete User Modal */}
      <Modal
        isOpen={deleteModal !== null}
        onClose={() => {
          setDeleteModal(null);
          setDeletePassword('');
        }}
        title="Usuń użytkownika"
        size="sm"
      >
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleDelete();
          }} 
          className="space-y-4"
        >
          <div className="flex items-center gap-3 p-3 bg-danger-500/10 border border-danger-500/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-danger-400 flex-shrink-0" />
            <p className="text-sm text-danger-400">
              Ta operacja jest nieodwracalna. Dane zostaną usunięte.
            </p>
          </div>
          <div className="p-3 bg-dark-700 rounded-lg">
            <p className="text-sm text-gray-400">Użytkownik:</p>
            <p className="font-medium text-gray-200">{deleteModal?.name}</p>
          </div>
          <Input
            label="Hasło administratora"
            type="password"
            placeholder="Wprowadź swoje hasło"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            autoFocus
          />
          <div className="flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setDeleteModal(null)}>
              Anuluj
            </Button>
            <Button type="submit" variant="danger" className="flex-1" isLoading={deleteMutation.isPending} disabled={!deletePassword}>
              Usuń
            </Button>
          </div>
        </form>
      </Modal>

      {/* Broadcast Modal (To All) */}
      <Modal
        isOpen={showBroadcastModal}
        onClose={() => {
          setShowBroadcastModal(false);
          resetBroadcast();
        }}
        title="Wyślij do wszystkich"
        size="md"
      >
        <form onSubmit={handleSubmitBroadcast(onSendBroadcast)} className="space-y-4">
          <Input label="Temat" placeholder="Temat..." error={broadcastErrors.subject?.message} {...registerBroadcast('subject')} />
          <Textarea label="Wiadomość" placeholder="Treść..." rows={6} error={broadcastErrors.message?.message} {...registerBroadcast('message')} />
          <div className="flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowBroadcastModal(false)}>Anuluj</Button>
            <Button type="submit" className="flex-1" isLoading={isSendingBroadcast}><Send className="w-4 h-4" /> Wyślij</Button>
          </div>
        </form>
      </Modal>

      {/* Single User Email Modal */}
      <Modal
        isOpen={singleEmailUser !== null}
        onClose={() => {
          setSingleEmailUser(null);
          resetBroadcast();
        }}
        title={`Wiadomość do: ${singleEmailUser?.name}`}
        size="md"
      >
        <form 
          onSubmit={handleSubmitBroadcast((data) => {
            if (singleEmailUser) {
              singleEmailMutation.mutate({ userId: singleEmailUser.userId, data });
            }
          })} 
          className="space-y-4"
        >
          <div className="p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg text-sm text-primary-400">
            Adresat: <strong>{singleEmailUser?.email}</strong>
          </div>
          <Input label="Temat" placeholder="Temat wiadomości..." error={broadcastErrors.subject?.message} {...registerBroadcast('subject')} />
          <Textarea label="Wiadomość" placeholder="Treść wiadomości..." rows={6} error={broadcastErrors.message?.message} {...registerBroadcast('message')} />
          <div className="flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setSingleEmailUser(null)}>Anuluj</Button>
            <Button type="submit" className="flex-1" isLoading={singleEmailMutation.isPending}><Send className="w-4 h-4" /> Wyślij</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}