'use client';

import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { Wallet, Check, X, FileText } from 'lucide-react';

export default function ExpenseManager() {
  const { expenses, updateExpense, workforce } = useEnterpriseStore();

  const handleApprove = (id: string) => updateExpense(id, { status: 'Approved' });
  const handleReject = (id: string) => updateExpense(id, { status: 'Rejected' });
  const handlePay = (id: string) => updateExpense(id, { status: 'Paid' });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'Approved': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Paid': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Expense & Travel Management</h2>
          <p className="text-sm text-gray-400">Review, approve, and process field force expense claims.</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-950/50 text-gray-400 border-b border-white/10 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Claim ID</th>
                <th className="px-6 py-4">Worker</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Notes</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {expenses.map(expense => {
                const worker = workforce.find(w => w.id === expense.workerId);
                return (
                  <tr key={expense.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-emerald-500">{expense.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{worker ? worker.name : expense.workerId}</td>
                    <td className="px-6 py-4">{expense.category}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-white">₹{expense.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(expense.status)}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-gray-400" title={expense.notes}>
                      {expense.notes}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {expense.status === 'Pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleApprove(expense.id)} className="p-1.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="Approve">
                            <Check size={16} />
                          </button>
                          <button onClick={() => handleReject(expense.id)} className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Reject">
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      {expense.status === 'Approved' && (
                        <button onClick={() => handlePay(expense.id)} className="px-3 py-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors text-xs font-semibold">
                          Mark Paid
                        </button>
                      )}
                      {expense.status === 'Paid' && (
                        <span className="text-xs text-gray-500 flex items-center justify-end gap-1"><Wallet size={12}/> Processed</span>
                      )}
                      {expense.status === 'Rejected' && (
                        <span className="text-xs text-red-500 flex items-center justify-end gap-1"><X size={12}/> Declined</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
