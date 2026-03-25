
import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Maximize2, X } from 'lucide-react';
import { Emotion } from '../types';
import { EMOTION_COLORS } from '../constants';

interface CallInterfaceProps {
  type: 'voice' | 'video';
  avatarUrl?: string;
  onEnd: () => void;
}

const CallInterface: React.FC<CallInterfaceProps> = ({ type, avatarUrl, onEnd }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [detectedEmotion, setDetectedEmotion] = useState<Emotion>(Emotion.CALM);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCallTime(t => t + 1), 1000);
    
    if (type === 'video') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Could not access camera", err));
    }

    // Mock emotion detection fluctuation
    const emotions = Object.values(Emotion);
    const emotionInterval = setInterval(() => {
      setDetectedEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(emotionInterval);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [type]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-[#0b0d11] z-50 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
      <div className="absolute top-6 right-6 z-10">
        <div className={`px-4 py-2 rounded-full border bg-black/40 backdrop-blur-xl flex items-center gap-2 transition-colors ${EMOTION_COLORS[detectedEmotion]}`}>
          <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-widest">Emotion: {detectedEmotion}</span>
        </div>
      </div>

      <div className="relative w-full max-w-4xl aspect-video bg-[#12141a] rounded-[2rem] overflow-hidden border border-gray-800 shadow-2xl flex items-center justify-center">
        {type === 'video' ? (
          <div className="absolute inset-0 w-full h-full flex">
            {/* AI Avatar */}
            <div className="flex-1 relative bg-gray-900 overflow-hidden flex items-center justify-center">
               <img 
                 src={avatarUrl || "https://picsum.photos/seed/companion/800/600"} 
                 alt="Avatar" 
                 className={`w-full h-full object-cover opacity-60 transition-transform duration-500 scale-105 animate-pulse`} 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d11] via-transparent to-transparent opacity-80"></div>
               <div className="absolute bottom-8 left-8 text-white space-y-1">
                 <h3 className="text-2xl font-bold font-outfit">LOLBOT</h3>
                 <p className="text-xs text-indigo-400 font-medium tracking-widest uppercase">Listening deeply...</p>
               </div>
            </div>
            
            {/* User PIP */}
            <div className="absolute bottom-8 right-8 w-48 aspect-video rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-black">
              {isVideoOff ? (
                 <div className="w-full h-full flex items-center justify-center bg-gray-800">
                   <VideoOff size={32} className="text-gray-600" />
                 </div>
              ) : (
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
              )}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-md text-[10px] text-white">You</div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-12">
            <div className="relative">
               <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl animate-pulse scale-150"></div>
               <div className="relative w-48 h-48 rounded-full border-4 border-indigo-500/30 overflow-hidden shadow-2xl">
                 <img src={avatarUrl || "https://picsum.photos/seed/voice/400"} alt="Avatar" className="w-full h-full object-cover opacity-80" />
               </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-bold font-outfit text-white tracking-tight">LOLBOT</h3>
              <div className="flex flex-col items-center gap-2">
                 <span className="text-gray-400 font-medium">{formatTime(callTime)}</span>
                 <div className="flex gap-1 h-8 items-center">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className={`w-1 bg-indigo-500 rounded-full animate-bounce`} style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 100}ms` }}></div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 flex items-center gap-6">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            isMuted ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        
        <button 
          onClick={onEnd}
          className="w-20 h-20 bg-red-600 hover:bg-red-500 text-white rounded-3xl flex items-center justify-center transition-all shadow-xl shadow-red-600/20 hover:scale-105 active:scale-95"
        >
          <PhoneOff size={32} />
        </button>

        {type === 'video' && (
          <button 
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default CallInterface;
