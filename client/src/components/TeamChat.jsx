import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Users, 
  GraduationCap, 
  Briefcase, 
  Lock, 
  Sparkles, 
  RefreshCw,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function TeamChat({ projectId, projectTitle, mentorName }) {
  const { user } = useAuth();
  
  // Channels: 'peer' (Students Only) | 'mentor' (Team + Mentor Guidance)
  const [activeChannel, setActiveChannel] = useState(user?.role === 'mentor' ? 'mentor' : 'mentor');
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async (channelToLoad = activeChannel) => {
    if (!projectId) return;
    setLoadingMessages(true);
    setErrorMsg('');

    try {
      const res = await api.getChatMessages(projectId, channelToLoad);
      if (res.status === 'success') {
        setMessages(res.messages || []);
      } else {
        setErrorMsg(res.message || 'Unable to load channel messages.');
      }
    } catch (err) {
      setErrorMsg('Error connecting to chat server.');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadMessages(activeChannel);
  }, [projectId, activeChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    setSending(true);
    const textToSend = inputText.trim();
    setInputText('');

    try {
      const res = await api.sendChatMessage(projectId, textToSend, activeChannel);
      if (res.status === 'success' && res.message) {
        setMessages(prev => [...prev, res.message]);
        scrollToBottom();
      } else {
        setErrorMsg(res.message || 'Failed to send message.');
      }
    } catch (err) {
      setErrorMsg('Failed to deliver message.');
    } finally {
      setSending(false);
    }
  };

  const isMentorViewingPeer = user?.role === 'mentor' && activeChannel === 'peer';

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '560px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
      
      {/* Top Channel Navigation Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        
        {/* Dual Tab Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#090d16', padding: '0.3rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
          
          {/* Tab 1: Students-Only Peer Chat */}
          <button
            type="button"
            onClick={() => setActiveChannel('peer')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '0.4rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.825rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: activeChannel === 'peer' ? '#4f46e5' : 'transparent',
              color: activeChannel === 'peer' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            <Lock size={14} /> Student Teammates Chat
          </button>

          {/* Tab 2: Whole Team + Mentor Guidance Chat */}
          <button
            type="button"
            onClick={() => setActiveChannel('mentor')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '0.4rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.825rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: activeChannel === 'mentor' ? '#7c3aed' : 'transparent',
              color: activeChannel === 'mentor' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            <Users size={14} /> Team + Mentor Guidance Chat
          </button>
        </div>

        <button 
          onClick={() => loadMessages(activeChannel)}
          title="Refresh Messages"
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Channel Information Header */}
      <div style={{ 
        padding: '0.5rem 0.85rem', 
        borderRadius: '0.4rem', 
        backgroundColor: activeChannel === 'peer' ? 'rgba(79, 70, 229, 0.12)' : 'rgba(124, 58, 237, 0.12)', 
        border: `1px solid ${activeChannel === 'peer' ? 'rgba(79, 70, 229, 0.25)' : 'rgba(124, 58, 237, 0.25)'}`,
        fontSize: '0.8rem',
        color: '#c7d2fe',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.85rem'
      }}>
        <Info size={14} style={{ flexShrink: 0 }} />
        <span>
          {activeChannel === 'peer' 
            ? '🔒 Students-Only Channel: Private to enrolled student members for informal collaboration and task handoffs.' 
            : `🌐 Group + Mentor Channel: Official discussion space with faculty mentor (${mentorName || 'Guide'}) & all students.`}
        </span>
      </div>

      {/* Message Feed Display */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1rem' }}>
        
        {isMentorViewingPeer ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#94a3b8', margin: 'auto' }}>
            <Lock size={36} color="#818cf8" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ color: '#ffffff', marginBottom: '0.35rem' }}>Private Student Peer Channel</h4>
            <p style={{ fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto' }}>
              This tab is exclusively reserved for student-to-student peer discussions. Please use the <strong>"Team + Mentor Guidance Chat"</strong> tab to interact with your team.
            </p>
          </div>
        ) : loadingMessages ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', margin: 'auto' }}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8', margin: 'auto' }}>
            <MessageSquare size={32} color="#64748b" style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.9rem' }}>No messages yet in this channel.</p>
            <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Be the first to say hello to the group!</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId === user?.id;
            const isMentor = msg.senderRole === 'mentor';

            return (
              <div 
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  alignSelf: isMe ? 'flex-end' : 'flex-start'
                }}
              >
                {/* Sender Identity & Role Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <span style={{ fontWeight: '700', color: isMe ? '#818cf8' : '#ffffff' }}>
                    {isMe ? 'You' : msg.senderName}
                  </span>
                  
                  {isMentor ? (
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                      <Briefcase size={10} /> Faculty Mentor
                    </span>
                  ) : (
                    <span className="badge badge-indigo" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                      <GraduationCap size={10} /> Student
                    </span>
                  )}

                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Message Bubble */}
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.885rem',
                    lineHeight: '1.5',
                    backgroundColor: isMe 
                      ? '#4f46e5' 
                      : isMentor 
                        ? 'rgba(124, 58, 237, 0.25)' 
                        : 'rgba(30, 41, 59, 0.7)',
                    border: isMe 
                      ? '1px solid #6366f1' 
                      : isMentor 
                        ? '1px solid rgba(124, 58, 237, 0.4)' 
                        : '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    wordBreak: 'break-word',
                    borderTopRightRadius: isMe ? '0px' : '0.75rem',
                    borderTopLeftRadius: !isMe ? '0px' : '0.75rem'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {errorMsg && (
        <div style={{ padding: '0.4rem 0.75rem', backgroundColor: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', borderRadius: '0.4rem', color: '#fca5a5', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
          {errorMsg}
        </div>
      )}

      {/* Chat Input Bar */}
      {!isMentorViewingPeer && (
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder={activeChannel === 'peer' ? "Message fellow student teammates..." : "Post to whole team & mentor..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              backgroundColor: '#090d16',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.5rem',
              color: '#ffffff',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={sending || !inputText.trim()}
            className="btn btn-primary btn-sm"
            style={{
              padding: '0.75rem 1.25rem',
              background: activeChannel === 'mentor' ? 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' : undefined
            }}
          >
            <Send size={15} />
          </button>
        </form>
      )}

    </div>
  );
}
