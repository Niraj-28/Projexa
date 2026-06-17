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
        <h1 className="text-2xl font-semibold text-white tracking-tight">Registered Companies</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light">Monitor workspace creation activity and administrator emails.</p>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-[#1C1C1C] flex items-center">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#646464]" />
            <input
              type="text"
              placeholder="Search companies by name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#B5B5B5]"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
            <span className="text-xs">Loading companies...</span>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="p-12 text-center text-[#B5B5B5] text-xs font-light">
            No companies registered on this platform yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1C1C1C]/40 border-b border-[#1C1C1C] text-[#646464] font-semibold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-4">Company Name</th>
                  <th className="px-6 py-4">Workspace URL</th>
                  <th className="px-6 py-4">Admin</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Open</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C]">
                {filteredCompanies.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-[#1C1C1C]/20 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-lg bg-white/5 border border-[#1C1C1C] flex items-center justify-center text-[#B5B5B5]">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{c.name}</p>
                          <p className="text-[10px] text-[#646464]">{c.industry || 'Tech'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[#B5B5B5]">
                      /{c.workspaceUrl}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{c.adminName}</p>
                        <p className="text-[10px] text-[#646464]">{c.adminEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#3C3C3C] text-white uppercase border border-[#646464]/30">
                        {c.subscriptionPlan || 'Free'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-400 font-bold bg-green-500/10 px-1.5 py-0.5 rounded text-[9px]">
                        {c.status ? c.status.toUpperCase() : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/platform/company/${c._id || c.id}`}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white hover:text-[#B5B5B5]"
                      >
                        View
                        <ArrowUpRight className="h-3.5 w-3.5" />
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
