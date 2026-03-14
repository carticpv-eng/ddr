
import React, { useState, useEffect } from 'react';
import { Appointment } from '../../types';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
      const stored = localStorage.getItem('ddr_appointments');
      if (stored) {
          const apts: Appointment[] = JSON.parse(stored);
          apts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          return apts;
      }
      return [];
  });

  const loadAppointments = () => {
      const stored = localStorage.getItem('ddr_appointments');
      if (stored) {
          const apts: Appointment[] = JSON.parse(stored);
          // Tri par date décroissante
          apts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setAppointments(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(apts)) {
                  return apts;
              }
              return prev;
          });
      }
  };

  useEffect(() => {
      // Polling simple pour mise à jour auto
      const interval = setInterval(loadAppointments, 2000);
      return () => clearInterval(interval);
  }, []);

  const updateStatus = (id: string, status: 'confirmed' | 'rejected') => {
      const updated = appointments.map(apt => 
          apt.id === id ? { ...apt, status } : apt
      );
      setAppointments(updated);
      localStorage.setItem('ddr_appointments', JSON.stringify(updated));
  };

  const deleteAppointment = (id: string) => {
      if (window.confirm("Supprimer ce rendez-vous ?")) {
          const updated = appointments.filter(apt => apt.id !== id);
          setAppointments(updated);
          localStorage.setItem('ddr_appointments', JSON.stringify(updated));
      }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
       <div className="flex justify-between items-center pb-6 border-b border-gray-800">
        <div>
            <h1 className="text-3xl font-bold text-white">Rendez-vous</h1>
            <p className="text-gray-500 mt-1">Demandes de rencontres, débats ou dons matériels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3 space-y-4">
               {appointments.length === 0 && <p className="text-gray-500 text-center py-10">Aucun rendez-vous en attente.</p>}
               
               {appointments.map((apt) => (
                   <div key={apt.id} className="bg-[#121214] border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg hover:border-gray-700 transition">
                       <div className={`w-1 rounded-full self-stretch ${apt.status === 'confirmed' ? 'bg-green-500' : apt.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                       
                       <div className="flex-1">
                           <div className="flex justify-between items-start mb-2">
                               <div>
                                   <h3 className="text-xl font-bold text-white">{apt.name}</h3>
                                   <p className="text-brand-500 font-mono text-sm">{apt.phone}</p>
                               </div>
                               <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${
                                   apt.status === 'confirmed' ? 'border-green-500/30 text-green-500 bg-green-500/10' :
                                   apt.status === 'pending' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10' :
                                   'border-red-500/30 text-red-500 bg-red-500/10'
                               }`}>
                                   {apt.status === 'pending' ? 'En Attente' : apt.status}
                               </span>
                           </div>
                           
                           <div className="bg-black/50 p-3 rounded-lg border border-gray-800 mb-4">
                               <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">{apt.subject}</p>
                               <p className="text-gray-300 text-sm leading-relaxed">{apt.message}</p>
                           </div>

                           <div className="flex items-center gap-2 text-xs text-gray-500">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                               Souhaité le : {apt.requestedDate}
                           </div>
                       </div>

                       {/* Actions */}
                       <div className="flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                           {apt.status === 'pending' && (
                               <>
                                <button onClick={() => updateStatus(apt.id, 'confirmed')} className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded uppercase transition">
                                    Confirmer
                                </button>
                                <button onClick={() => updateStatus(apt.id, 'rejected')} className="flex-1 px-4 py-2 bg-red-900/50 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-bold rounded uppercase transition">
                                    Refuser
                                </button>
                               </>
                           )}
                           {apt.status !== 'pending' && (
                               <button onClick={() => deleteAppointment(apt.id)} className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded uppercase transition">
                                   Archiver
                               </button>
                           )}
                           <a href={`tel:${apt.phone}`} className="flex-1 px-4 py-2 bg-black border border-gray-700 hover:border-white text-white text-xs font-bold rounded uppercase transition text-center flex items-center justify-center gap-2">
                               Appeler
                           </a>
                       </div>
                   </div>
               ))}
          </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
