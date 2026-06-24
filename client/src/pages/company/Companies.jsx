import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Building2, Search, Loader2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await api.get('/companies');
        if (response.data && response.data.success) {
          setCompanies(response.data.companies);
        }
      } catch (err) {
        console.error('Failed to load companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.workspaceUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-[#0F172A] tracking-tight">Registered Companies</h1>
        <p className="text-sm text-[#64748B] mt-1.5 font-light">Monitor workspace creation activity and administrator emails.</p>
      </div>

      <div className="bg-[#F4F5F9] border border-[#E2E8F0] rounded-2xl overflow-hidden hover-card">
        {/* Search */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center">
          <div className="relative flex-grow max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search companies by name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F4F5F9] border border-[#E2E8F0] text-sm text-[#0F172A] rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#5A42EC] transition-all duration-200"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-14 flex flex-col items-center justify-center text-[#64748B] space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-[#0F172A]" />
            <span className="text-sm">Loading companies...</span>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="p-14 text-center text-[#64748B] text-sm font-light">
            No companies registered on this platform yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#F4F5F9] border-b border-[#E2E8F0] text-[#94A3B8] font-semibold uppercase tracking-wider text-xs">
                  <th className="px-6 py-4">Company Name</th>
                  <th className="px-6 py-4">Workspace URL</th>
                  <th className="px-6 py-4">Admin</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Open</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F5F9]">
                {filteredCompanies.map((c) => (
                  <tr key={c._id || c.id} className="hover-row">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-lg bg-white/5 border border-[#E2E8F0] flex items-center justify-center text-[#64748B]">
                          <Building2 className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#0F172A]">{c.name}</p>
                          <p className="text-xs text-[#94A3B8]">{c.industry || 'Tech'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[#64748B]">
                      /{c.workspaceUrl}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[#0F172A] font-medium">{c.adminName}</p>
                        <p className="text-xs text-[#94A3B8]">{c.adminEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-[#0F172A] uppercase">
                        {c.subscriptionPlan || 'Free'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold px-2 py-1 rounded text-[10px] ${c.status === 'Suspended' ? 'text-red-400' : 'text-green-400'
                        }`}>
                        {c.status ? c.status.toUpperCase() : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/platform/company/${c._id || c.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:text-[#64748B] transition-all duration-200"
                      >
                        View
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
