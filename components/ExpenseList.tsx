import React, { useState } from 'react';
import { Trash2, Plus, Edit2, CheckCircle, Circle, X } from 'lucide-react';
import { Expense, WeddingCategory } from '../types';
import { categorizeExpenseItem } from '../services/geminiService';

interface ExpenseListProps {
  expenses: Expense[];
  onAdd: (expense: Omit<Expense, 'id'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Expense>) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onAdd, onDelete, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    item: '',
    category: WeddingCategory.MISC,
    estimatedCost: '',
    actualCost: '',
    paid: ''
  });

  const handleAddItem = async () => {
    if (!newItem.item) return;
    
    onAdd({
      item: newItem.item,
      category: newItem.category,
      estimatedCost: Number(newItem.estimatedCost) || 0,
      actualCost: Number(newItem.actualCost) || 0,
      paid: Number(newItem.paid) || 0,
    });
    setNewItem({ item: '', category: WeddingCategory.MISC, estimatedCost: '', actualCost: '', paid: '' });
    setIsAdding(false);
  };

  const handleBlurItem = async () => {
      // Auto-categorize when user leaves the item name field
      if (newItem.item && newItem.category === WeddingCategory.MISC) {
          setIsAiLoading(true);
          const aiCategory = await categorizeExpenseItem(newItem.item);
          // Find matching enum key if possible, otherwise keep as is or default
          const matchedCategory = Object.values(WeddingCategory).find(c => c === aiCategory) as WeddingCategory;
          if (matchedCategory) {
              setNewItem(prev => ({ ...prev, category: matchedCategory }));
          }
          setIsAiLoading(false);
      }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
        <h3 className="font-serif text-xl text-stone-800">Expense Details</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Item</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold text-right">Estimated</th>
              <th className="px-6 py-4 font-semibold text-right">Actual</th>
              <th className="px-6 py-4 font-semibold text-right">Paid</th>
              <th className="px-6 py-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {isAdding && (
              <tr className="bg-rose-50/30 animate-in fade-in">
                <td className="px-6 py-4">
                    <span className="text-xs text-stone-400">New</span>
                </td>
                <td className="px-6 py-4">
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="e.g. Wedding Cake" 
                    className="w-full bg-transparent border-b border-rose-200 focus:border-rose-500 focus:outline-none p-1"
                    value={newItem.item}
                    onChange={e => setNewItem({...newItem, item: e.target.value})}
                    onBlur={handleBlurItem}
                  />
                   {isAiLoading && <span className="text-xs text-rose-400 ml-1">✨ AI Categorizing...</span>}
                </td>
                <td className="px-6 py-4">
                  <select 
                    className="bg-transparent border-b border-stone-200 text-sm focus:outline-none py-1"
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value as WeddingCategory})}
                  >
                    {Object.values(WeddingCategory).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-24 text-right bg-transparent border-b border-stone-200 focus:outline-none p-1"
                    value={newItem.estimatedCost}
                    onChange={e => setNewItem({...newItem, estimatedCost: e.target.value})}
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-24 text-right bg-transparent border-b border-stone-200 focus:outline-none p-1"
                    value={newItem.actualCost}
                    onChange={e => setNewItem({...newItem, actualCost: e.target.value})}
                  />
                </td>
                <td className="px-6 py-4 text-right">
                   <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-24 text-right bg-transparent border-b border-stone-200 focus:outline-none p-1"
                    value={newItem.paid}
                    onChange={e => setNewItem({...newItem, paid: e.target.value})}
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={handleAddItem} className="text-green-600 hover:text-green-700 bg-green-100 p-1.5 rounded-md">
                        <Plus className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsAdding(false)} className="text-stone-400 hover:text-stone-600">
                        <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {expenses.map((expense) => {
                const isFullyPaid = expense.paid >= expense.actualCost && expense.actualCost > 0;
                return (
                <tr key={expense.id} className="hover:bg-stone-50 transition-colors group">
                    <td className="px-6 py-4">
                        <button 
                            onClick={() => onUpdate(expense.id, { paid: isFullyPaid ? 0 : expense.actualCost })}
                            className="transition-colors"
                        >
                            {isFullyPaid 
                                ? <CheckCircle className="w-5 h-5 text-green-500" /> 
                                : <Circle className="w-5 h-5 text-stone-300 group-hover:text-rose-400" />
                            }
                        </button>
                    </td>
                    <td className={`px-6 py-4 font-medium text-stone-800 ${isFullyPaid ? 'line-through text-stone-400' : ''}`}>
                        {expense.item}
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
                            {expense.category}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right text-stone-600 font-mono text-sm">
                        ${expense.estimatedCost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-stone-800 font-mono text-sm">
                        ${expense.actualCost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-stone-600 font-mono text-sm">
                        ${expense.paid.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                        <button 
                            onClick={() => onDelete(expense.id)}
                            className="text-stone-300 hover:text-red-500 transition-colors p-2"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </td>
                </tr>
            )})}
            
            {expenses.length === 0 && !isAdding && (
                 <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-stone-400">
                        No expenses added yet. Click "Add Expense" or ask Bliss for help.
                    </td>
                 </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};