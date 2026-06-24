import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Clock, FileText, Send, Users, Activity, CheckSquare, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'Alex Manager', text: 'Onboarding complete. Sprints mapped.', date: 'Today, 10:00 AM' }
  ]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [projRes, tasksRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get('/tasks')
        ]);

        if (projRes.data?.success) {
          setProject(projRes.data.project || null);
        }

        if (tasksRes.data?.success) {
          const projectTasks = tasksRes.data.tasks.filter(t => t.project && t.project._id === id);
          setTasks(projectTasks);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([...comments, {
      id: Date.now(),
      author: 'You',
      text: newComment,
      date: 'Just now'
    }]);
    setNewComment('');
    toast.success('Comment posted');
  };

  const getStatusBadgeClass = (s) => {
    switch (s) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
      case 'testing':
        return 'bg-pink-500/10 text-pink-600 border border-pink-500/20';
      case 'in_progress':
        return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case 'to_do':
      default:
        return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#64748B] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#5A42EC]" />
        <span className="text-xs">Loading project details...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/projects')} className="flex items-center space-x-1.5 text-xs text-[#64748B] hover:text-[#0F172A] transition">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects</span>
        </button>
        <div className="p-6 text-center text-[#94A3B8] text-xs bg-white border border-[#E2E8F0]/80 rounded-[20px] shadow-sm">
          Project not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/projects')} className="p-2 bg-[#F4F5F9] border border-[#E2E8F0] rounded-xl text-[#64748B] hover:text-[#0F172A] transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight font-heading">{project.name}</h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-light">Lead: {project.manager?.name || 'Unassigned'}</p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-[#E2E8F0]/60 overflow-x-auto pb-px">
        {['Overview', 'Tasks', 'Files', 'Comments', 'Members', 'Activity Logs'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
              activeTab === tab
                ? 'border-[#5A42EC] text-[#5A42EC]'
                : 'border-transparent text-[#94A3B8] hover:text-[#64748B]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-[#E2E8F0]/80 rounded-[20px] p-6 shadow-sm min-h-[250px]">
        {activeTab === 'Overview' && (
          <div className="space-y-4 text-xs text-[#64748B]">
            <h3 className="font-bold text-[#0F172A] text-sm font-heading">Sprint Scope</h3>
            <p className="leading-relaxed max-w-2xl font-light">{project.description || 'No description provided for this project.'}</p>
            <div className="grid grid-cols-2 gap-4 max-w-md pt-4 text-xs">
              <div className="space-y-1">
                <span className="text-[#94A3B8] block uppercase font-bold text-[10px]">Deadline</span>
                <span className="text-[#0F172A] flex items-center gap-1.5 font-mono font-bold">
                  <Clock className="h-3.5 w-3.5" />
                  {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[#94A3B8] block uppercase font-bold text-[10px]">Status</span>
                <span className="inline-flex px-3 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#5A42EC]/5 text-[#5A42EC] border border-[#5A42EC]/10">
                  {project.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Tasks' && (
          <div className="space-y-4">
            <h3 className="font-bold text-[#0F172A] text-sm font-heading">Project Tasks ({tasks.length})</h3>
            {tasks.length === 0 ? (
              <p className="text-xs text-[#94A3B8] py-8 font-light">No tasks assigned to this project yet.</p>
            ) : (
              <div className="divide-y divide-[#E2E8F0]/40 text-xs -mx-6">
                {tasks.map(task => (
                  <div key={task._id} className="py-3.5 px-6 flex items-center justify-between text-[#64748B] hover-row transition-colors">
                    <div>
                      <p className="font-bold text-[#0F172A]">{task.title}</p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5 font-medium">Assignee: {task.assignee?.name || 'Unassigned'}</p>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusBadgeClass(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Files' && (
          <div className="space-y-4">
            <h3 className="font-bold text-[#0F172A] text-sm font-heading">Shared Attachments</h3>
            <div className="space-y-3.5 text-xs text-[#64748B]">
              <div className="p-3 bg-[#F4F5F9] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <FileText className="h-4 w-4 text-[#64748B]" />
                  <span className="font-semibold">SprintSpecification.pdf</span>
                </div>
                <span className="text-[10px] text-[#94A3B8] font-bold">1.2 MB</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Comments' && (
          <div className="space-y-6">
            <h3 className="font-bold text-[#0F172A] text-sm font-heading">Project Log Comments</h3>
            
            <div className="space-y-4">
              {comments.map(c => (
                <div key={c.id} className="bg-[#F4F5F9] border border-[#E2E8F0]/60 p-4 rounded-2xl text-xs space-y-1.5 text-[#64748B]">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#0F172A]">{c.author}</span>
                    <span className="text-[10px] text-[#94A3B8]">{c.date}</span>
                  </div>
                  <p className="font-light leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendComment} className="flex gap-3">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="flex-grow bg-[#F4F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5A42EC] focus:ring-2 focus:ring-[#5A42EC]/10 transition-all duration-200"
              />
              <button type="submit" className="p-2.5 bg-[#5A42EC] text-white hover:bg-[#4831D4] hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm shadow-[#5A42EC]/20 rounded-xl cursor-pointer">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {activeTab === 'Members' && (
          <div className="space-y-4">
            <h3 className="font-bold text-[#0F172A] text-sm font-heading">Sprint Team</h3>
            <div className="space-y-3.5 text-xs text-[#64748B] font-light">
              <div className="flex items-center space-x-3 p-3 bg-[#F4F5F9] border border-[#E2E8F0] rounded-xl max-w-sm">
                <div className="h-7 w-7 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center font-bold text-[#0F172A] shadow-sm">
                  {project.manager?.name.slice(0, 2)}
                </div>
                <div>
                  <p className="font-bold text-[#0F172A]">{project.manager?.name}</p>
                  <p className="text-[9px] text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-bold uppercase tracking-wider mt-0.5 inline-block">PROJECT LEAD</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Activity Logs' && (
          <div className="space-y-4">
            <h3 className="font-bold text-[#0F172A] text-sm font-heading">Milestone Changes Log</h3>
            <div className="space-y-3.5 text-xs text-[#64748B] font-light">
              <div className="flex items-center space-x-3 p-2">
                <Activity className="h-4 w-4 text-[#94A3B8]" />
                <div>
                  <p className="text-[#0F172A] font-bold">Project status was changed to {project.status}</p>
                  <p className="text-[10px] text-[#94A3B8] font-medium mt-0.5">By system on setup</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
