import React from 'react';
import { Heart, Calendar } from 'lucide-react';

interface HeaderProps {
  coupleName: string;
  weddingDate: string;
  daysToGo: number;
}

export const Header: React.FC<HeaderProps> = ({ coupleName, weddingDate, daysToGo }) => {
  return (
    <header className="bg-white border-b border-stone-100 shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-rose-500 mb-2">
              <Heart className="w-5 h-5 fill-current" />
              <span className="uppercase tracking-widest text-xs font-semibold">Wedding Budget Tracker</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-stone-800 mb-2">{coupleName}</h1>
          </div>
          
          <div className="flex items-center gap-6 bg-rose-50 px-6 py-4 rounded-xl border border-rose-100">
            <div className="flex flex-col">
                <div className="flex items-center gap-2 text-stone-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">{weddingDate}</span>
                </div>
                <div className="text-2xl font-serif text-rose-600">
                    {daysToGo} <span className="text-sm font-sans text-stone-500 font-normal">Days to go</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};