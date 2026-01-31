import React from 'react';
import { Card } from '../components/ui';
import { Mail, MessageCircle, HelpCircle } from 'lucide-react';
import { APP_VERSION_LABEL } from '../config/version';

export function ContactPage() {
  const contactEmail = 'firstaidkit.team@gmail.com';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Kontakt</h1>
        <p className="text-gray-400 mt-1">
          Masz pytania lub potrzebujesz pomocy? Skontaktuj się z nami.
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
              <h3 className="text-lg font-medium text-gray-200 mb-1">Email</h3>
              <p className="text-gray-400 mb-3">
                Napisz do nas - odpowiadamy zazwyczaj w ciągu 24 godzin.
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
              >
                <Mail className="w-4 h-4" />
                {contactEmail}
              </a>
            </div>
          </div>

          <div className="border-t border-dark-600 pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-success-500/20 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-success-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-1">Feedback</h3>
                <p className="text-gray-400">
                  Masz pomysł na ulepszenie aplikacji? Chętnie wysłuchamy Twojej opinii!
                  Napisz do nas co moglibyśmy poprawić lub dodać.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-dark-600 pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning-500/20 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-warning-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-1">Pomoc techniczna</h3>
                <p className="text-gray-400">
                  Napotkałeś problem z aplikacją? Opisz nam szczegółowo co się stało,
                  a postaramy się pomóc jak najszybciej.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* FAQ */}
      <Card title="Najczęściej zadawane pytania">
        <div className="space-y-4">
          <div className="p-4 bg-dark-700 rounded-lg">
            <h4 className="font-medium text-gray-200 mb-2">
              Jak dodać nowy lek do apteczki?
            </h4>
            <p className="text-gray-400 text-sm">
              Kliknij "Dodaj lek" w menu bocznym, wypełnij formularz podając nazwę,
              formę i datę ważności leku, a następnie zapisz.
            </p>
          </div>

          <div className="p-4 bg-dark-700 rounded-lg">
            <h4 className="font-medium text-gray-200 mb-2">
              Czy mogę eksportować listę leków?
            </h4>
            <p className="text-gray-400 text-sm">
              Tak! Na stronie "Leki" znajdziesz przycisk "Eksport PDF", który
              pozwala pobrać pełną listę Twoich leków w formacie PDF.
            </p>
          </div>

          <div className="p-4 bg-dark-700 rounded-lg">
            <h4 className="font-medium text-gray-200 mb-2">
              Jak działają powiadomienia o wygasających lekach?
            </h4>
            <p className="text-gray-400 text-sm">
              Termin ważności leków kończy się z ostatnim dniem miesiąca
              podanego na opakowaniu. Codziennie o 9:00 system sprawdza, które
              leki wygasają w bieżącym miesiącu i wysyła zbiorczego emaila
              z ich listą. Powiadomienie o danym leku wysyłane jest tylko raz.
            </p>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card title="O aplikacji">
        <p className="text-gray-400">
          First Aid Kit to aplikacja do zarządzania domową apteczką. Pozwala
          śledzić leki, ich daty ważności oraz otrzymywać powiadomienia o
          zbliżających się terminach przydatności.
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
