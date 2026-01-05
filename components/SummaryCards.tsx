import React from 'react';
import { DollarSign, PieChart, Wallet, CreditCard } from 'lucide-react';
import { BudgetSummary } from '../types';

interface SummaryCardsProps {
  summary: BudgetSummary;
  onUpdateBudget: (newBudget: number) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, onUpdateBudget }) => {
  const remaining = summary.totalBudget - summary.totalActual;
  const percentageSpent = summary.totalBudget > 0 ? (summary.totalActual / summary.totalBudget) * 100 : 0;

  const handleBudgetClick = () => {
    const newBudget = prompt("Enter new total budget:", summary.totalBudget.toString());
    if (newBudget && !isNaN(Number(newBudget))) {
      onUpdateBudget(Number(newBudget));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Budget */}
      <div 
        onClick={handleBudgetClick}
        className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 cursor-pointer hover:border-rose-300 transition-colors group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-stone-100 rounded-lg group-hover:bg-rose-50 transition-colors">
            <Wallet className="w-6 h-6 text-stone-600 group-hover:text-rose-500" />
          </div>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Total Budget</span>
        </div>
        <h3 className="font-serif text-3xl text-stone-800">${summary.totalBudget.toLocaleString()}</h3>
        <p className="text-sm text-stone-500 mt-2">Click to edit</p>
      </div>

      {/* Actual Cost */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <DollarSign className="w-6 h-6 text-blue-500" />
          </div>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Total Cost</span>
        </div>
        <h3 className="font-serif text-3xl text-stone-800">${summary.totalActual.toLocaleString()}</h3>
        <p className="text-sm text-stone-500 mt-2">
            Est: ${summary.totalEstimated.toLocaleString()}
        </p>
      </div>

      {/* Paid So Far */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-green-50 rounded-lg">
            <CreditCard className="w-6 h-6 text-green-500" />
          </div>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Paid</span>
        </div>
        <h3 className="font-serif text-3xl text-stone-800">${summary.totalPaid.toLocaleString()}</h3>
        <div className="w-full bg-stone-100 rounded-full h-1.5 mt-3">
            <div 
                className="bg-green-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (summary.totalPaid / (summary.totalActual || 1)) * 100)}%` }}
            ></div>
        </div>
      </div>

       {/* Remaining */}
       <div className={`p-6 rounded-xl shadow-sm border ${remaining < 0 ? 'bg-red-50 border-red-200' : 'bg-white border-stone-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${remaining < 0 ? 'bg-red-100' : 'bg-rose-50'}`}>
            <PieChart className={`w-6 h-6 ${remaining < 0 ? 'text-red-500' : 'text-rose-500'}`} />
          </div>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Remaining</span>
        </div>
        <h3 className={`font-serif text-3xl ${remaining < 0 ? 'text-red-600' : 'text-stone-800'}`}>
            ${remaining.toLocaleString()}
        </h3>
        <p className="text-sm text-stone-500 mt-2">
            {remaining < 0 ? 'Over Budget!' : `${(100 - percentageSpent).toFixed(1)}% available`}
        </p>
      </div>
    </div>
  );
};