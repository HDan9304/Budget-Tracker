import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Expense } from '../types';

interface ChartsProps {
  expenses: Expense[];
}

const COLORS = ['#f43f5e', '#fb7185', '#fda4af', '#e11d48', '#be123c', '#881337', '#9f1239', '#fbbf24'];

export const Charts: React.FC<ChartsProps> = ({ expenses }) => {
  
  const dataByCategory = React.useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach(e => {
        const current = map.get(e.category) || 0;
        map.set(e.category, current + e.actualCost);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).filter(i => i.value > 0);
  }, [expenses]);

  if (expenses.length === 0) {
      return (
          <div className="flex items-center justify-center h-64 bg-stone-50 rounded-xl border border-stone-200 border-dashed">
              <p className="text-stone-400 italic">Add expenses to see analytics</p>
          </div>
      )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <h3 className="font-serif text-xl text-stone-800 mb-6">Spending by Category</h3>
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={dataByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {dataByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value: number) => `$${value.toLocaleString()}`}
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e7e5e4' }}
                    />
                    <Legend iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

       {/* Estimated vs Actual */}
       <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <h3 className="font-serif text-xl text-stone-800 mb-6">Estimated vs Actual Costs</h3>
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={dataByCategory.slice(0, 5)} // Top 5 categories to avoid clutter
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 12}} />
                    <Tooltip 
                        formatter={(value: number) => `$${value.toLocaleString()}`}
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e7e5e4' }}
                    />
                    <Bar dataKey="value" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Actual Cost" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};