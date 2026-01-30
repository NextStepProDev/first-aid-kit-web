import React from 'react';
import { Card } from '../components/ui';
import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  title: string;
  rating: number;
  text: string;
  footnote?: string;
  lang: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Elon from X',
    title: 'CEO wszystkiego',
    rating: 5,
    text: 'This app is mass efficient. I replaced the entire SpaceX medical bay with one phone running First Aid Kit. Mars colonists will use this.',
    footnote: 'Tu Donald, Elon mówi prawdę.',
    lang: 'EN',
  },
  {
    name: 'Sundar',
    title: 'CEO Google',
    rating: 4.5,
    text: 'Próbowaliśmy zrobić coś podobnego w Google, ale po trzech reorganizacjach projekt trafił do archiwum. Pół gwiazdki zabieram za to, że nie ma trybu ciemnego... a nie, jest.',
    lang: 'PL',
  },
  {
    name: 'Mark od fejsa',
    title: 'Meta Lord',
    rating: 5,
    text: 'I tried to buy this app for $10 billion but they said no. Respect. While we build entertainment in the Metaverse, they built something that can actually helps people.',
    lang: 'EN',
  },
  {
    name: 'Albert Bourla',
    title: 'CEO Pfizer',
    rating: 1,
    text: 'This app tells people their meds expire. That\'s very bad for our business model. One star. Would give zero if I could.',
    lang: 'EN',
  },
  {
    name: 'Darek z Radomia',
    title: 'Użytkownik premium',
    rating: 5,
    text: 'Wreszcie wiem, że moja aspiryna z 2014 roku nie nadaje się do użytku. Aplikacja uratowała mi życie, a przynajmniej żołądek.',
    lang: 'PL',
  },
  {
    name: 'Jarosław z Żoliborza',
    title: 'Prezes',
    rating: 5,
    text: 'Aplikacja działa sprawnie jak moja partia. Wszystko pod kontrolą. Przyznaję, że na początku miałem problem żeby się odnaleźć w tym ekosystemie, ale po przeczytaniu FAQ w zakładce „Kontakt" pod koniec dnia wszystko stało się może nie banalnie proste ale do ogarnięcia.',
    lang: 'PL',
  },
  {
    name: 'Pierwsza dama',
    title: 'Prawniczka',
    rating: 5,
    text: 'Elegancka aplikacja. Interfejs czysty jak moje sumienie. Polecam każdemu, kto chce mieć porządek w apteczce i w życiu.',
    lang: 'PL',
  },
  {
    name: 'Julia z Warszawy',
    title: 'Influencerka zdrowia',
    rating: 5,
    text: 'OMG! Ta appka jest total must-have! Zrobiłam unboxing mojej apteczki na live i wszyscy pytali skąd mam taką organizację. First Aid Kit, oczywiście!',
    lang: 'PL',
  },
  {
    name: 'Zbigniew z Łodzi',
    title: 'Rencista',
    rating: 5,
    text: 'Gdy pokazałem w banku ile zaoszczędziłem po miesiącu użytkowania tej aplikacji dostałem kredyt hipoteczny od ręki, mimo że mam 84 lata i moje jedyne źródło utrzymania to renta inwalidzka!',
    lang: 'PL',
  },
];

const AVATAR_COLORS = [
  'bg-primary-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-indigo-500',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      );
    } else if (i - 0.5 === rating) {
      stars.push(
        <span key={i} className="relative w-4 h-4">
          <Star className="w-4 h-4 text-gray-600 fill-gray-600 absolute inset-0" />
          <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </span>
        </span>
      );
    } else {
      stars.push(
        <Star key={i} className="w-4 h-4 text-gray-600 fill-gray-600" />
      );
    }
  }
  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className="ml-2 text-sm text-gray-400">{rating}/5</span>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = getInitials(testimonial.name);
  const colorClass = getAvatarColor(testimonial.name);

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 flex flex-col">
      <StarRating rating={testimonial.rating} />

      <p className="text-gray-300 leading-relaxed mt-4 flex-1">
        "{testimonial.text}"
      </p>

      <div className="flex items-center gap-3 mt-5">
        <div
          className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}
        >
          <span className="text-sm font-bold text-white">{initials}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-200">{testimonial.name}</p>
          <p className="text-xs text-gray-500">{testimonial.title}</p>
        </div>
      </div>

      {testimonial.footnote && (
        <p className="text-xs text-gray-500 italic mt-4 pt-3 border-t border-dark-600">
          {testimonial.footnote}
        </p>
      )}
    </div>
  );
}

export function AboutUsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100">O nas</h1>
        <p className="text-gray-400 mt-1">
          Poznaj zespół stojący za najlepszą aplikacją do zarządzania apteczką na świecie.
        </p>
      </div>

      {/* Intro Card */}
      <Card title="Kim jesteśmy?">
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Jesteśmy startupem, który wierzy, że Twoja domowa apteczka zasługuje
            na system zarządzania klasy enterprise. Pomagamy kontrolować zapasy
            leków, pilnować terminów ważności i podejmować lepsze decyzje
            zdrowotne — prosto, wygodnie i bez marnowania pieniędzy.
          </p>

          <p className="text-gray-300 leading-relaxed">
            Nie musisz wierzyć nam na słowo. Zobacz, co mówią o nas inni:
          </p>
        </div>
      </Card>

      {/* Testimonials */}
      <div>
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Co mówią o nas ludzie
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
