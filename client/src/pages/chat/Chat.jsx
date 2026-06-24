import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import io from 'socket.io-client';
import { Send, Hash, Loader2, MessageSquare, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [activeChannel, setActiveChannel] = useState('general');
  const [content, setContent] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sending, setSending] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const activeChannelRef = useRef('general');

  // Keep ref in sync with state for socket event listener closure
  useEffect(() => {
    activeChannelRef.current = activeChannel;
  }, [activeChannel]);

  // Establish Socket.io connection and room enrollment
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : 'http://localhost:5000';

    socketRef.current = io(socketUrl, {
      withCredentials: true,
    });

    if (user?.company?.id) {
      socketRef.current.emit('join_company_room', user.company.id);
    }

    socketRef.current.on('receive_chat_message', (message) => {
      // Check if message belongs to current channel
      if (message.channel === activeChannelRef.current) {
        setMessages((prev) => {
          // Deduplicate
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user?.company?.id]);

  // Fetch channel message history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const res = await api.get(`/chat?channel=${activeChannel}`);
        if (res.data && res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error('History fetch failed:', err);
        toast.error('Failed to load chat history.');
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [activeChannel]);

  // Auto-scroll to bottom of chat feed
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const messageText = content.trim();
    setContent(''); // Clear immediately for snappy UI feel

    try {
      setSending(true);
      const res = await api.post('/chat', {
        channel: activeChannel,
        content: messageText,
      });

      if (res.data && res.data.success) {
        const newMessage = res.data.message;
        setMessages((prev) => {
          if (prev.some((m) => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
      }
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
      setContent(messageText); // restore text on failure
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  const formatRole = (role) => {
    if (!role) return '';
    return role.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="h-[calc(100vh-140px)] bg-white border border-[#E5E5E5] rounded-[24px] overflow-hidden flex shadow-sm font-sans">

      {/* Channels Sidebar Panel */}
      <div className="w-64 border-r border-[#E5E5E5] flex flex-col bg-[#F5F5F5]/30">
        <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#111111]" />
            <h2 className="font-bold text-[#111111] text-[15px] tracking-tight font-heading">Workspace Chat</h2>
          </div>
        </div>

        {/* Channel Navigation Links */}
        <div className="p-3 flex-grow space-y-1">
          <span className="text-[10px] font-bold text-[#A3A3A3] uppercase px-3 tracking-widest block mb-2">Channels</span>
          {[
            { id: 'general', label: 'general', desc: 'Company announcement lounge' },
            { id: 'projects', label: 'projects', desc: 'Project discussions' },
            { id: 'tasks', label: 'tasks', desc: 'Task-related collaboration' },
          ].map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex flex-col gap-0.5 transition-all duration-200 cursor-pointer ${activeChannel === ch.id
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-[#737373] hover:bg-[#F5F5F5] hover:text-[#111111]'
                }`}
            >
              <div className="flex items-center gap-1.5 font-semibold text-xs">
                <Hash className={`h-3.5 w-3.5 ${activeChannel === ch.id ? 'text-white' : 'text-[#A3A3A3]'}`} />
                <span>{ch.label}</span>
              </div>
              <span className={`text-[9px] font-light leading-none ${activeChannel === ch.id ? 'text-neutral-400' : 'text-[#A3A3A3]'}`}>
                {ch.desc}
              </span>
            </button>
          ))}
        </div>

        {/* User Workspace Info Footer */}
        <div className="p-4 border-t border-[#E5E5E5] bg-[#F5F5F5]/50 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#111111] border border-[#E5E5E5] flex items-center justify-center text-xs font-bold text-white uppercase">
            {user?.name ? user.name.slice(0, 2) : 'US'}
          </div>
          <div className="truncate">
            <span className="block text-xs font-bold text-[#111111] truncate">{user?.name}</span>
            <span className="block text-[9px] text-[#A3A3A3] uppercase tracking-wider font-semibold">
              {user?.role ? user.role.replace('_', ' ') : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Display Window */}
      <div className="flex-grow flex flex-col bg-white">

        {/* Chat Feed Header */}
        <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between shadow-sm relative z-10">
          <div className="flex items-center gap-1.5">
            <Hash className="h-5 w-5 text-[#111111]" />
            <h3 className="font-bold text-sm text-[#111111] font-heading">{activeChannel}</h3>
          </div>
        </div>

        {/* Message Log Feed */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {loadingHistory ? (
            <div className="h-full flex items-center justify-center flex-col gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#111111]" />
              <span className="text-xs text-[#737373] font-light">Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
              <div className="p-3 bg-[#F5F5F5] rounded-full border border-[#E5E5E5] text-[#737373]">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#111111]">Welcome to #{activeChannel}!</h4>
                <p className="text-xs text-[#737373] font-light max-w-xs leading-relaxed mt-0.5">
                  This is the beginning of the #{activeChannel} discussion board. Type a message below to kickstart the talk.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4.5">
              {messages.map((msg) => (
                <div key={msg._id} className="flex items-start gap-3 group">
                  {/* Sender Avatar */}
                  <div className="h-9 w-9 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] flex items-center justify-center text-xs font-bold text-[#111111] uppercase shrink-0">
                    {msg.sender?.name ? msg.sender.name.slice(0, 2) : 'US'}
                  </div>

                  {/* Message Bubble Body */}
                  <div className="space-y-1 max-w-[85%]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-[#111111]">{msg.sender?.name || 'Deleted User'}</span>
                      {msg.sender?.role && (
                        <span className="text-[8px] bg-[#111111]/5 border border-[#111111]/10 text-[#111111] font-bold px-1.5 py-0.25 rounded-md uppercase tracking-wider shrink-0 scale-90">
                          {formatRole(msg.sender.role)}
                        </span>
                      )}
                      <span className="text-[9px] text-[#A3A3A3] font-light">{formatTime(msg.createdAt)}</span>
                    </div>
                    <p className="text-xs text-[#111111] leading-relaxed break-words bg-[#F5F5F5]/30 p-2.5 rounded-2xl border border-[#E5E5E5]/40">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input Box */}
        <div className="p-4 border-t border-[#E5E5E5] bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder={`Message #${activeChannel}...`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-grow bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 transition-all duration-200"
              disabled={loadingHistory}
            />
            <button
              type="submit"
              disabled={!content.trim() || sending || loadingHistory}
              className="bg-[#111111] hover:bg-[#000000] text-white rounded-xl px-4 py-2.5 font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-1 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
