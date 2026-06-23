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
        <h1 className="text-3xl font-semibold text-white tracking-tight">Notifications</h1>
        <p className="text-sm text-[#B5B5B5] mt-1.5 font-light">Stay updated with task milestones, leaves approvals, and attendance alerts.</p>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 hover-card">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-3">
            <h3 className="font-semibold text-white text-[15px]">Workspace Alerts</h3>
            <span className="text-xs text-[#646464] font-medium">{alerts.length} Alerts</span>
          </div>

          {loading ? (
            <div className="p-10 flex items-center justify-center text-[#B5B5B5] gap-2 text-sm">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading notifications...
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#646464]">
              No notifications yet. Task, leave, project, and attendance activity will appear here.
            </div>
          ) : (
            <div className="divide-y divide-[#1C1C1C]">
              {alerts.map((alert) => (
                <div key={alert._id || alert.id} className="py-4 flex gap-4 text-sm font-light text-[#B5B5B5] hover-row rounded-lg px-2 -mx-2">
                  <div className="h-10 w-10 rounded-xl bg-[#0D0D0D] border border-[#1C1C1C] flex items-center justify-center shrink-0">
                    {iconForType(alert.type)}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex justify-between items-center gap-3">
                      <p className="font-semibold text-white leading-none truncate text-[15px]">{alert.title}</p>
                      <span className="text-xs text-[#646464] font-mono shrink-0">{formatTime(alert.createdAt)}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-[#B5B5B5]/90">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsView;
