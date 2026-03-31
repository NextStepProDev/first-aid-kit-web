import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui';
import { Mail, MessageCircle, HelpCircle } from 'lucide-react';
import { APP_VERSION_LABEL } from '../config/version';

export function ContactPage() {
  const { t } = useTranslation('contact');
  const contactEmail = 'firstaidkit.manager@gmail.com';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100">{t('title')}</h1>
        <p className="text-gray-400 mt-1">
          {t('subtitle')}
        </p>
      </div>

      {/* Contact Info */}
      <Card>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-1">{t('email.title')}</h3>
              <p className="text-gray-400 mb-3">
                {t('email.description')}
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
              >
                <Mail className="w-4 h-4" />
                {t('email.button')}
              </a>
            </div>
          </div>

          <div className="border-t border-dark-600 pt-6">
            <p className="text-sm text-gray-400 mb-3">{t('topics.title')}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={`mailto:${contactEmail}?subject=${t('topics.support.subject')}`}
                className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-warning-500/20 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-warning-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{t('topics.support.title')}</p>
                  <p className="text-xs text-gray-500">{t('topics.support.description')}</p>
                </div>
              </a>
              <a
                href={`mailto:${contactEmail}?subject=${t('topics.feedback.subject')}`}
                className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-success-500/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-success-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{t('topics.feedback.title')}</p>
                  <p className="text-xs text-gray-500">{t('topics.feedback.description')}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* FAQ */}
      <Card title={t('faq.title')}>
        <div className="space-y-4">
          <div className="p-4 bg-dark-700 rounded-lg">
            <h4 className="font-medium text-gray-200 mb-2">
              {t('faq.questions.addDrug.question')}
            </h4>
            <p className="text-gray-400 text-sm">
              {t('faq.questions.addDrug.answer')}
            </p>
          </div>

          <div className="p-4 bg-dark-700 rounded-lg">
            <h4 className="font-medium text-gray-200 mb-2">
              {t('faq.questions.export.question')}
            </h4>
            <p className="text-gray-400 text-sm">
              {t('faq.questions.export.answer')}
            </p>
          </div>

          <div className="p-4 bg-dark-700 rounded-lg">
            <h4 className="font-medium text-gray-200 mb-2">
              {t('faq.questions.notifications.question')}
            </h4>
            <p className="text-gray-400 text-sm">
              {t('faq.questions.notifications.answer')}
            </p>
          </div>

          <div className="p-4 bg-dark-700 rounded-lg">
            <h4 className="font-medium text-gray-200 mb-2">
              {t('faq.questions.recommend.question')}
            </h4>
            <p className="text-gray-400 text-sm">
              {t('faq.questions.recommend.answer')}
            </p>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card title={t('about.title')}>
        <p className="text-gray-400">
          {t('about.description')}
        </p>
        <div className="mt-4 pt-4 border-t border-dark-600">
          <p className="text-sm text-gray-500">
            {APP_VERSION_LABEL}
          </p>
        </div>
      </Card>
    </div>
  );
}
