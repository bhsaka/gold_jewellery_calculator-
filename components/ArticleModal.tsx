
import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { ARTICLES, TOUCH_PERCENT_OPTIONS, KARAT_MAP } from '../constants';

interface ArticleModalProps {
  onClose: () => void;
  onConfirm: (article: Article, addAnother: boolean) => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ onClose, onConfirm }) => {
  const [isKarat, setIsKarat] = useState(false);
  const [formData, setFormData] = useState({
    name: ARTICLES[0],
    qty: 1,
    gross: 0,
    stone: 0,
    touchValue: 85 as string | number
  });

  const [netWeight, setNetWeight] = useState(0);

  useEffect(() => {
    const grossLessStones = formData.gross - formData.stone;
    let multiplier = 0;

    if (isKarat) {
      const touchPercent = KARAT_MAP[formData.touchValue as string] || 83.34;
      multiplier = touchPercent / 100;
    } else {
      multiplier = (Number(formData.touchValue) || 85) / 100;
    }

    const net = grossLessStones * multiplier;
    setNetWeight(Math.max(0, Math.floor(net * 1000) / 1000));
  }, [formData, isKarat]);

  useEffect(() => {
    if (isKarat) {
      setFormData(prev => ({ ...prev, touchValue: "20krt" }));
    } else {
      setFormData(prev => ({ ...prev, touchValue: 85 }));
    }
  }, [isKarat]);

  const handleAction = (addAnother: boolean) => {
    if (formData.gross <= 0) return alert("Gross weight must be greater than zero.");
    
    onConfirm({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      ...formData,
      isKarat,
      net: netWeight
    }, addAnother);

    if (addAnother) {
      setFormData(prev => ({
        ...prev,
        qty: 1,
        gross: 0,
        stone: 0
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0b0e14]/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-[#151921] rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] relative border border-slate-800 animate-slideUp">
        <div className="bg-[#1c222c] p-7 text-white flex items-center justify-between border-b border-slate-800">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
            <i className="fas fa-plus-circle text-amber-500"></i> Valuation Ledger
          </h3>
          <button onClick={onClose} className="w-10 h-10 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all">
            <i className="fas fa-times text-slate-400"></i>
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          {/* Formula Selector */}
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <button 
              onClick={() => setIsKarat(false)}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${!isKarat ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-400'}`}
            >
              Touch (%)
            </button>
            <button 
              onClick={() => setIsKarat(true)}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isKarat ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-400'}`}
            >
              Karat (krt)
            </button>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Category</label>
              <select 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 py-4 bg-slate-900/50 border-2 border-slate-800 rounded-2xl text-white font-bold focus:border-amber-500 outline-none appearance-none transition-all"
              >
                {ARTICLES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Quantity</label>
                <input 
                  type="number"
                  value={formData.qty === 0 ? '' : formData.qty}
                  onChange={(e) => setFormData({...formData, qty: e.target.value === '' ? 0 : Number(e.target.value)})}
                  className="w-full px-5 py-4 bg-slate-900/50 border-2 border-slate-800 rounded-2xl text-white font-bold focus:border-amber-500 outline-none transition-all"
                  placeholder="Items"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Gross Wt (g)</label>
                <input 
                  type="number"
                  step="0.001"
                  value={formData.gross === 0 ? '' : formData.gross}
                  onChange={(e) => setFormData({...formData, gross: e.target.value === '' ? 0 : Number(e.target.value)})}
                  className="w-full px-5 py-4 bg-slate-900/50 border-2 border-slate-800 rounded-2xl text-white font-bold focus:border-amber-500 outline-none transition-all"
                  placeholder="0.000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Stone/Dust</label>
                <input 
                  type="number"
                  step="0.001"
                  value={formData.stone === 0 ? '' : formData.stone}
                  onChange={(e) => setFormData({...formData, stone: e.target.value === '' ? 0 : Number(e.target.value)})}
                  className="w-full px-5 py-4 bg-slate-900/50 border-2 border-slate-800 rounded-2xl text-white font-bold focus:border-amber-500 outline-none transition-all"
                  placeholder="0.000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{isKarat ? 'Karat Choice' : 'Touch Limit %'}</label>
                <select 
                  value={formData.touchValue}
                  onChange={(e) => setFormData({...formData, touchValue: isKarat ? e.target.value : Number(e.target.value)})}
                  className="w-full px-5 py-4 bg-slate-900/50 border-2 border-slate-800 rounded-2xl text-white font-bold focus:border-amber-500 outline-none transition-all"
                >
                  {isKarat ? (
                    Object.keys(KARAT_MAP).map(k => <option key={k} value={k}>{k}</option>)
                  ) : (
                    TOUCH_PERCENT_OPTIONS.map(o => <option key={o} value={o}>{o}%</option>)
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-black p-6 rounded-[2rem] border border-slate-800 text-center shadow-2xl">
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Calculated Appraisal Net</p>
            <p className="text-4xl font-black text-amber-500 tracking-tighter">{netWeight.toFixed(3)}<span className="text-sm ml-1 text-slate-500">g</span></p>
          </div>

          <div className="flex gap-4 pt-2">
            <button 
              onClick={() => handleAction(true)}
              className="flex-1 bg-emerald-700/20 text-emerald-500 border border-emerald-500/30 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
            >
              Add & Next
            </button>
            <button 
              onClick={() => handleAction(false)}
              className="flex-1 bg-amber-500 text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:bg-amber-400 transition-all active:scale-95"
            >
              Finalize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
