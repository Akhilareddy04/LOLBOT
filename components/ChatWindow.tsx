
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Video, Smile, Info } from 'lucide-react';
import { Message, Emotion } from '../types';
import { EMOTION_COLORS } from '../constants';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  currentEmotion?: Emotion;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isTyping, currentEmotion }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0d11]">
      <header className="p-4 border-b border-gray-800 flex items-center justify-between bg-[#0b0d11]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600 overflow-hidden">
               <img src="https://picsum.photos/seed/lolbot/100" alt="Avatar" className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#0b0d11] rounded-full"></div>
          </div>
          <div>
            <h2 className="font-bold text-sm">LOLBOT</h2>
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              {currentEmotion ? (
                <span className={`flex items-center gap-1 ${EMOTION_COLORS[currentEmotion]}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                  Feeling {currentEmotion}
                </span>
              ) : 'Ready to listen...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
           <Info size={18} className="cursor-pointer hover:text-white" title="Privacy Information" />
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 max-w-sm mx-auto">
            <div className="p-4 bg-gray-800/30 rounded-2xl">
              <Smile size={48} className="text-gray-500 mb-2 mx-auto" />
              <h3 className="font-outfit text-lg">It's quiet here.</h3>
              <p className="text-sm">I'm here for you. Whether you're feeling lonely, sad, or just want to talk... tell me anything.</p>
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] space-y-1`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' 
                  : 'bg-gray-800/80 text-gray-200 rounded-tl-none border border-gray-700/50'
              }`}>
                {msg.text}
              </div>
              <div className={`text-[10px] text-gray-500 px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.emotion && <span className={`ml-2 font-bold ${EMOTION_COLORS[msg.emotion]}`}>• {msg.emotion}</span>}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800/50 p-4 rounded-2xl rounded-tl-none border border-gray-700/30 flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gradient-to-t from-[#0b0d11] via-[#0b0d11] to-transparent">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me what's on your mind..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl py-4 pl-5 pr-32 focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-500 text-sm"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button type="button" className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all">
              <Mic size={20} />
            </button>
            <button type="button" className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all">
              <Video size={20} />
            </button>
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="p-2 text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl transition-all shadow-lg ml-1"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
        <p className="text-[10px] text-center text-gray-500 mt-4 uppercase tracking-tighter">
          LOLBOT is an AI companion for emotional support, not a replacement for professional care.
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
