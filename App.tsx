
import React, { useState, useRef } from 'react';
import { TabType, Article, AppraiserDetails, CustomerDetails, LoanDetails } from './types';
import { BANKS } from './constants';
import ArticleModal from './components/ArticleModal';
import PrintReport from './components/PrintReport';

const App: React.FC = () => {
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.Appraiser);
  
  // Set defaults to 0 to ensure they appear empty via the input condition
  const [goldRate, setGoldRate] = useState<number>(0); 
  const [ltv, setLtv] = useState<number>(0); 

  const [articles, setArticles] = useState<Article[]>([]);
  const [appraiser, setAppraiser] = useState<AppraiserDetails>({
    name: 'S. Rajesh',
    bank: 'Union Bank of India',
    branch: 'Tuni',
    code: 'UBI-9921'
  });
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    mobile: '',
    village: '',
    address: ''
  });
  const [loan, setLoan] = useState<LoanDetails>({
    loanNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    sanctionAmount: 0
  });
  const [jewelleryImage, setJewelleryImage] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loanRatePerGram = (goldRate * ltv) / 100;
  
  const totals = articles.reduce((acc, curr) => ({
    qty: acc.qty + curr.qty,
    gross: acc.gross + curr.gross,
    stones: acc.stones + curr.stone,
    net: acc.net + curr.net
  }), { qty: 0, gross: 0, stones: 0, net: 0 });

  const appraiserValue = goldRate * totals.net;
  const eligibleLoan = totals.net * loanRatePerGram;

  const handleAddArticle = (article: Article, addAnother: boolean) => {
    setArticles(prev => [...prev, article]);
    if (!addAnother) setIsModalOpen(false);
  };

  const removeLastArticle = () => {
    setArticles(articles.slice(0, -1));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setJewelleryImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const resetAll = () => {
    if (window.confirm('Clear all appraisal data?')) {
      setArticles([]);
      setJewelleryImage(null);
      setCustomer({ name: '', mobile: '', village: '', address: '' });
      setLoan({ ...loan, loanNumber: '', sanctionAmount: 0 });
    }
  };

  if (showPrintPreview) {
    return (
      <div className="bg-[#0b0e14] min-h-screen">
        <div className="no-print bg-[#151921] text-white p-4 flex justify-between items-center sticky top-0 z-50 border-b border-slate-800 shadow-xl">
          <button onClick={() => setShowPrintPreview(false)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all font-bold text-xs uppercase tracking-widest text-white">
            <i className="fas fa-chevron-left"></i> Edit Data
          </button>
          <div className="flex flex-col items-center">
            <span className="font-black text-amber-500 text-sm tracking-widest uppercase italic">Report Preview</span>
          </div>
          <div className="w-12"></div>
        </div>
        <div id="print-area" className="flex justify-center p-0">
          <PrintReport appraiser={appraiser} customer={customer} articles={articles} totals={totals} loan={loan} image={jewelleryImage} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-[#0b0e14] text-slate-200">
      <header className="bg-[#151921] px-6 py-5 shadow-2xl flex items-center justify-between border-b border-slate-800/50 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-slate-900 shadow-lg shadow-amber-500/20">
            <i className="fas fa-gem text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">GoldPro</h1>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest -mt-1">Financial Suite</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsLocked(!isLocked)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${isLocked ? 'bg-slate-800/50 border-slate-700 text-amber-500 shadow-inner' : 'bg-amber-500 border-amber-400 text-slate-900 shadow-xl shadow-amber-500/30'}`}
          >
            <i className={`fas ${isLocked ? 'fa-lock' : 'fa-lock-open'} text-sm`}></i>
          </button>
          <button onClick={resetAll} className="w-11 h-11 rounded-2xl bg-slate-800/50 border-2 border-slate-700 text-rose-400 flex items-center justify-center shadow-inner active:scale-95 transition-transform">
            <i className="fas fa-trash-alt text-sm"></i>
          </button>
        </div>
      </header>

      <main className="container mx-auto max-w-lg p-3 sm:p-5 space-y-5">
        
        {activeTab === TabType.Appraiser && (
          <section className="space-y-6 animate-fadeIn">
            <div className="bg-[#151921] rounded-[2rem] p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none text-white">
                <i className="fas fa-university text-9xl"></i>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <i className="fas fa-building"></i> Official Station
                </h3>
              </div>
              <div className="space-y-4">
                <div className="group">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-1">Banking Partner</label>
                  <select 
                    disabled={isLocked}
                    className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-3 px-5 text-slate-900 font-bold outline-none focus:border-amber-500 appearance-none disabled:opacity-60"
                    value={appraiser.bank}
                    onChange={(e) => setAppraiser({...appraiser, bank: e.target.value})}
                  >
                    {BANKS.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                  </select>
                </div>
                <div className="group">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-1">Appraiser Name</label>
                  <input 
                    type="text" 
                    readOnly={isLocked}
                    className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-3 px-5 text-slate-900 font-bold outline-none focus:border-amber-500 read-only:opacity-60"
                    value={appraiser.name}
                    onChange={(e) => setAppraiser({...appraiser, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-1">Branch</label>
                    <input 
                      type="text" 
                      readOnly={isLocked}
                      className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-3 px-5 text-slate-900 font-bold outline-none focus:border-amber-500 read-only:opacity-60"
                      value={appraiser.branch}
                      onChange={(e) => setAppraiser({...appraiser, branch: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-1">Staff Code</label>
                    <input 
                      type="text" 
                      readOnly={isLocked}
                      className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-3 px-5 text-slate-900 font-bold outline-none focus:border-amber-500 read-only:opacity-60"
                      value={appraiser.code}
                      onChange={(e) => setAppraiser({...appraiser, code: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === TabType.Customer && (
          <div className="space-y-5 animate-fadeIn">
            <section className="bg-[#151921] rounded-[2rem] p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-4">
              <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2 pb-2 border-b border-slate-800 text-white">
                <i className="fas fa-id-card"></i> Client Bio
              </h3>
              <div className="space-y-3">
                <input type="text" placeholder="Full Name" className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-3 px-5 text-slate-900 font-bold outline-none focus:border-amber-500" value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} />
                <input type="tel" placeholder="Mobile Number" className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-3 px-5 text-slate-900 font-bold outline-none focus:border-amber-500" value={customer.mobile} onChange={(e) => setCustomer({...customer, mobile: e.target.value})} />
                <textarea placeholder="Full Address" className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-3 px-5 text-slate-900 font-bold outline-none focus:border-amber-500 min-h-[80px] resize-none" value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} />
              </div>
            </section>
            
            <section className="bg-[#151921] rounded-[2rem] p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-4">
              <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2 pb-2 border-b border-slate-800">
                <i className="fas fa-camera"></i> Collateral Capture
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => fileInputRef.current?.click()} className="bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-slate-700">
                  <i className="fas fa-upload text-amber-500"></i> Upload
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-slate-700">
                  <i className="fas fa-camera text-amber-500"></i> Snap
                </button>
              </div>
              {jewelleryImage && (
                <div className="relative rounded-2xl overflow-hidden border-4 border-slate-800 shadow-lg aspect-video">
                  <img src={jewelleryImage} alt="Collateral" className="w-full h-full object-cover" />
                  <button onClick={() => setJewelleryImage(null)} className="absolute top-2 right-2 bg-rose-600/90 w-8 h-8 rounded-full flex items-center justify-center text-white"><i className="fas fa-times"></i></button>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </section>
          </div>
        )}

        {activeTab === TabType.Valuation && (
          <div className="space-y-5 animate-fadeIn">
            {/* Rates Bar */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#151921] p-4 rounded-3xl border border-slate-800 shadow-xl">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">916 Rate</p>
                <div className="relative">
                   <span className="absolute left-0 top-1/2 -translate-y-1/2 text-amber-500 font-black text-lg">₹</span>
                   <input 
                    type="number" 
                    value={goldRate === 0 ? '' : goldRate}
                    onChange={(e) => setGoldRate(e.target.value === '' ? 0 : Number(e.target.value))}
                    readOnly={isLocked}
                    className="w-full bg-transparent pl-5 text-xl font-black text-white outline-none read-only:text-slate-500"
                  />
                </div>
              </div>
              <div className="bg-[#151921] p-4 rounded-3xl border border-slate-800 shadow-xl">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">LTV Limit</p>
                <div className="relative">
                   <span className="absolute right-0 top-1/2 -translate-y-1/2 text-amber-500 font-black text-lg">%</span>
                   <input 
                    type="number" 
                    value={ltv === 0 ? '' : ltv}
                    onChange={(e) => setLtv(e.target.value === '' ? 0 : Number(e.target.value))}
                    readOnly={isLocked}
                    className="w-full bg-transparent text-xl font-black text-white outline-none read-only:text-slate-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-[#151921] p-2 rounded-xl border border-slate-800 text-center shadow-lg">
               <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Loan Rate / Gram</p>
               <p className="text-lg font-black text-amber-500">₹ {loanRatePerGram.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                <i className="fas fa-plus"></i> New Entry
              </button>
              <button onClick={removeLastArticle} className="bg-slate-800 hover:bg-rose-700 text-slate-400 hover:text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all border border-slate-700">
                <i className="fas fa-undo"></i> Undo
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-5 shadow-2xl border border-blue-400/30 text-center relative overflow-hidden group">
              <p className="text-[9px] text-blue-200 font-black uppercase tracking-[0.3em] mb-1">Total Eligibility</p>
              <h2 className="text-4xl font-black text-white tracking-tighter drop-shadow-lg">₹ {Math.floor(eligibleLoan).toLocaleString('en-IN')}</h2>
            </div>

            {/* Valuation List - Zero Padding Approach */}
            <div className="bg-[#151921] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl overflow-x-auto">
              <table className="w-full text-[10px] text-center min-w-[320px] border-collapse">
                <thead className="bg-slate-900/80 text-slate-500 uppercase tracking-widest">
                  <tr>
                    <th className="p-1.5">Asset</th>
                    <th className="p-1.5">Qty</th>
                    <th className="p-1.5">Gross</th>
                    <th className="p-1.5">Stone</th>
                    <th className="p-1.5">Touch</th>
                    <th className="p-1.5 text-amber-500">Net</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300 font-bold">
                  {articles.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-slate-700 italic font-black uppercase tracking-widest text-[9px] opacity-40">Add Articles to Valuate</td></tr>
                  ) : (
                    articles.map((art) => (
                      <tr key={art.id} className="border-t border-slate-800/50">
                        <td className="p-1.5 text-left uppercase text-slate-100 truncate max-w-[80px]">{art.name}</td>
                        <td className="p-1.5">{art.qty}</td>
                        <td className="p-1.5">{art.gross.toFixed(3)}</td>
                        <td className="p-1.5">{art.stone.toFixed(3)}</td>
                        <td className="p-1.5">{art.isKarat ? <span className="text-amber-500/80">{art.touchValue}</span> : `${art.touchValue}%`}</td>
                        <td className="p-1.5 text-white font-black">{art.net.toFixed(3)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-slate-900 text-white font-black uppercase tracking-tighter border-t-2 border-slate-800">
                  <tr>
                    <td colSpan={1} className="p-1.5 text-left">Totals</td>
                    <td className="p-1.5">{totals.qty}</td>
                    <td className="p-1.5">{totals.gross.toFixed(3)}</td>
                    <td className="p-1.5">{totals.stones.toFixed(3)}</td>
                    <td className="p-1.5 opacity-30">—</td>
                    <td className="p-1.5 text-amber-500">{totals.net.toFixed(3)}g</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="bg-gradient-to-r from-[#2e1065] to-[#1e1b4b] rounded-2xl p-3 shadow-2xl flex justify-between items-center border border-indigo-500/30">
              <p className="text-[8px] font-black uppercase text-indigo-200 tracking-widest">Market Valuation</p>
              <p className="text-lg font-black text-white tracking-tighter">₹ {Math.floor(appraiserValue).toLocaleString('en-IN')}</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Payout Amount (₹)</p>
              <input 
                type="number"
                value={loan.sanctionAmount === 0 ? '' : loan.sanctionAmount}
                onChange={(e) => setLoan({...loan, sanctionAmount: e.target.value === '' ? 0 : Number(e.target.value)})}
                placeholder="Final Amount"
                className="w-full bg-[#151921] border-2 border-slate-800 rounded-3xl py-4 px-6 text-2xl font-black text-white focus:border-amber-500 outline-none text-right shadow-2xl"
              />
            </div>

            <button 
              onClick={() => {
                if(articles.length === 0) return alert("Please add valuation items first");
                setShowPrintPreview(true);
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98]"
            >
              <i className="fas fa-file-invoice text-lg"></i> Finalize & Preview
            </button>
          </div>
        )}
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-[#151921]/95 backdrop-blur-xl border border-slate-800 h-20 rounded-[2.5rem] flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-40">
        <button onClick={() => setActiveTab(TabType.Appraiser)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === TabType.Appraiser ? 'text-amber-500 scale-105' : 'text-slate-500'}`}>
          <i className="fas fa-building text-lg"></i>
          <span className="text-[9px] font-black uppercase tracking-widest">Bank</span>
        </button>
        <button onClick={() => setActiveTab(TabType.Customer)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === TabType.Customer ? 'text-amber-500 scale-105' : 'text-slate-500'}`}>
          <i className="fas fa-user-tag text-lg"></i>
          <span className="text-[9px] font-black uppercase tracking-widest">Client</span>
        </button>
        <button onClick={() => setActiveTab(TabType.Valuation)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === TabType.Valuation ? 'text-amber-500 scale-105' : 'text-slate-500'}`}>
          <i className="fas fa-coins text-lg"></i>
          <span className="text-[9px] font-black uppercase tracking-widest">Value</span>
        </button>
      </nav>

      {isModalOpen && (
        <ArticleModal onClose={() => setIsModalOpen(false)} onConfirm={handleAddArticle} />
      )}
    </div>
  );
};

export default App;
