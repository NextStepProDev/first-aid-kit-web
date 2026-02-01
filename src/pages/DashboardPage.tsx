import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

export function DashboardPage() {
  const navigate = useNavigate();

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['drugStatistics'],
    queryFn: drugsApi.getStatistics,
  });

  const { data: recentDrugs, isLoading: isLoadingDrugs } = useQuery({
    queryKey: ['drugs', 'recent'],
    queryFn: () => drugsApi.search({ size: 5, sort: 'drugId,desc' }),
  });

  const { data: forms } = useQuery({
    queryKey: ['drugForms'],
    queryFn: drugsApi.getForms,
  });

  const formLabels = React.useMemo(() => {
    if (!forms) return {} as Record<string, string>;
    return forms.reduce<Record<string, string>>((acc, f) => {
      acc[f.value.toUpperCase()] = f.label;
      return acc;
    }, {});
  }, [forms]);

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
        <Link to="/drugs/new">
          <Button>
            <PlusCircle className="w-4 h-4" />
            Dodaj lek
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Wszystkie leki"
          value={stats?.totalDrugs || 0}
          icon={<Pill className="w-5 h-5" />}
          color="primary"
          onClick={() => navigate('/drugs')}
        />
        <StatCard
          title="Aktywne"
          value={stats?.activeDrugs || 0}
          icon={<CheckCircle className="w-5 h-5" />}
          color="success"
          onClick={() => navigate('/drugs', { state: { expired: 'false' } })}
        />
        <StatCard
          title="Po terminie"
          value={stats?.expiredDrugs || 0}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="danger"
          onClick={() => navigate('/drugs', { state: { expired: 'true' } })}
        />
        <StatCard
          title={`Wysłane alerty (${new Date().toLocaleString('pl-PL', { month: 'long' })})`}
          value={stats?.alertSentCount || 0}
          icon={<Bell className="w-5 h-5" />}
          color="warning"
          onClick={() => navigate('/drugs', { state: { alertSentThisMonth: 'true' } })}
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
                .map(([form, count]) => {
                  const total = stats.totalDrugs || 1;
                  const percentage = Math.round((count / total) * 100);
                  return (
                    <div
                      key={form}
                      className="cursor-pointer hover:bg-dark-600/50 rounded-lg p-2 -mx-2 transition-colors"
                      onClick={() => navigate('/drugs', { state: { form: form.toLowerCase() } })}
                    >
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-300">{formLabels[form] || form}</span>
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
  onClick?: () => void;
}

function StatCard({ title, value, icon, color, onClick }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary-500/20 text-primary-400',
    success: 'bg-success-500/20 text-success-400',
    warning: 'bg-warning-500/20 text-warning-400',
    danger: 'bg-danger-500/20 text-danger-400',
  };

  const content = (
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

  if (onClick) {
    return (
      <div
        onClick={onClick}
        className="cursor-pointer hover:opacity-80 transition-opacity"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      >
        {content}
      </div>
    );
  }

  return content;
}
