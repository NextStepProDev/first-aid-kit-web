import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { drugsApi } from '../api/drugs';
import { Card, Button, Badge, Spinner } from '../components/ui';
import {
  Pill,
  AlertTriangle,
  CheckCircle,
  Bell,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { formatDate, getExpirationStatus } from '../utils/formatDate';
import toast from 'react-hot-toast';

export function DashboardPage() {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['drugStatistics'],
    queryFn: drugsApi.getStatistics,
  });

  const { data: recentDrugs, isLoading: isLoadingDrugs } = useQuery({
    queryKey: ['drugs', 'recent'],
    queryFn: () => drugsApi.search({ size: 5, sort: 'drugId,desc' }),
  });

  // const handleSendAlerts = async () => {
  //   try {
  //     await drugsApi.sendAlerts();
  //     toast.success('Powiadomienia zostały wysłane!');
  //   } catch (error) {
  //     toast.error('Nie udało się wysłać powiadomień');
  //   }
  // };
  const handleSendAlerts = async () => {
    const loadingToast = toast.loading('Wysyłanie powiadomień...');
    try {
      // count to liczba, którą teraz zwraca Twój backend (0, 1, 2 itd.)
      const count = await drugsApi.sendAlerts();
      
      toast.dismiss(loadingToast);

      if (count > 0) {
        toast.success(`Wysłano powiadomienia o ${count} leku/ach!`);
      } else {
        // Jeśli count wynosi 0, pokazujemy komunikat informacyjny
        toast.error('Brak nowych leków do powiadomienia.');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Nie udało się wysłać powiadomień');
      console.error(error);
    }
  };

  if (isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Przegląd Twojej apteczki domowej
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleSendAlerts}>
            <Bell className="w-4 h-4" />
            Wyślij alerty
          </Button>
          <Link to="/drugs/new">
            <Button>
              <PlusCircle className="w-4 h-4" />
              Dodaj lek
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Wszystkie leki"
          value={stats?.totalDrugs || 0}
          icon={<Pill className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Aktywne"
          value={stats?.activeDrugs || 0}
          icon={<CheckCircle className="w-5 h-5" />}
          color="success"
        />
        <StatCard
          title="Po terminie"
          value={stats?.expiredDrugs || 0}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="danger"
        />
        <StatCard
          title="Wysłane alerty"
          value={stats?.alertSentCount || 0}
          icon={<Bell className="w-5 h-5" />}
          color="warning"
        />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent drugs */}
        <Card
          title="Ostatnio dodane"
          action={
            <Link to="/drugs">
              <Button variant="ghost" size="sm">
                Zobacz wszystkie
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          }
        >
          {isLoadingDrugs ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : recentDrugs?.content.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Pill className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Brak leków w apteczce</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDrugs?.content.map((drug) => {
                const status = getExpirationStatus(drug.expirationDate);
                return (
                  <Link
                    key={drug.drugId}
                    to={`/drugs/${drug.drugId}/edit`}
                    className="flex items-center justify-between p-3 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                        <Pill className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-200">
                          {drug.drugName}
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatDate(drug.expirationDate)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        status === 'expired'
                          ? 'danger'
                          : status === 'expiring-soon'
                          ? 'warning'
                          : 'success'
                      }
                    >
                      {status === 'expired'
                        ? 'Po terminie'
                        : status === 'expiring-soon'
                        ? 'Wygasa'
                        : 'Aktywny'}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>

        {/* Drugs by form */}
        <Card title="Leki według formy">
          {stats?.drugsByForm && Object.keys(stats.drugsByForm).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.drugsByForm)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([form, count]) => {
                  const total = stats.totalDrugs || 1;
                  const percentage = Math.round((count / total) * 100);
                  return (
                    <div key={form}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-300">{form}</span>
                        <span className="text-gray-400">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Brak danych do wyświetlenia</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'danger';
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary-500/20 text-primary-400',
    success: 'bg-success-500/20 text-success-400',
    warning: 'bg-warning-500/20 text-warning-400',
    danger: 'bg-danger-500/20 text-danger-400',
  };

  return (
    <Card className="flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-100">{value}</p>
      </div>
    </Card>
  );
}
