
import React, { useState } from 'react';
import { Donation } from '../../types';
import { MOCK_DONATIONS } from '../../constants';

const AdminDonations = () => {
  const [donations] = useState<Donation[]>(() => {
      // Charger les dons fictifs (Mock) + les dons réels (LocalStorage)
      const stored = localStorage.getItem('ddr_donations');
      const realDonations = stored ? JSON.parse(stored) : [];
      
      // Fusionner et trier
      const allDonations = [...realDonations, ...MOCK_DONATIONS];
      allDonations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return allDonations;
  });
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredDonations = donations.filter(d => {
      const matchesFilter = filter === 'All' || d.method === filter;
      const matchesSearch = d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            d.donorPhone.includes(searchTerm) || 
                            (d.transactionId && d.transactionId.includes(searchTerm));
      return matchesFilter && matchesSearch;
  });

  const totalAmount = filteredDonations.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const getMethodStyle = (method: string) => {
      switch(method) {
          case 'Wave': return 'bg-[#1dc4ff]/10 text-[#1dc4ff] border-[#1dc4ff]/20';
          case 'OrangeMoney': return 'bg-[#ff7900]/10 text-[#ff7900] border-[#ff7900]/20';
          case 'MTN': return 'bg-[#ffcc00]/10 text-[#ffcc00] border-[#ffcc00]/20';
          case 'Carte': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
          default: return 'bg-gray-800 text-gray-400 border-gray-700';
      }
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-800 pb-8">
        <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Transactions</h1>
            <p className="text-gray-500 mt-2 text-sm">
                Suivi comptable des dons pour la <span className="text-brand-500 font-bold">Campagne École</span>.
            </p>
        </div>
        <div className="flex gap-3">
             <button className="px-5 py-2.5 bg-[#121214] border border-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:text-white hover:border-gray-500 transition flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                 Exporter CSV
             </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121214] border border-gray-800 p-6 rounded-2xl relative overflow-hidden group hover:border-brand-500/30 transition">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition">
                  <svg className="w-24 h-24 text-brand-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/></svg>
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Volume Total (Affiché)</span>
              <p className="text-3xl font-mono font-bold text-white mt-2 tracking-tight">{totalAmount.toLocaleString()} <span className="text-brand-500 text-lg">FCFA</span></p>
          </div>

          <div className="bg-[#121214] border border-gray-800 p-6 rounded-2xl">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Transactions</span>
              <p className="text-3xl font-mono font-bold text-white mt-2">{filteredDonations.length}</p>
              <p className="text-xs text-gray-600 mt-4">Dons validés.</p>
          </div>

          <div className="bg-[#121214] border border-gray-800 p-6 rounded-2xl">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Panier Moyen</span>
              <p className="text-3xl font-mono font-bold text-gray-300 mt-2">{(filteredDonations.length ? Math.round(totalAmount / filteredDonations.length) : 0).toLocaleString()} F</p>
          </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#121214] p-2 rounded-xl border border-gray-800">
          <div className="flex gap-1 overflow-x-auto w-full md:w-auto no-scrollbar">
              {['All', 'Wave', 'OrangeMoney', 'MTN', 'Carte'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${filter === f ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'}`}
                  >
                      {f}
                  </button>
              ))}
          </div>

          <div className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Rechercher ID, Nom..." 
                className="w-full bg-black border border-gray-700 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none placeholder-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-[#121214] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-black border-b border-gray-800">
                    <tr>
                        <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">ID Transaction</th>
                        <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Donateur</th>
                        <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Montant</th>
                        <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Méthode</th>
                        <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Statut</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                    {filteredDonations.map((don) => (
                        <tr key={don.id} className="hover:bg-gray-800/30 transition group">
                            <td className="px-6 py-4">
                                <span className="font-mono text-xs text-gray-500 bg-black px-2 py-1 rounded border border-gray-800 group-hover:border-gray-600 transition">
                                    #{don.transactionId || '---'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border ${don.isAnonymous ? 'bg-gray-900 border-gray-700 text-gray-500' : 'bg-brand-900/20 border-brand-500/30 text-brand-500'}`}>
                                        {don.isAnonymous ? '?' : don.donorName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold ${don.isAnonymous ? 'text-gray-500 italic' : 'text-white'}`}>
                                            {don.donorName || 'Anonyme'}
                                        </p>
                                        <p className="text-xs text-gray-600 font-mono tracking-wide">{don.donorPhone}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="font-mono text-white font-bold text-base group-hover:text-brand-500 transition">
                                    {don.amount.toLocaleString()} F
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wide ${getMethodStyle(don.method)}`}>
                                    {don.method}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-400">
                                {new Date(don.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    SUCCÈS
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
          
          {filteredDonations.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-600">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <p className="text-gray-400 font-medium">Aucune transaction trouvée.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default AdminDonations;
