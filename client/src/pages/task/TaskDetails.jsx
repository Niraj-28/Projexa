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
      <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <span className="text-xs">Loading task details...</span>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/tasks')} className="flex items-center space-x-1.5 text-xs text-[#B5B5B5] hover:text-white transition">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Tasks</span>
        </button>
        <div className="p-6 text-center text-[#646464] text-xs font-light bg-[#131313] border border-[#1C1C1C] rounded-2xl">
          Task not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/tasks')} className="p-2 bg-[#131313] border border-[#1C1C1C] rounded-lg text-[#B5B5B5] hover:text-white transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">{task.title}</h1>
          <p className="text-xs text-[#B5B5B5] mt-0.5 font-light">Sprint task ID: {task._id}</p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 space-y-6">
        <div className="space-y-3.5 text-xs text-[#B5B5B5] font-light">
          <p className="text-sm font-semibold text-white">Task Specification</p>
          <p className="leading-relaxed bg-[#0D0D0D] border border-[#1C1C1C] p-4 rounded-xl text-white">
            {task.description || 'No description provided.'}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-[#646464] block font-bold text-[10px] uppercase">Assignee</span>
              <span className="text-white flex items-center gap-1.5 pt-1">
                <User className="h-3.5 w-3.5" />
                {task.assignee?.name || 'Unassigned'}
              </span>
            </div>
            <div>
              <span className="text-[#646464] block font-bold text-[10px] uppercase">Project</span>
              <span className="text-white pt-1 block font-mono">{task.project?.name || 'Workspace Project'}</span>
            </div>
            <div>
              <span className="text-[#646464] block font-bold text-[10px] uppercase">Priority</span>
              <span className="text-white pt-1 block font-bold uppercase text-[10px]">{task.priority}</span>
            </div>
            <div>
              <span className="text-[#646464] block font-bold text-[10px] uppercase">Status</span>
              <span className="text-white pt-1 block font-bold uppercase text-[10px]">{task.status.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-[#1C1C1C] pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Developer Comments</span>
          </h3>

          <div className="space-y-3">
            {comments.map(c => (
              <div key={c.id} className="bg-[#0D0D0D] border border-[#1C1C1C] p-3 rounded-xl text-xs space-y-1 text-[#B5B5B5]">
                <div className="flex justify-between font-semibold">
                  <span className="text-white">{c.author}</span>
                  <span className="text-[10px] text-[#646464] font-light">{c.date}</span>
                </div>
                <p className="font-light">{c.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handlePostComment} className="flex gap-3 pt-2">
            <input
              type="text"
              placeholder="Post a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="flex-grow bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#B5B5B5]"
            />
            <button type="submit" className="p-2.5 bg-white text-[#131313] hover:bg-[#B5B5B5] rounded-lg cursor-pointer">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
