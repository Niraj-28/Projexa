import React, { useState } from 'react';
import { CalendarRange, CalendarCheck, HelpCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const LeaveRequests = () => {
  const [requests, setRequests] = useState([
    { id: 1, type: 'Medical Leave', start: '2026-07-02', end: '2026-07-04', reason: 'Dental appointment/surgery', status: 'Approved' },
    { id: 2, type: 'Casual Leave', start: '2026-08-14', end: '2026-08-16', reason: 'Family trip', status: 'Pending' },
  ]);

  const [formData, setFormData] = useState({
    type: 'Casual Leave',
    start: '',
    end: '',
    reason: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.start || !formData.end || !formData.reason) {
      return toast.error('Please fill in all leave request details.');
    }

    setSubmitting(true);
    setTimeout(() => {
      setRequests([{
        id: Date.now(),
        type: formData.type,
        start: formData.start,
        end: formData.end,
        reason: formData.reason,
        status: 'Pending',
      }, ...requests]);
      setFormData({ type: 'Casual Leave', start: '', end: '', reason: '' });
      setSubmitting(false);
      toast.success('Leave request submitted to Manager successfully!');
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Submit Form */}
      <div className="lg:col-span-5 bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4 h-max">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">Request Leave</h2>
          <p className="text-[10px] text-[#646464] mt-0.5">Submit a formal request for manager verification</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#646464] uppercase">Leave Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none"
            >
              <option value="Casual Leave">Casual Leave</option>
              <option value="Medical Leave">Medical Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#646464] uppercase">Start Date</label>
              <input
                type="date"
                name="start"
                value={formData.start}
                onChange={handleChange}
                className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-[#B5B5B5] rounded-lg p-2.5 focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[#646464] uppercase">End Date</label>
              <input
                type="date"
                name="end"
                value={formData.end}
                onChange={handleChange}
                className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-[#B5B5B5] rounded-lg p-2.5 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[#646464] uppercase">Reason</label>
            <textarea
              name="reason"
              placeholder="Provide a brief explanation..."
              rows={3}
              value={formData.reason}
              onChange={handleChange}
              className="bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg p-2.5 focus:outline-none resize-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-white hover:bg-[#B5B5B5] text-[#131313] py-2.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Request</span>
            )}
          </button>
        </form>
      </div>

      {/* Right Requests History */}
      <div className="lg:col-span-7 bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">Request History</h2>
          <p className="text-[10px] text-[#646464] mt-0.5">Track review decisions and status</p>
        </div>

        <div className="divide-y divide-[#1C1C1C]">
          {requests.map((req) => (
            <div key={req.id} className="py-4 flex items-center justify-between gap-4 text-xs font-light text-[#B5B5B5]">
              <div className="space-y-1">
                <p className="font-medium text-white">{req.type}</p>
                <p className="text-[10px] text-[#646464]">{req.reason}</p>
                <p className="text-[10px] text-[#B5B5B5] font-mono">{req.start} to {req.end}</p>
              </div>

              <div>
                <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${
                  req.status === 'Approved'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                }`}>
                  {req.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequests;
