import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { Charts } from './components/Charts';
import { ExpenseList } from './components/ExpenseList';
import { GeminiAdvisor } from './components/GeminiAdvisor';
import { Expense, BudgetSummary, WeddingCategory } from './types';

// Mock initial data
const INITIAL_EXPENSES: Expense[] = [
  { id: '1', item: 'Reception Venue Rental', category: WeddingCategory.VENUE, estimatedCost: 5000, actualCost: 5500, paid: 5500 },
  { id: '2', item: 'Catering Package (100 guests)', category: WeddingCategory.VENUE, estimatedCost: 8000, actualCost: 8200, paid: 2000 },
  { id: '3', item: 'Bridal Gown', category: WeddingCategory.ATTIRE, estimatedCost: 2000, actualCost: 1800, paid: 1800 },
  { id: '4', item: 'Photographer', category: WeddingCategory.PHOTO, estimatedCost: 3000, actualCost: 3500, paid: 1000 },
];

const INITIAL_BUDGET = 30000;

function App() {
  const [totalBudget, setTotalBudget] = useState(INITIAL_BUDGET);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);

  // Computed Summary
  const summary: BudgetSummary = useMemo(() => {
    return expenses.reduce((acc, curr) => ({
      totalBudget: totalBudget,
      totalEstimated: acc.totalEstimated + curr.estimatedCost,
      totalActual: acc.totalActual + curr.actualCost,
      totalPaid: acc.totalPaid + curr.paid
    }), { totalBudget: totalBudget, totalEstimated: 0, totalActual: 0, totalPaid: 0 });
  }, [expenses, totalBudget]);

  // Handlers
  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExpenses([...expenses, expense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <Header 
        coupleName="Alex & Sam" 
        weddingDate="September 15, 2024" 
        daysToGo={142} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SummaryCards 
          summary={summary} 
          onUpdateBudget={setTotalBudget} 
        />

        <Charts expenses={expenses} />

        <ExpenseList 
          expenses={expenses} 
          onAdd={addExpense} 
          onDelete={deleteExpense}
          onUpdate={updateExpense}
        />
        
      </main>

      <GeminiAdvisor expenses={expenses} totalBudget={totalBudget} />
      
      {/* Footer */}
      <footer className="mt-12 text-center text-stone-400 text-sm pb-8">
        <p>© 2024 BlissBudget. All data is stored locally.</p>
      </footer>
    </div>
  );
}

export default App;