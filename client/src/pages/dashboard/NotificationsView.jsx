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
        return <CheckSquare className="h-4 w-4 text-green-400" />;
      case 'leave':
        return <CalendarDays className="h-4 w-4 text-yellow-400" />;
      case 'attendance':
        return <Clock className="h-4 w-4 text-red-400" />;
      default:
        return <Bell className="h-4 w-4 text-blue-400" />;
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
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Notifications</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light">Stay updated with task milestones, leaves approvals, and attendance alerts.</p>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-3">
            <h3 className="font-semibold text-white text-sm">Workspace Alerts</h3>
            <span className="text-[10px] text-[#646464] font-medium">{alerts.length} Alerts</span>
          </div>

          {loading ? (
            <div className="p-8 flex items-center justify-center text-[#B5B5B5] gap-2 text-xs">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading notifications...
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#646464]">
              No notifications yet. Task, leave, project, and attendance activity will appear here.
            </div>
          ) : (
            <div className="divide-y divide-[#1C1C1C]">
              {alerts.map((alert) => (
                <div key={alert._id || alert.id} className="py-4 flex gap-4 text-xs font-light text-[#B5B5B5]">
                  <div className="h-8 w-8 rounded-lg bg-[#0D0D0D] border border-[#1C1C1C] flex items-center justify-center shrink-0">
                    {iconForType(alert.type)}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex justify-between items-center gap-3">
                      <p className="font-semibold text-white leading-none truncate">{alert.title}</p>
                      <span className="text-[10px] text-[#646464] font-mono shrink-0">{formatTime(alert.createdAt)}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#B5B5B5]/90">{alert.message}</p>
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
