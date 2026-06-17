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

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-[#B5B5B5] space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <span className="text-xs">Loading project details...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/projects')} className="flex items-center space-x-1.5 text-xs text-[#B5B5B5] hover:text-white transition">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects</span>
        </button>
        <div className="p-6 text-center text-[#646464] text-xs bg-[#131313] border border-[#1C1C1C] rounded-2xl">
          Project not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/projects')} className="p-2 bg-[#131313] border border-[#1C1C1C] rounded-lg text-[#B5B5B5] hover:text-white transition cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">{project.name}</h1>
          <p className="text-xs text-[#B5B5B5] mt-0.5 font-light">Lead: {project.manager?.name || 'Unassigned'}</p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-[#1C1C1C] overflow-x-auto pb-px">
        {['Overview', 'Tasks', 'Files', 'Comments', 'Members', 'Activity Logs'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 border-b-2 text-xs font-semibold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
              activeTab === tab
                ? 'border-white text-white'
                : 'border-transparent text-[#646464] hover:text-[#B5B5B5]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-[#131313] border border-[#1C1C1C] rounded-2xl p-6 min-h-[250px]">
        {activeTab === 'Overview' && (
          <div className="space-y-4 text-xs font-light text-[#B5B5B5]">
            <h3 className="font-semibold text-white text-sm">Sprint Scope</h3>
            <p className="leading-relaxed max-w-2xl">{project.description || 'No description provided for this project.'}</p>
            <div className="grid grid-cols-2 gap-4 max-w-md pt-4 text-xs">
              <div className="space-y-1">
                <span className="text-[#646464] block uppercase font-bold text-[10px]">Deadline</span>
                <span className="text-white flex items-center gap-1.5 font-mono">
                  <Clock className="h-3.5 w-3.5" />
                  {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[#646464] block uppercase font-bold text-[10px]">Status</span>
                <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {project.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Tasks' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-sm">Project Tasks ({tasks.length})</h3>
            {tasks.length === 0 ? (
              <p className="text-xs text-[#646464] py-8 font-light">No tasks assigned to this project yet.</p>
            ) : (
              <div className="divide-y divide-[#1C1C1C] text-xs">
                {tasks.map(task => (
                  <div key={task._id} className="py-3.5 flex items-center justify-between text-[#B5B5B5]">
                    <div>
                      <p className="font-medium text-white">{task.title}</p>
                      <p className="text-[10px] text-[#646464] mt-0.5">Assignee: {task.assignee?.name || 'Unassigned'}</p>
                    </div>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-neutral-800 text-[#B5B5B5]">
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
            <h3 className="font-semibold text-white text-sm">Shared Attachments</h3>
            <div className="space-y-3.5 text-xs text-[#B5B5B5]">
              <div className="p-3 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <FileText className="h-4 w-4 text-[#B5B5B5]" />
                  <span>SprintSpecification.pdf</span>
                </div>
                <span className="text-[10px] text-[#646464]">1.2 MB</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Comments' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-white text-sm">Project Log Comments</h3>
            
            <div className="space-y-4">
              {comments.map(c => (
                <div key={c.id} className="bg-[#0D0D0D] border border-[#1C1C1C] p-4 rounded-xl text-xs space-y-1 text-[#B5B5B5]">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">{c.author}</span>
                    <span className="text-[10px] text-[#646464]">{c.date}</span>
                  </div>
                  <p className="font-light">{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendComment} className="flex gap-3">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="flex-grow bg-[#0D0D0D] border border-[#1C1C1C] text-xs text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#B5B5B5]"
              />
              <button type="submit" className="p-2.5 bg-white text-[#131313] hover:bg-[#B5B5B5] rounded-lg cursor-pointer">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {activeTab === 'Members' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-sm">Sprint Team</h3>
            <div className="space-y-3.5 text-xs text-[#B5B5B5] font-light">
              <div className="flex items-center space-x-3 p-3 bg-[#0D0D0D] border border-[#1C1C1C] rounded-xl">
                <div className="h-7 w-7 rounded-full bg-[#1C1C1C] border border-[#3C3C3C] flex items-center justify-center font-bold">
                  {project.manager?.name.slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium text-white">{project.manager?.name}</p>
                  <p className="text-[9px] text-yellow-400 font-bold uppercase">PROJECT LEAD</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Activity Logs' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-sm">Milestone Changes Log</h3>
            <div className="space-y-3.5 text-xs text-[#B5B5B5] font-light">
              <div className="flex items-center space-x-3 p-2">
                <Activity className="h-4 w-4 text-[#646464]" />
                <div>
                  <p className="text-white font-medium">Project status was changed to {project.status}</p>
                  <p className="text-[10px] text-[#646464]">By system on setup</p>
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
