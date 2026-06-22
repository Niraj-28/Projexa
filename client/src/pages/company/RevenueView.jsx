import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const RevenueView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const res = await api.get('/companies/platform-revenue');
        if (res.data?.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load system revenue statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <span className="text-xs font-light">Loading revenue details...</span>
      </div>
    );
  }

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">System Revenue</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light">Monitor monthly recurring revenue, active subscription tiers, and transaction statistics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">MRR (Monthly)</span>
          <p className="text-2xl font-medium text-white mt-1">{formatPrice(data?.mrr || 0)}</p>
        </div>
        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">ARR (Annual)</span>
          <p className="text-2xl font-medium text-white mt-1">{formatPrice(data?.arr || 0)}</p>
        </div>
        <div className="bg-[#131313] border border-[#1C1C1C] p-5 rounded-2xl">
          <span className="text-[10px] text-[#646464] font-semibold uppercase tracking-wider block">Active Tiers</span>
          <p className="text-2xl font-medium text-green-400 mt-1">{data?.totalCount || 0} Workspaces</p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Transaction History (Onboardings)</h3>
        {data?.transactions?.length === 0 ? (
          <p className="text-xs text-[#646464] py-4 text-center font-light">No transaction activity recorded yet.</p>
        ) : (
          <div className="space-y-3.5 text-xs text-[#B5B5B5] font-light">
            {data?.transactions?.map((txn) => (
              <div key={txn.id} className="flex justify-between items-center py-2 border-b border-[#1C1C1C] last:border-0">
                <div>
                  <p className="font-semibold text-white">{txn.company}</p>
                  <p className="text-[10px] text-[#646464] font-mono">{txn.id} • {txn.plan}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{txn.amount}</p>
                  <p className="text-[10px] text-[#646464]">{txn.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueView;
