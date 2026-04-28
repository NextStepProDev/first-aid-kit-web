import React from 'react';
import { useTranslation } from 'react-i18next';

const LAST_UPDATED_PL = '28 kwietnia 2026';
const LAST_UPDATED_EN = '28 April 2026';

export function PrivacyPolicyPage() {
  const { i18n } = useTranslation();
  const isPl = i18n.language.startsWith('pl');

  if (!isPl) return <PrivacyPolicyEn />;
  return <PrivacyPolicyPl />;
}

function PrivacyPolicyPl() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-3">Polityka prywatności</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Transparentność i bezpieczeństwo Twoich danych to dla mnie priorytet.
        </p>
      </div>

      {/* Wstęp */}
      <Section title="">
        <p className="text-gray-300 leading-relaxed">
          Bardzo dbam o Twoje dane osobowe i zawsze będę dokładał wszelkich starań, aby należycie je chronić.
          Niniejsza polityka prywatności wyjaśnia, jakie dane zbieram, w jakim celu i na jakiej podstawie prawnej,
          jak długo je przechowuję oraz jakie prawa Ci przysługują. Napisana jest w sposób prosty i zrozumiały —
          bez zbędnego żargonu prawniczego.
        </p>
        <p className="text-gray-500 text-sm mt-4">
          Ostatnia aktualizacja: {LAST_UPDATED_PL}
        </p>
      </Section>

      {/* 1. Administrator danych */}
      <Section title="1. Administrator danych osobowych">
        <p className="text-gray-300 leading-relaxed">
          Administratorem Twoich danych osobowych jest:
        </p>
        <div className="mt-4 bg-dark-700/50 rounded-xl p-4 space-y-1 text-gray-300 text-sm">
          <p className="font-semibold text-gray-200">Next Step Pro Mateusz Nawratek</p>
          <p>ul. Dworcowa 41, 44-190 Knurów</p>
          <p>NIP: 9691485543</p>
          <p>
            E-mail:{' '}
            <a href="mailto:mateusz.nawratek@outlook.com" className="text-primary-400 hover:text-primary-300 transition-colors">
              mateusz.nawratek@outlook.com
            </a>
          </p>
        </div>
        <p className="text-gray-400 text-sm mt-4 leading-relaxed">
          W sprawach dotyczących danych osobowych możesz kontaktować się ze mną pod powyższym adresem e-mail.
          Staram się odpowiadać na wszystkie wiadomości w ciągu 72 godzin.
        </p>
      </Section>

      {/* 2. Jakie dane zbieramy */}
      <Section title="2. Jakie dane zbieramy">
        <p className="text-gray-400 leading-relaxed mb-4">
          Zbieramy wyłącznie dane niezbędne do świadczenia usług aplikacji First Aid Kit Manager. Nie zbieramy nic ponad to.
        </p>

        <SubSection title="Rejestracja konta">
          <DataList items={[
            'Imię i nazwisko',
            'Nazwa użytkownika',
            'Adres e-mail',
            'Hasło — przechowywane wyłącznie w postaci zaszyfrowanego hashu (bcrypt), nigdy w formie jawnej',
          ]} />
        </SubSection>

        <SubSection title="W trakcie korzystania z serwisu">
          <DataList items={[
            'Preferencje językowe',
            'Preferencje alertów o wygasających lekach',
            'Dane o lekach wprowadzone przez użytkownika (nazwa, data ważności, forma, ilość)',
          ]} />
        </SubSection>

        <p className="text-gray-500 text-sm mt-4">
          Nie korzystamy z plików cookies śledzących, Google Analytics, Facebook Pixel ani żadnych innych narzędzi analitycznych.
        </p>
      </Section>

      {/* 3. Cel i podstawa prawna */}
      <Section title="3. Cel i podstawa prawna przetwarzania">
        <div className="space-y-4">
          <LegalBasis
            purpose="Obsługa konta użytkownika i zarządzanie lekami"
            basis="Art. 6 ust. 1 lit. b RODO — przetwarzanie niezbędne do wykonania umowy (świadczenie usług aplikacji)"
          />
          <LegalBasis
            purpose="Komunikacja serwisowa (informacje o przerwach, aktualizacjach, zmianach w regulaminie)"
            basis="Art. 6 ust. 1 lit. f RODO — uzasadniony interes administratora (zapewnienie ciągłości i bezpieczeństwa usługi)"
          />
          <LegalBasis
            purpose="Weryfikacja konta e-mail i odzyskiwanie hasła"
            basis="Art. 6 ust. 1 lit. b RODO — wykonanie umowy"
          />
        </div>
      </Section>

      {/* 4. Jak długo przechowujemy dane */}
      <Section title="4. Jak długo przechowujemy dane">
        <div className="space-y-3 text-gray-300 leading-relaxed">
          <p>
            <span className="text-gray-200 font-medium">Dane konta</span> — przechowywane przez cały czas istnienia konta.
            Po jego usunięciu wszystkie Twoje dane są trwale i nieodwracalnie usuwane z bazy danych.
          </p>
          <p>
            <span className="text-gray-200 font-medium">Dane o lekach</span> — usuwane automatycznie razem z kontem
            (kaskadowe usunięcie na poziomie bazy danych). Nie ma możliwości ich odzyskania po usunięciu konta.
          </p>
          <p>
            <span className="text-gray-200 font-medium">Tokeny bezpieczeństwa</span> (weryfikacja e-mail: 24h, reset hasła: 30 min,
            sesja: 1h) — usuwane automatycznie po wygaśnięciu przez wbudowany mechanizm czyszczenia.
          </p>
        </div>
      </Section>

      {/* 5. Komu udostępniamy dane */}
      <Section title="5. Komu udostępniamy dane">
        <p className="text-gray-300 leading-relaxed font-medium text-lg mb-4">
          Nikomu. I nigdy tego nie zrobimy.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          Twoje dane osobowe nie są sprzedawane, wynajmowane ani przekazywane żadnym podmiotom trzecim w celach
          marketingowych, reklamowych ani żadnych innych celach komercyjnych.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          Jedynymi podmiotami, z którymi współpracujemy w ramach technicznego przetwarzania danych, są:
        </p>
        <div className="space-y-3">
          <InfoItem
            title="Oracle Cloud Infrastructure (EU)"
            description="Serwer aplikacji i baza danych zlokalizowane w regionie europejskim (Frankfurt, Niemcy). Dane nie opuszczają Europejskiego Obszaru Gospodarczego."
          />
          <InfoItem
            title="Zewnętrzny serwer poczty e-mail (SMTP)"
            description="Wykorzystywany wyłącznie do dostarczenia wiadomości (weryfikacja konta, reset hasła, komunikaty serwisowe). Dostawca nie przetwarza Twoich danych w żadnym innym celu."
          />
        </div>
      </Section>

      {/* 6. Twoje prawa */}
      <Section title="6. Twoje prawa">
        <p className="text-gray-400 leading-relaxed mb-4">
          Na podstawie RODO przysługują Ci następujące prawa:
        </p>
        <div className="space-y-3">
          <Right title="Prawo dostępu" description="Możesz w każdej chwili zapytać, jakie Twoje dane przechowujemy." />
          <Right title="Prawo do sprostowania" description="Jeśli Twoje dane są nieprawidłowe lub niekompletne, możesz je poprawić w ustawieniach konta." />
          <Right title="Prawo do usunięcia" description="Możesz usunąć swoje konto w ustawieniach — wszystkie Twoje dane zostaną natychmiast i trwale usunięte. Nie ma możliwości ich przywrócenia." />
          <Right title="Prawo do ograniczenia przetwarzania" description="Możesz zażądać ograniczenia przetwarzania Twoich danych w określonych przypadkach." />
          <Right title="Prawo do przenoszalności" description="Możesz zażądać przekazania Twoich danych w ustrukturyzowanym, powszechnie używanym formacie." />
          <Right title="Prawo sprzeciwu" description="Możesz wnieść sprzeciw wobec przetwarzania danych opartego na uzasadnionym interesie." />
        </div>
        <p className="text-gray-400 text-sm mt-6 leading-relaxed">
          Przysługuje Ci również prawo wniesienia skargi do organu nadzorczego — Prezesa Urzędu Ochrony Danych Osobowych
          (PUODO), ul. Stawki 2, 00-193 Warszawa.
        </p>
      </Section>

      {/* 7. Bezpieczeństwo danych */}
      <Section title="7. Bezpieczeństwo danych">
        <p className="text-gray-400 leading-relaxed mb-4">
          Stosuję wielowarstwowe zabezpieczenia techniczne, aby chronić Twoje dane:
        </p>
        <DataList items={[
          'Hasła przechowywane wyłącznie jako hash bcrypt — nawet ja nie znam Twojego hasła',
          'Szyfrowane połączenie HTTPS na całej stronie',
          'Tokeny JWT z krótkim czasem życia (1 godzina) — minimalizacja ryzyka przy ewentualnym wycieku',
          'Konta blokowane automatycznie po wielokrotnych nieudanych próbach logowania',
          'Ograniczenie liczby żądań (rate limiting) — ochrona przed atakami brute-force',
          'Izolacja danych użytkowników — każdy użytkownik widzi wyłącznie swoje dane',
        ]} />
      </Section>

      {/* 8. Zmiany polityki */}
      <Section title="8. Zmiany polityki prywatności">
        <p className="text-gray-400 leading-relaxed">
          W przypadku istotnych zmian w polityce prywatności poinformuję Cię o tym z wyprzedzeniem —
          przez e-mail lub komunikat w serwisie. Data ostatniej aktualizacji jest zawsze widoczna na górze tej strony.
          Zachęcam do jej okresowego przeglądania.
        </p>
      </Section>

      {/* 9. Kontakt */}
      <Section title="9. Kontakt w sprawach danych osobowych">
        <p className="text-gray-400 leading-relaxed">
          Jeśli masz pytania dotyczące przetwarzania Twoich danych osobowych, chcesz skorzystać z przysługujących
          Ci praw lub masz jakiekolwiek wątpliwości — napisz do mnie. Potraktuję każde zgłoszenie poważnie
          i odpowiem tak szybko, jak to możliwe.
        </p>
        <a
          href="mailto:mateusz.nawratek@outlook.com"
          className="inline-block mt-4 text-primary-400 hover:text-primary-300 transition-colors font-medium"
        >
          mateusz.nawratek@outlook.com
        </a>
      </Section>
    </div>
  );
}

