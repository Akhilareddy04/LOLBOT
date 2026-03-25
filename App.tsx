
import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, Message, ChatSession, UserProfile, Emotion } from './types';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import AvatarSetup from './components/AvatarSetup';
import CallInterface from './components/CallInterface';
import { LandingPage, AuthModule, ConsentPage } from './components/AuthPages';
import { generateChatResponse } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>(Emotion.NEUTRAL);

  // Load user sessions from localStorage on user change
  useEffect(() => {
    if (user) {
      const savedSessions = localStorage.getItem(`lolbot_sessions_${user.email}`);
      const savedMessages = localStorage.getItem(`lolbot_messages_${user.email}`);
      
      if (savedSessions) setSessions(JSON.parse(savedSessions));
      if (savedMessages) setMessages(JSON.parse(savedMessages));
      
      // Auto-select latest or create first
      const firstId = 'init_session';
      if (!savedSessions || JSON.parse(savedSessions).length === 0) {
        const initSession: ChatSession = { id: firstId, title: 'First Conversation', lastTimestamp: Date.now() };
        setSessions([initSession]);
        setMessages({ [firstId]: [] });
        setCurrentSessionId(firstId);
      } else {
        const sess = JSON.parse(savedSessions);
        setCurrentSessionId(sess[0].id);
      }
    }
  }, [user]);

  // Save on state change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`lolbot_sessions_${user.email}`, JSON.stringify(sessions));
      localStorage.setItem(`lolbot_messages_${user.email}`, JSON.stringify(messages));
    }
  }, [sessions, messages, user]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!currentSessionId || !user) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: Date.now()
    };

    setMessages(prev => ({
      ...prev,
      [currentSessionId]: [...(prev[currentSessionId] || []), userMsg]
    }));

    setIsTyping(true);

    try {
      const history = (messages[currentSessionId] || []).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model' as const,
        parts: [{ text: m.text }]
      }));

      const response = await generateChatResponse(text, history, user.language);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.reply,
        timestamp: Date.now(),
        emotion: response.detectedEmotion
      };

      setMessages(prev => ({
        ...prev,
        [currentSessionId]: [...(prev[currentSessionId] || []), botMsg]
      }));
      
      setCurrentEmotion(response.detectedEmotion);
      
      setSessions(prev => prev.map(s => s.id === currentSessionId ? {
        ...s,
        lastTimestamp: Date.now(),
        lastEmotion: response.detectedEmotion,
        title: s.title === 'New Session' || s.title === 'First Conversation' ? text.slice(0, 30) + '...' : s.title
      } : s));

    } catch (err) {
      console.error("Chat Error:", err);
    } finally {
      setIsTyping(false);
    }
  }, [currentSessionId, messages, user]);

  const handleNewChat = () => {
    const id = Date.now().toString();
    const newSession: ChatSession = {
      id,
      title: 'New Session',
      lastTimestamp: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setMessages(prev => ({ ...prev, [id]: [] }));
    setCurrentSessionId(id);
    setView('chat');
  };

  const renderContent = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onStart={() => setView('login')} />;
      case 'login':
      case 'signup':
        return <AuthModule 
          onAuth={(u) => { 
            setUser(u); 
            if (!u.hasConsented) setView('consent');
            else if (!u.avatarUrl) setView('avatar-setup');
            else setView('chat');
          }} 
          onBack={() => setView('landing')} 
        />;
      case 'consent':
        return <ConsentPage 
          onAccept={() => setView('avatar-setup')} 
          onBack={() => setView('login')}
        />;
      case 'avatar-setup':
        return <AvatarSetup 
          onComplete={(data) => {
            const updatedUser = { ...user!, avatarUrl: data.avatarUrl, voiceSampleUrl: data.voiceUrl, hasConsented: true };
            setUser(updatedUser);
            // Persistence
            const db = JSON.parse(localStorage.getItem('lolbot_db') || '[]');
            const idx = db.findIndex((u: any) => u.email === updatedUser.email);
            if (idx !== -1) {
              db[idx] = updatedUser;
              localStorage.setItem('lolbot_db', JSON.stringify(db));
            }
            setView('chat');
          }}
          onBack={() => setView('chat')}
        />;
      case 'voice-call':
        return <CallInterface type="voice" avatarUrl={user?.avatarUrl} onEnd={() => setView('chat')} />;
      case 'video-call':
        return <CallInterface type="video" avatarUrl={user?.avatarUrl} onEnd={() => setView('chat')} />;
      case 'chat':
        if (!user) return <LandingPage onStart={() => setView('login')} />;
        return (
          <div className="flex h-screen w-full overflow-hidden bg-[#0b0d11]">
            <Sidebar 
              sessions={sessions}
              currentSessionId={currentSessionId || undefined}
              onNewChat={handleNewChat}
              onSelectSession={setCurrentSessionId}
              onViewChange={setView}
              user={user}
            />
            <ChatWindow 
              messages={currentSessionId ? messages[currentSessionId] || [] : []}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
              currentEmotion={currentEmotion}
            />
          </div>
        );
      default:
        return <div>Error loading view</div>;
    }
  };

  return <div className="w-full h-full text-white selection:bg-indigo-500/30">{renderContent()}</div>;
};

export default App;
