import React from 'react';
import { FileBarChart2, Download, Printer, Filter, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ReportsView = () => {
  const handleExport = async (endpoint, filename) => {
    try {
      toast.loading('Generating CSV report...', { id: 'csv-export' });
      const res = await api.get(endpoint, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully!', { id: 'csv-export' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to export CSV report', { id: 'csv-export' });
    }
  };

  const reportTiers = [
    {
      title: 'Employee Demographics Report',
      description: 'Workspace demographics, headcount growth, and active role distributions.',
      route: '/reports/employees',
      exportUrl: '/users/export',
      filename: 'employees_report.csv'
    },
    {
      title: 'Attendance log & delays',
      description: 'Workspace-wide shift hours, clock-in times, late flags, and perfect attendance records.',
      route: '/reports/attendance',
      exportUrl: '/attendance/export',
      filename: 'attendance_report.csv'
    },
    {
      title: 'Project sprint metrics',
      description: 'Active projects, statuses distributions, lead assignments, and milestones lists.',
      route: '/reports/projects',
      exportUrl: '/projects/export',
      filename: 'projects_report.csv'
    },
    {
      title: 'Tasks completion speeds',
      description: 'Sprint task completion velocities, backlogs queues, and prioritizations data.',
      route: '/reports/tasks',
      exportUrl: '/tasks/export',
      filename: 'tasks_report.csv'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Workspace Reports</h1>
          <p className="text-xs text-[#B5B5B5] mt-1 font-light">Generate, download, and review detailed workspace metrics and analytics.</p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-3">
          <h3 className="font-semibold text-white text-sm">Reports Desk</h3>
          <Filter className="h-4 w-4 text-[#646464]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light text-[#B5B5B5]">
          {reportTiers.map((r, idx) => (
            <div key={idx} className="p-4 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-1 min-w-0 flex-1">
                <Link to={r.route} className="font-medium text-white hover:text-[#B5B5B5] flex items-center gap-1">
                  <span>{r.title}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                </Link>
                <p className="text-[10px] text-[#646464] leading-relaxed truncate">{r.description}</p>
              </div>
              <button 
                onClick={() => handleExport(r.exportUrl, r.filename)}
                className="text-[10px] font-bold text-white hover:text-[#B5B5B5] uppercase bg-[#1C1C1C] hover:bg-[#2C2C2C] border border-[#3C3C3C]/40 px-3 py-2 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
