import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Clock, MessageSquare, Send, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'Alex Lead', text: 'Please complete this before Friday code freeze.', date: 'Yesterday' }
  ]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const res = await api.get('/tasks');
        if (res.data && res.data.success) {
          const target = res.data.tasks.find(t => t._id === id);
          setTask(target || null);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load task details');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([...comments, {
      id: Date.now(),
      author: 'You',
      text: newComment,
      date: 'Just now'
    }]);
    setNewComment('');
    toast.success('Comment added');
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#64748B] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#5A42EC]" />
        <span className="text-xs">Loading task details...</span>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/tasks')} className="flex items-center space-x-1.5 text-xs text-[#64748B] hover:text-[#0F172A] transition">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Tasks</span>
        </button>
        <div className="p-6 text-center text-[#94A3B8] text-xs font-light bg-white border border-[#E2E8F0]/80 rounded-[20px] shadow-sm">
          Task not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/tasks')} className="p-2 bg-[#F4F5F9] border border-[#E2E8F0] rounded-xl text-[#64748B] hover:text-[#0F172A] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight font-heading">{task.title}</h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-light">Sprint task ID: {task._id}</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] p-6 space-y-6 shadow-sm">
        <div className="space-y-3.5 text-xs text-[#64748B] font-light">
          <p className="text-sm font-bold text-[#0F172A] font-heading">Task Specification</p>
          <p className="leading-relaxed bg-[#F4F5F9] border border-[#E2E8F0]/60 p-4 rounded-2xl text-[#0F172A] font-normal">
            {task.description || 'No description provided.'}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-[#94A3B8] block font-bold text-[10px] uppercase">Assignee</span>
              <span className="text-[#0F172A] flex items-center gap-1.5 pt-1 font-bold">
                <User className="h-3.5 w-3.5" />
                {task.assignee?.name || 'Unassigned'}
              </span>
            </div>
            <div>
              <span className="text-[#94A3B8] block font-bold text-[10px] uppercase">Project</span>
              <span className="text-[#0F172A] pt-1 block font-mono font-bold">{task.project?.name || 'Workspace Project'}</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block font-bold text-[10px] uppercase">Priority</span>
              <span className="text-[#5A42EC] pt-1 block font-extrabold uppercase text-[10px]">{task.priority}</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block font-bold text-[10px] uppercase">Status</span>
              <span className="text-[#0F172A] pt-1 block font-bold uppercase text-[10px]">{task.status.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-[#E2E8F0]/60 pt-6 space-y-4">
          <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 font-heading">
            <MessageSquare className="h-4 w-4" />
            <span>Developer Comments</span>
          </h3>

          <div className="space-y-3">
            {comments.map(c => (
              <div key={c.id} className="bg-[#F4F5F9] border border-[#E2E8F0]/60 p-3 rounded-2xl text-xs space-y-1.5 text-[#64748B]">
                <div className="flex justify-between font-bold">
                  <span className="text-[#0F172A]">{c.author}</span>
                  <span className="text-[10px] text-[#94A3B8] font-light">{c.date}</span>
                </div>
                <p className="font-light leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handlePostComment} className="flex gap-3 pt-2">
            <input
              type="text"
              placeholder="Post a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="flex-grow bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200"
            />
            <button type="submit" className="p-2.5 bg-[#5A42EC] text-white hover:bg-[#4831D4] hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm shadow-[#5A42EC]/20 rounded-xl cursor-pointer">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
