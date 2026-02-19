
import React from 'react';
import { Article, AppraiserDetails, CustomerDetails, LoanDetails } from '../types';

interface PrintReportProps {
  appraiser: AppraiserDetails;
  customer: CustomerDetails;
  articles: Article[];
  totals: { qty: number; gross: number; stones: number; net: number };
  loan: LoanDetails;
  image: string | null;
}

// Global declaration for html2pdf
declare var html2pdf: any;

const PrintReport: React.FC<PrintReportProps> = ({ appraiser, customer, articles, totals, loan, image }) => {
  const handleDownloadPDF = () => {
    const element = document.getElementById('report-content');
    const opt = {
      margin: 10,
      filename: `GoldLoan_${customer.name || 'Receipt'}_${new Date().toLocaleDateString()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  const numberToWords = (n: number) => {
    if (n === 0) return 'Zero Rupees Only';
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (num: number): string => {
      const s = num.toString();
      if (s.length > 9) return 'overflow';
      const n = ('000000000' + s).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) return ''; 
      let str = '';
      str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'Crore ' : '';
      str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'Lakh ' : '';
      str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'Thousand ' : '';
      str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'Hundred ' : '';
      str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) : '';
      return str + 'Rupees Only';
    };

    return inWords(Math.floor(n));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '---';
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <div className="w-full bg-slate-100 min-h-screen flex flex-col items-center p-0">
      {/* Outer Shell for html2pdf capture */}
      <div id="report-content" className="w-full max-w-[800px] bg-white p-4 sm:p-6 text-slate-900 border-x border-slate-200">
        {/* Header */}
        <div className="text-center border-b-2 border-slate-900 pb-2 mb-4">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-[#1a2b4b]">{appraiser.bank}</h1>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Professional Valuation Report</p>
          <p className="text-[10px] text-slate-500 font-bold mt-1">{appraiser.branch} Branch (Staff ID: {appraiser.code})</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <h2 className="text-[8px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1 mb-1">Pledgor Details</h2>
            <div className="space-y-0.5 text-[10px]">
              <p className="flex justify-between"><span className="text-slate-400 uppercase font-bold">Name:</span> <span className="font-black uppercase">{customer.name || '---'}</span></p>
              <p className="flex justify-between"><span className="text-slate-400 uppercase font-bold">Mobile:</span> <span className="font-bold">{customer.mobile || '---'}</span></p>
              <p className="text-[8px] text-slate-500 mt-1 leading-tight line-clamp-2 italic">{customer.address}</p>
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <h2 className="text-[8px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1 mb-1">Loan Metadata</h2>
            <div className="space-y-0.5 text-[10px]">
              <p className="flex justify-between"><span className="text-slate-400 uppercase font-bold">Ref ID:</span> <span className="font-black">#{Math.floor(Date.now() / 100000)}</span></p>
              <p className="flex justify-between"><span className="text-slate-400 uppercase font-bold">Date:</span> <span className="font-bold">{formatDate(loan.date)}</span></p>
              <p className="flex justify-between"><span className="text-slate-400 uppercase font-bold">Due Date:</span> <span className="font-bold text-slate-400">{formatDate(loan.dueDate)}</span></p>
            </div>
          </div>
        </div>

        {/* Main Table - Zero Padding */}
        <div className="rounded-lg overflow-hidden border border-slate-300 mb-4">
          <table className="w-full text-[10px] text-center border-collapse">
            <thead className="bg-slate-900 text-white uppercase tracking-tighter">
              <tr>
                <th className="p-1.5 border-r border-slate-700 w-8">SN</th>
                <th className="p-1.5 border-r border-slate-700 text-left">Article Description</th>
                <th className="p-1.5 border-r border-slate-700">Qty</th>
                <th className="p-1.5 border-r border-slate-700">Gross</th>
                <th className="p-1.5">Net Wt</th>
              </tr>
            </thead>
            <tbody className="bg-white font-bold">
              {articles.map((art, idx) => (
                <tr key={art.id} className="border-t border-slate-200">
                  <td className="p-1 border-r border-slate-200 text-slate-400">{idx + 1}</td>
                  <td className="p-1 border-r border-slate-200 text-left uppercase text-slate-900 truncate">{art.name}</td>
                  <td className="p-1 border-r border-slate-200">{art.qty}</td>
                  <td className="p-1 border-r border-slate-200">{art.gross.toFixed(3)}</td>
                  <td className="p-1 text-slate-900 font-black">{art.net.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 text-slate-900 font-black uppercase tracking-tighter border-t-2 border-slate-900">
              <tr>
                <td colSpan={2} className="p-1.5 text-left">Consolidated Totals</td>
                <td className="p-1.5">{totals.qty}</td>
                <td className="p-1.5">{totals.gross.toFixed(3)}</td>
                <td className="p-1.5">{totals.net.toFixed(3)}g</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Collateral Image - Compact */}
        {image && (
          <div className="mb-4">
            <h2 className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1 border-b border-slate-100 pb-0.5">Asset Visual Record</h2>
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex justify-center p-1">
              <img 
                src={image} 
                alt="Collateral" 
                className="max-h-[140px] w-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* Amount Box */}
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3 mb-4 flex items-center justify-between">
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-[#166534] mb-0.5">Disbursed Amount:</p>
            <p className="text-2xl font-black text-[#14532d]">₹ {loan.sanctionAmount.toLocaleString('en-IN')}/-</p>
            <p className="text-[9px] font-bold text-[#166534] italic capitalize opacity-80 mt-0.5 line-clamp-1">
              {numberToWords(loan.sanctionAmount)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-[#166534]/10 flex items-center justify-center">
             <i className="fas fa-check text-[#166534] text-xl"></i>
          </div>
        </div>

        {/* Footer/Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-6">
          <div className="text-center">
            <div className="border-t border-slate-900 pt-1">
              <p className="text-[8px] font-black uppercase tracking-widest">Borrower's Signature</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-slate-900 pt-1">
              <p className="text-[8px] font-black uppercase tracking-widest">Authorized Appraiser</p>
              <p className="text-[7px] text-slate-400 font-bold mt-0.5">({appraiser.name})</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-2 border-t border-dotted border-slate-200 text-center">
           <p className="text-[7px] text-slate-300 font-medium uppercase tracking-widest italic">Digitally Generated via GoldPro Enterprise v2.0</p>
        </div>
      </div>

      {/* Action Bar - No Print */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4 flex flex-col sm:flex-row justify-center gap-3 no-print border-t border-slate-200 z-50">
        <button 
          onClick={handleDownloadPDF} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          <i className="fas fa-file-pdf text-lg"></i> Download PDF
        </button>
        <button 
          onClick={() => window.print()} 
          className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          <i className="fas fa-print text-lg"></i> Print Receipt
        </button>
      </div>
    </div>
  );
};

export default PrintReport;
