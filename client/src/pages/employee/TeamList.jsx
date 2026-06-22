import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Clock, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const TeamList = () => {
  const { user: currentUser } = useAuth();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        // Get all users in company
        const userRes = await api.get('/users');
        
        // Get today's local date string YYYY-MM-DD (timezone aligned)
        const localDate = new Date();
        const offset = localDate.getTimezoneOffset();
        const adjustedDate = new Date(localDate.getTime() - (offset * 60 * 1000));
        const todayStr = adjustedDate.toISOString().split('T')[0];

        // Get attendance logs
        let attendanceLogs = [];
        try {
          const attendanceRes = await api.get('/attendance');
          if (attendanceRes.data?.success) {
            attendanceLogs = attendanceRes.data.logs || [];
          }
        } catch (e) {
          console.error('Failed to load attendance logs:', e);
        }

        if (userRes.data?.success) {
          const usersList = userRes.data.users || [];
          // Filter out the current user and retain employees/managers
          const members = usersList.filter(u => u._id !== currentUser?.id && u.role === 'employee');

          const enrichedMembers = members.map(m => {
            // Find today's log
            const log = attendanceLogs.find(l => l.user?._id === m._id && l.date === todayStr);
            let statusText = 'Absent';
            let checkInTime = '--';
            let checkOutTime = '';

            if (log) {
              if (log.checkOut) {
                statusText = 'Checked Out';
                checkInTime = log.checkIn;
                checkOutTime = log.checkOut;
              } else {
                statusText = 'In Office';
                checkInTime = log.checkIn;
              }
            }

            return {
              id: m._id,
              name: m.name,
              role: m.designation || 'Team Member',
              email: m.email,
              phone: m.phone || '--',
              status: statusText,
              checkIn: checkInTime,
              checkOut: checkOutTime,
            };
          });

          setTeam(enrichedMembers);
        }
      } catch (err) {
        console.error('Failed to fetch team members:', err);
        toast.error('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [currentUser]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Team Members</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light">View attendance status and contact details of your project team.</p>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2 bg-[#131313] border border-[#1C1C1C] rounded-2xl">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
          <span className="text-xs">Loading team status...</span>
        </div>
      ) : team.length === 0 ? (
        <div className="p-12 text-center text-[#646464] text-xs font-light bg-[#131313] border border-[#1C1C1C] rounded-2xl">
          No other team members found in this company workspace.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {team.map((t) => (
            <div key={t.id} className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-5 space-y-4 hover:border-[#3C3C3C] transition-all">
              <div className="flex items-center space-x-3.5">
                <div className="h-10 w-10 rounded-full bg-[#1C1C1C] border border-[#3C3C3C] flex items-center justify-center font-bold text-white uppercase text-sm">
                  {t.name.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{t.name}</h3>
                  <p className="text-[10px] text-[#646464]">{t.role}</p>
                </div>
              </div>

              <div className="border-t border-[#1C1C1C] pt-3 space-y-2 text-xs text-[#B5B5B5] font-light">
                <div className="flex justify-between">
                  <span className="text-[#646464]">Email</span>
                  <span className="text-white">{t.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#646464]">Phone</span>
                  <span className="text-white">{t.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#646464]">Status</span>
                  <span className={`font-semibold ${
                    t.status === 'In Office' ? 'text-green-400' :
                    t.status === 'Checked Out' ? 'text-blue-400' : 'text-red-400'
                  }`}>{t.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#646464]">Checked In</span>
                  <span className="text-white">{t.checkIn}</span>
                </div>
                {t.checkOut && (
                  <div className="flex justify-between">
                    <span className="text-[#646464]">Checked Out</span>
                    <span className="text-white">{t.checkOut}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamList;
