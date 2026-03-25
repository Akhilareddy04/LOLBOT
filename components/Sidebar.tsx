
import React from 'react';
import { 
  Plus, MessageCircle, Settings, Shield, User, 
  Phone, Video, Trash2, LogOut 
} from 'lucide-react';
import { ChatSession, ViewState, Emotion } from '../types';
import { EMOTION_COLORS } from '../constants';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onViewChange: (view: ViewState) => void;
  user: any;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, currentSessionId, onNewChat, onSelectSession, onViewChange, user 
}) => {
  return (
    <div className="w-72 bg-[#12141a] flex flex-col border-r border-gray-800 transition-all duration-300">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl font-outfit">L</span>
        </div>
        <div>
          <h1 className="font-outfit font-bold text-lg leading-tight">LOLBOT</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Listener of Loneliness</p>
        </div>
      </div>

      <div className="px-3 mb-4">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-200 p-3 rounded-lg border border-gray-700 transition-all group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          <span className="font-medium text-sm">New Session</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <p className="text-[10px] text-gray-500 font-bold px-2 mb-1 uppercase tracking-wider">Recent Conversations</p>
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`w-full text-left p-3 rounded-lg text-sm flex items-center gap-3 transition-colors ${
              currentSessionId === session.id 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30' 
                : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <MessageCircle size={16} />
            <div className="flex-1 truncate">
              <div className="truncate font-medium">{session.title}</div>
              {session.lastEmotion && (
                <div className={`text-[10px] font-bold ${EMOTION_COLORS[session.lastEmotion]}`}>
                  • {session.lastEmotion}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-gray-800 space-y-1">
        <button onClick={() => onViewChange('avatar-setup')} className="w-full flex items-center gap-3 p-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800">
          <User size={16} />
          <span>Avatar Setup</span>
        </button>
        <button onClick={() => onViewChange('voice-call')} className="w-full flex items-center gap-3 p-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800">
          <Phone size={16} />
          <span>Voice Call</span>
        </button>
        <button onClick={() => onViewChange('video-call')} className="w-full flex items-center gap-3 p-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800">
          <Video size={16} />
          <span>Video Call</span>
        </button>
        <button onClick={() => onViewChange('landing')} className="w-full flex items-center gap-3 p-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800">
          <Settings size={16} />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 p-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10">
          <Trash2 size={16} />
          <span>Delete My Data</span>
        </button>
      </div>
      
      <div className="p-4 bg-gray-900/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">
          {user.name.charAt(0)}
        </div>
        <div className="flex-1 truncate">
          <div className="text-xs font-bold truncate">{user.name}</div>
          <div className="text-[10px] text-gray-500 truncate">{user.email}</div>
        </div>
        <LogOut size={14} className="text-gray-500 cursor-pointer hover:text-white" />
      </div>
    </div>
  );
};

export default Sidebar;
