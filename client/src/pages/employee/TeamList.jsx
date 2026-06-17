import React from 'react';
import { Users, Mail, Phone, Clock } from 'lucide-react';

const TeamList = () => {
  const team = [
    { id: 1, name: 'Alex Peterson', role: 'Developer', email: 'alex@company.com', status: 'In Office', checkIn: '09:02 AM' },
    { id: 2, name: 'Jane Doe', role: 'Designer', email: 'jane@company.com', status: 'In Office', checkIn: '08:55 AM' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Team Members</h1>
        <p className="text-xs text-[#B5B5B5] mt-1 font-light">View attendance status and contact details of your project team.</p>
      </div>

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
                <span>{t.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#646464]">Status</span>
                <span className="text-green-400 font-medium">{t.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#646464]">Checked In</span>
                <span>{t.checkIn}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamList;
