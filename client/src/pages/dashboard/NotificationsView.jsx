import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Bell, Clock, CalendarDays, CheckSquare, Loader2 } from 'lucide-react';

const NotificationsView = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await api.get('/notifications');
        if (res.data && res.data.success) {
          setAlerts(res.data.notifications);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const iconForType = (type) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="h-5 w-5 text-green-400" />;
      case 'leave':
        return <CalendarDays className="h-5 w-5 text-yellow-400" />;
      case 'attendance':
        return <Clock className="h-5 w-5 text-red-400" />;
      default:
        return <Bell className="h-5 w-5 text-blue-400" />;
    }
  };

  const formatTime = (date) => {
    if (!date) return 'Just now';
    return new Date(date).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#01161E] tracking-tight font-heading">Notifications</h1>
        <p className="text-xs text-[#598392] mt-1.5 font-light">Stay updated with task milestones, leaves approvals, and attendance alerts.</p>
      </div>

      <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] p-6 hover-card shadow-premium">
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-[#598392] gap-2 text-xs font-semibold">
              <Loader2 className="h-5 w-5 animate-spin text-[#124559]" />
              <span>Loading notifications...</span>
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#94A3B8] font-medium leading-relaxed">
              No notifications yet. Task, leave, project, and attendance activity will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">
                    <th className="pb-3 pl-4">Event</th>
                    <th className="pb-3 text-center">Description</th>
                    <th className="pb-3 pr-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {alerts.map((alert) => (
                    <tr key={alert._id || alert.id} className="group transition-colors duration-150">
                      {/* Left: Event Title and Type */}
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-[#124559]/5 border border-[#124559]/10 flex items-center justify-center shrink-0 shadow-sm">
                            {iconForType(alert.type)}
                          </div>
                          <div>
                            <span className="font-bold text-[#01161E] text-[13px] block leading-tight">{alert.title}</span>
                            <span className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider block mt-0.5">{alert.type}</span>
                          </div>
                        </div>
                      </td>
                      {/* Center: Description message (centered as requested) */}
                      <td className="py-4 text-center text-xs font-semibold text-[#598392] max-w-sm px-4 leading-relaxed">
                        {alert.message}
                      </td>
                      {/* Right: Time */}
                      <td className="py-4 pr-4 text-right text-xs text-[#94A3B8] font-semibold tracking-tight">
                        {formatTime(alert.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsView;
