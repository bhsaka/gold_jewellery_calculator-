
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

const PrintReport: React.FC<PrintReportProps> = ({ appraiser, customer, articles, totals, loan, image }) => {
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

    return inWords(n);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '---';
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <div className="w-full bg-white p-8 font-sans text-slate-900 border border-slate-200">
      {/* Header */}
      <div className="text-center border-b-2 border-slate-900 pb-4 mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-[#1a2b4b]">{appraiser.bank}</h1>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mt-1">Gold Jewellery Loan Details Card / Receipt</p>
        <p className="text-[10px] text-slate-400 mt-1">{appraiser.branch}</p>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2 mb-3">Borrower Details</h2>
          <div className="space-y-2 text-xs">
            <p className="flex justify-between"><span className="font-bold text-slate-500 uppercase text-[9px]">Name:</span> <span className="font-black uppercase">{customer.name || '---'}</span></p>
            <p className="flex justify-between"><span className="font-bold text-slate-500 uppercase text-[9px]">Address:</span> <span className="font-bold text-right max-w-[150px]">{customer.address || '---'}</span></p>
            <p className="flex justify-between"><span className="font-bold text-slate-500 uppercase text-[9px]">Phone:</span> <span className="font-black">{customer.mobile || '---'}</span></p>
          </div>
        </div>
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2 mb-3">Loan Details</h2>
          <div className="space-y-2 text-xs">
            <p className="flex justify-between"><span className="font-bold text-slate-500 uppercase text-[9px]">Loan Number:</span> <span className="font-black">{loan.loanNumber || '---'}</span></p>
            <p className="flex justify-between"><span className="font-bold text-slate-500 uppercase text-[9px]">Date:</span> <span className="font-bold">{formatDate(loan.date)}</span></p>
            <p className="flex justify-between"><span className="font-bold text-slate-500 uppercase text-[9px]">Due Date:</span> <span className="font-bold">{formatDate(loan.dueDate)}</span></p>
          </div>
        </div>
      </div>

      {/* Jewellery Photo */}
      <div className="border border-slate-200 rounded-2xl p-6 mb-8 text-center bg-white shadow-sm">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Jewellery Photo</h3>
        <div className="flex justify-center">
          {image ? (
            <div className="border-4 border-white shadow-xl rounded-lg overflow-hidden max-w-[400px]">
              <img src={image} alt="Collateral" className="w-full h-auto max-h-[300px] object-contain" />
            </div>
          ) : (
            <div className="w-full h-48 bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300 italic font-bold">
              NO IMAGE PROVIDED
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 mb-8 shadow-sm">
        <table className="w-full text-[10px] text-center">
          <thead className="bg-slate-900 text-white uppercase tracking-tighter">
            <tr>
              <th className="p-3 border-r border-slate-800">S.No</th>
              <th className="p-3 border-r border-slate-800 text-left">Item</th>
              <th className="p-3 border-r border-slate-800">No. of Items</th>
              <th className="p-3 border-r border-slate-800">Gross (g)</th>
              <th className="p-3">Net (g)</th>
            </tr>
          </thead>
          <tbody className="bg-white font-bold">
            {articles.map((art, idx) => (
              <tr key={art.id} className="border-t border-slate-100">
                <td className="p-3 border-r border-slate-100 text-slate-400">{idx + 1}</td>
                <td className="p-3 border-r border-slate-100 text-left uppercase text-slate-900">{art.name}</td>
                <td className="p-3 border-r border-slate-100">{art.qty}</td>
                <td className="p-3 border-r border-slate-100">{art.gross.toFixed(3)}</td>
                <td className="p-3 text-slate-900 font-black">{art.net.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-900 text-white font-black uppercase tracking-tighter">
            <tr>
              <td colSpan={2} className="p-3 text-left">Total</td>
              <td className="p-3">{totals.qty}</td>
              <td className="p-3">{totals.gross.toFixed(3)}</td>
              <td className="p-3">{totals.net.toFixed(3)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Sanction Amount */}
      <div className="bg-[#e6f9f0] border-2 border-[#a7f3d0] rounded-2xl p-6 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <i className="fas fa-check-double text-6xl text-emerald-900"></i>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#065f46] mb-1">Sanction Amount:</p>
        <p className="text-4xl font-black text-[#064e3b]">₹ {loan.sanctionAmount.toLocaleString('en-IN')}</p>
        <p className="text-[11px] font-bold text-[#065f46] mt-2 italic capitalize">{numberToWords(loan.sanctionAmount)}</p>
      </div>

      {/* Signature Section */}
      <div className="grid grid-cols-2 gap-20 pt-10 mb-20">
        <div className="text-center">
          <div className="border-t-2 border-slate-900 pt-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Borrower Signature</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t-2 border-slate-900 pt-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Branch Manager Signature</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-rose-50 border border-rose-100 p-4 text-center rounded-xl">
        <p className="text-[10px] font-black text-rose-900 uppercase leading-relaxed">
          Keep this card/receipt safely and this card/receipt has to be returned at the time of delivery of gold ornaments.
        </p>
      </div>

      {/* Print Button */}
      <div className="mt-10 flex justify-center no-print">
        <button 
          onClick={() => window.print()}
          className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-500 transition-all flex items-center gap-3"
        >
          <i className="fas fa-print"></i> Print / Save as PDF
        </button>
      </div>
    </div>
  );
};

export default PrintReport;
