
import React, { useState } from 'react';
import { Heart, Shield, CheckCircle, Globe, ArrowRight, ArrowLeft, Mail, Lock, User, UserPlus, LogIn } from 'lucide-react';
import { ViewState, UserProfile } from '../types';
import { LANGUAGES } from '../constants';

export const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="min-h-screen bg-[#0b0d11] flex flex-col">
    <nav className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl font-outfit">L</div>
        <span className="font-outfit font-bold text-xl tracking-tight">LOLBOT</span>
      </div>
      <button onClick={onStart} className="px-6 py-2 rounded-full border border-gray-700 hover:bg-gray-800 transition-all text-sm font-medium">Get Started</button>
    </nav>
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-6xl md:text-8xl font-outfit font-bold tracking-tighter leading-none bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          The listener for your <span className="text-indigo-500">lonely</span> moments.
        </h1>
        <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
          A judgment-free space for feelings that are too heavy to carry alone. Emotionally aware, private, and always here.
        </p>
      </div>
      <button 
        onClick={onStart}
        className="group px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-500/10 flex items-center gap-3"
      >
        Start Talking
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 w-full">
        {[
          { icon: <Heart className="text-red-400" />, title: "Empathetic", desc: "No robotic responses. Just care." },
          { icon: <Shield className="text-blue-400" />, title: "Private", desc: "End-to-end data encryption." },
          { icon: <Globe className="text-emerald-400" />, title: "Multilingual", desc: "English, Hindi, and Telugu." }
        ].map((feat, i) => (
          <div key={i} className="bg-[#12141a] p-6 rounded-2xl border border-gray-800 text-left space-y-3">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">{feat.icon}</div>
            <h3 className="font-bold text-white">{feat.title}</h3>
            <p className="text-sm text-gray-500">{feat.desc}</p>
          </div>
        ))}
      </div>
    </main>
  </div>
);

export const AuthModule: React.FC<{ 
  onAuth: (u: UserProfile) => void,
  onBack: () => void 
}> = ({ onAuth, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '25', language: 'English' as any });
  const [error, setError] = useState('');

  const handleAction = () => {
    setError('');
    const db = JSON.parse(localStorage.getItem('lolbot_db') || '[]');
    
    if (isLogin) {
      const user = db.find((u: any) => u.email === form.email && u.password === form.password);
      if (user) {
        onAuth(user);
      } else {
        setError('Invalid email or password.');
      }
    } else {
      if (db.some((u: any) => u.email === form.email)) {
        setError('Email already exists. Try signing in.');
        return;
      }
      const newUser = { ...form, hasConsented: false };
      db.push(newUser);
      localStorage.setItem('lolbot_db', JSON.stringify(db));
      onAuth(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0b0d11]">
      <div className="max-w-md w-full bg-[#12141a] p-8 rounded-3xl border border-gray-800 space-y-6 shadow-2xl relative">
        <button 
          onClick={onBack}
          className="absolute -top-12 left-0 text-gray-500 hover:text-white flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600/20 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
             {isLogin ? <LogIn size={24} /> : <UserPlus size={24} />}
          </div>
          <h2 className="text-3xl font-bold font-outfit text-white">
            {isLogin ? 'Welcome Back' : 'Join the Circle'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isLogin ? 'Your space is waiting for you.' : 'Tell us a bit about yourself.'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-500" size={18} />
              <input 
                type="text" placeholder="Your Name" 
                className="w-full bg-gray-900 border border-gray-800 p-4 pl-12 rounded-xl focus:outline-none focus:border-indigo-500 text-sm transition-all" 
                value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-500" size={18} />
            <input 
              type="email" placeholder="Email Address" 
              className="w-full bg-gray-900 border border-gray-800 p-4 pl-12 rounded-xl focus:outline-none focus:border-indigo-500 text-sm transition-all"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-500" size={18} />
            <input 
              type="password" placeholder="Password" 
              className="w-full bg-gray-900 border border-gray-800 p-4 pl-12 rounded-xl focus:outline-none focus:border-indigo-500 text-sm transition-all"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>
          
          {!isLogin && (
            <div className="flex gap-4">
               <input 
                type="number" placeholder="Age" 
                className="w-1/3 bg-gray-900 border border-gray-800 p-4 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
                value={form.age} onChange={e => setForm({...form, age: e.target.value})}
              />
              <select 
                className="flex-1 bg-gray-900 border border-gray-800 p-4 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
                value={form.language} onChange={e => setForm({...form, language: e.target.value as any})}
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          )}
        </div>

        <button 
          onClick={handleAction}
          disabled={(isLogin ? (!form.email || !form.password) : (!form.name || !form.email || !form.password))}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold rounded-xl transition-all shadow-lg"
        >
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>

        <div className="text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-gray-400 hover:text-white text-xs transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ConsentPage: React.FC<{ onAccept: () => void, onBack: () => void }> = ({ onAccept, onBack }) => {
  const [checks, setChecks] = useState(new Array(5).fill(false));
  const clauses = [
    "I confirm that the uploaded photo is not vulgar, sexual, or explicit.",
    "I confirm that this image does not belong to any celebrity or public figure.",
    "I confirm that the photo is a portrait showing only my head and neck.",
    "I understand that LOLBOT is an AI system and not a real human being.",
    "I agree that this platform is for emotional support only and not for medical crisis intervention."
  ];

  const allChecked = checks.every(c => c);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0b0d11]">
      <div className="max-w-xl w-full bg-[#12141a] p-10 rounded-3xl border border-gray-800 space-y-8 relative">
        <button onClick={onBack} className="absolute -top-12 left-0 text-gray-500 hover:text-white flex items-center gap-2 text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex flex-col items-center gap-4 text-center">
           <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
             <Shield size={32} />
           </div>
           <h2 className="text-3xl font-bold font-outfit text-white">Safety & Consent</h2>
           <p className="text-gray-400 text-sm">Please read and agree to our safety guidelines to continue.</p>
        </div>
        <div className="space-y-4">
          {clauses.map((clause, i) => (
            <label key={i} className="flex items-start gap-4 p-4 rounded-xl border border-gray-800 hover:bg-gray-900 transition-colors cursor-pointer group">
              <div className="relative mt-1">
                <input 
                  type="checkbox" 
                  checked={checks[i]} 
                  onChange={() => {
                    const newChecks = [...checks];
                    newChecks[i] = !newChecks[i];
                    setChecks(newChecks);
                  }}
                  className="peer h-5 w-5 appearance-none rounded border border-gray-700 bg-transparent checked:bg-indigo-600 transition-colors"
                />
                <CheckCircle className="absolute top-0 left-0 text-white h-5 w-5 scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
              </div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{clause}</span>
            </label>
          ))}
        </div>
        <button 
          onClick={onAccept}
          disabled={!allChecked}
          className="w-full py-4 bg-white text-black font-bold rounded-xl transition-all disabled:opacity-20 disabled:grayscale"
        >
          I Agree and Continue
        </button>
      </div>
    </div>
  );
};