// ==================== English version ====================

function PrivacyPolicyEn() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-3">Privacy Policy</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Transparency and security of your data are my top priority.
        </p>
      </div>

      {/* Intro */}
      <Section title="">
        <p className="text-gray-300 leading-relaxed">
          I care deeply about your personal data and will always make every effort to protect it properly.
          This privacy policy explains what data I collect, for what purpose and on what legal basis,
          how long I store it, and what rights you have. It is written in a clear and straightforward
          way — without unnecessary legal jargon.
        </p>
        <p className="text-gray-500 text-sm mt-4">Last updated: {LAST_UPDATED_EN}</p>
      </Section>

      {/* 1 */}
      <Section title="1. Data Controller">
        <p className="text-gray-300 leading-relaxed">The controller of your personal data is:</p>
        <div className="mt-4 bg-dark-700/50 rounded-xl p-4 space-y-1 text-gray-300 text-sm">
          <p className="font-semibold text-gray-200">Next Step Pro Mateusz Nawratek</p>
          <p>ul. Dworcowa 41, 44-190 Knurów, Poland</p>
          <p>Tax ID (NIP): 9691485543</p>
          <p>
            E-mail:{' '}
            <a href="mailto:mateusz.nawratek@outlook.com" className="text-primary-400 hover:text-primary-300 transition-colors">
              mateusz.nawratek@outlook.com
            </a>
          </p>
        </div>
        <p className="text-gray-400 text-sm mt-4 leading-relaxed">
          For any questions regarding your personal data, please contact me at the e-mail address above.
          I aim to respond to all messages within 72 hours.
        </p>
      </Section>

      {/* 2 */}
      <Section title="2. What Data We Collect">
        <p className="text-gray-400 leading-relaxed mb-4">
          We collect only the data necessary to provide the First Aid Kit Manager service. Nothing beyond that.
        </p>
        <SubSection title="Account registration">
          <DataList items={[
            'Full name',
            'Username',
            'E-mail address',
            'Password — stored exclusively as an encrypted hash (bcrypt), never in plain text',
          ]} />
        </SubSection>
        <SubSection title="During use of the service">
          <DataList items={[
            'Language preferences',
            'Medication alert preferences',
            'Medication data entered by the user (name, expiration date, form, quantity)',
          ]} />
        </SubSection>
        <p className="text-gray-500 text-sm mt-4">
          We do not use tracking cookies, Google Analytics, Facebook Pixel, or any other analytics tools.
        </p>
      </Section>

      {/* 3 */}
      <Section title="3. Purpose and Legal Basis for Processing">
        <div className="space-y-4">
          <LegalBasis
            purpose="Managing user account and medication management"
            basis="Art. 6(1)(b) GDPR — processing necessary for the performance of a contract (provision of application services)"
          />
          <LegalBasis
            purpose="Service communications (downtime notices, updates, policy changes)"
            basis="Art. 6(1)(f) GDPR — legitimate interest of the controller (ensuring continuity and security of the service)"
          />
          <LegalBasis
            purpose="E-mail verification and password recovery"
            basis="Art. 6(1)(b) GDPR — performance of a contract"
          />
        </div>
      </Section>

      {/* 4 */}
      <Section title="4. How Long We Store Your Data">
        <div className="space-y-3 text-gray-300 leading-relaxed">
          <p>
            <span className="text-gray-200 font-medium">Account data</span> — stored for the entire duration of the account.
            Upon deletion, all your data is permanently and irreversibly removed from the database.
          </p>
          <p>
            <span className="text-gray-200 font-medium">Medication data</span> — automatically deleted together with your account
            (cascading deletion at database level). It cannot be recovered after account deletion.
          </p>
          <p>
            <span className="text-gray-200 font-medium">Security tokens</span> (email verification: 24h, password reset: 30 min,
            session: 1h) — automatically deleted upon expiry by a built-in cleanup mechanism.
          </p>
        </div>
      </Section>

      {/* 5 */}
      <Section title="5. Who We Share Your Data With">
        <p className="text-gray-300 leading-relaxed font-medium text-lg mb-4">
          Nobody. And we never will.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          Your personal data is not sold, rented, or transferred to any third parties for marketing,
          advertising, or any other commercial purposes.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          The only parties involved in the technical processing of data are:
        </p>
        <div className="space-y-3">
          <InfoItem
            title="Oracle Cloud Infrastructure (EU)"
            description="Application server and database located in the European region (Frankfurt, Germany). Data does not leave the European Economic Area."
          />
          <InfoItem
            title="External e-mail server (SMTP)"
            description="Used solely to deliver messages (account verification, password reset, service notices). The provider does not process your data for any other purpose."
          />
        </div>
      </Section>

      {/* 6 */}
      <Section title="6. Your Rights">
        <p className="text-gray-400 leading-relaxed mb-4">Under GDPR, you have the following rights:</p>
        <div className="space-y-3">
          <Right title="Right of access" description="You may ask at any time what data we hold about you." />
          <Right title="Right to rectification" description="If your data is inaccurate or incomplete, you can correct it in account settings." />
          <Right title="Right to erasure" description="You can delete your account in settings — all your data will be immediately and permanently deleted. It cannot be recovered." />
          <Right title="Right to restriction of processing" description="You may request restriction of processing in certain circumstances." />
          <Right title="Right to data portability" description="You may request that your data be provided in a structured, commonly used format." />
          <Right title="Right to object" description="You may object to processing based on legitimate interest." />
        </div>
        <p className="text-gray-400 text-sm mt-6 leading-relaxed">
          You also have the right to lodge a complaint with a supervisory authority. In Poland: Prezes Urzędu Ochrony Danych
          Osobowych (PUODO), ul. Stawki 2, 00-193 Warsaw. In your country of residence, you may contact your local data
          protection authority.
        </p>
      </Section>

      {/* 7 */}
      <Section title="7. Data Security">
        <p className="text-gray-400 leading-relaxed mb-4">
          I apply multi-layered technical safeguards to protect your data:
        </p>
        <DataList items={[
          'Passwords stored exclusively as bcrypt hashes — even I do not know your password',
          'Encrypted HTTPS connection across the entire site',
          'JWT tokens with a short lifespan (1 hour) — minimising risk in the event of a leak',
          'Accounts automatically locked after repeated failed login attempts',
          'Rate limiting — protection against brute-force attacks',
          'User data isolation — each user can only see their own data',
        ]} />
      </Section>

      {/* 8 */}
      <Section title="8. Changes to This Privacy Policy">
        <p className="text-gray-400 leading-relaxed">
          In the event of significant changes to this privacy policy, I will notify you in advance —
          by e-mail or via a notice on the site. The date of the last update is always visible at the
          top of this page. I encourage you to review it periodically.
        </p>
      </Section>

      {/* 9 */}
      <Section title="9. Contact Regarding Personal Data">
        <p className="text-gray-400 leading-relaxed">
          If you have any questions about how your personal data is processed, wish to exercise your rights,
          or have any concerns — please write to me. I will treat every request seriously and respond as
          quickly as possible.
        </p>
        <a
          href="mailto:mateusz.nawratek@outlook.com"
          className="inline-block mt-4 text-primary-400 hover:text-primary-300 transition-colors font-medium"
        >
          mateusz.nawratek@outlook.com
        </a>
      </Section>
    </div>
  );
}

// ==================== Sub-komponenty ====================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 sm:p-8">
      {title && <h2 className="text-xl font-semibold text-gray-100 mb-5">{title}</h2>}
      {children}
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">{title}</h3>
      {children}
    </div>
  );
}

function DataList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-gray-400 text-sm leading-relaxed">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function LegalBasis({ purpose, basis }: { purpose: string; basis: string }) {
  return (
    <div className="bg-dark-700/50 rounded-xl p-4">
      <p className="text-gray-200 font-medium text-sm mb-1">{purpose}</p>
      <p className="text-gray-500 text-sm leading-relaxed">{basis}</p>
    </div>
  );
}

function InfoItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-dark-700/50 rounded-xl p-4">
      <p className="text-gray-200 font-medium text-sm mb-1">{title}</p>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Right({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
      <div>
        <span className="text-gray-200 font-medium text-sm">{title}</span>
        <span className="text-gray-500 text-sm"> — {description}</span>
      </div>
    </div>
  );
}
