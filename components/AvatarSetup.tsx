
import React, { useState } from 'react';
import { Camera, Mic, Upload, X, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { validateAvatarImage } from '../services/geminiService';

interface AvatarSetupProps {
  onComplete: (data: { avatarUrl: string; voiceUrl: string }) => void;
  onBack: () => void;
}

const AvatarSetup: React.FC<AvatarSetupProps> = ({ onComplete, onBack }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [voice, setVoice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image too large. Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhoto(ev.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVoice(file.name);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!photo || !voice) {
      setError("Please upload both a photo and a voice sample.");
      return;
    }
    
    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: AI Verification of image constraints
      const validation = await validateAvatarImage(photo);
      
      if (!validation.valid) {
        setError(validation.reason || "Invalid image.");
        setIsProcessing(false);
        return;
      }

      // Step 2: Finalize
      setTimeout(() => {
        onComplete({ avatarUrl: photo, voiceUrl: voice });
        setIsProcessing(false);
      }, 1000);
    } catch (err) {
      setError("Could not verify image. Please try another one.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0b0d11] z-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8 bg-[#12141a] p-8 rounded-3xl border border-gray-800 shadow-2xl overflow-y-auto">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-outfit text-white">Create Your Companion</h2>
          <p className="text-gray-400 text-sm">Personalize LOLBOT's appearance and voice to make it feel more familiar.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm animate-shake">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Photo Section */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-300">Companion Photo</label>
            <div className={`relative aspect-square rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${
              photo ? 'border-indigo-500 bg-indigo-500/5' : 'border-gray-700 hover:border-gray-500'
            }`}>
              {photo ? (
                <>
                  <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
                  <button 
                    onClick={() => setPhoto(null)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors z-10"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="text-center p-4">
                  <Camera size={40} className="mx-auto text-gray-600 mb-2" />
                  <p className="text-[10px] text-gray-500 mb-4 font-bold uppercase tracking-tight">Only Head & Neck Allowed</p>
                  <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-gray-700 inline-block shadow-md">
                    <Upload size={14} className="inline mr-2" />
                    Upload Headshot
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  </label>
                </div>
              )}
            </div>
            <p className="text-[10px] text-indigo-400 flex items-center gap-1 font-medium">
              <Sparkles size={12} />
              AI will verify the frame for privacy.
            </p>
          </div>

          {/* Voice Section */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-300">Companion Voice</label>
            <div className={`aspect-square rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center ${
              voice ? 'border-emerald-500 bg-emerald-500/5' : 'border-gray-700 hover:border-gray-500'
            }`}>
              {voice ? (
                <div className="text-center p-4">
                  <Mic size={40} className="mx-auto text-emerald-500 mb-2" />
                  <p className="text-sm font-medium text-white mb-2 truncate max-w-xs px-2">{voice}</p>
                  <button 
                    onClick={() => setVoice(null)}
                    className="text-xs text-gray-500 hover:text-red-400 underline"
                  >
                    Change Sample
                  </button>
                </div>
              ) : (
                <div className="text-center p-4">
                  <Mic size={40} className="mx-auto text-gray-600 mb-2" />
                  <p className="text-xs text-gray-500 mb-4">Upload a short sample of a gentle voice for LOLBOT.</p>
                  <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-gray-700 inline-block shadow-md">
                    <Upload size={14} className="inline mr-2" />
                    Upload Audio
                    <input type="file" className="hidden" accept="audio/*" onChange={handleVoiceUpload} />
                  </label>
                </div>
              )}
            </div>
            <p className="text-[10px] text-gray-500 flex items-center gap-1">
              <ShieldCheck size={12} />
              Processed securely.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 flex items-center justify-between gap-4">
          <button 
            onClick={onBack}
            className="px-6 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isProcessing || !photo || !voice}
            className="flex-1 max-w-[240px] px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl text-sm font-bold transition-all shadow-xl flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              'Finalize Setup'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarSetup;
