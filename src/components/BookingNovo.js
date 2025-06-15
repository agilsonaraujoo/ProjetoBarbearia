import React, { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

// Mock de barbeiros
const mockBarbers = [
  { id: 'cesar', name: 'César' },
  { id: 'rodrigo', name: 'Rodrigo' },
];

// Mock de agendamentos existentes (exemplo)
const mockAppointments = [
  // Exemplo: César já tem corte às 10:00 do dia 2024-06-10
  { barberId: 'cesar', date: '2024-06-10', time: '10:00', duration: 60 },
  // Rodrigo tem barba às 11:00 do dia 2024-06-10
  { barberId: 'rodrigo', date: '2024-06-10', time: '11:00', duration: 30 },
];

// Gera os horários possíveis
function generateTimeSlots(open = 9, close = 20, interval = 15) {
  const slots = [];
  for (let h = open; h < close; h++) {
    for (let m = 0; m < 60; m += interval) {
      if (h === 13) continue; // pula almoço
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  return slots;
}

function addMinutes(time, mins) {
  const [h, m] = time.split(':').map(Number);
  const date = new Date(2000, 0, 1, h, m);
  date.setMinutes(date.getMinutes() + mins);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export default function BookingNovo() {
  const [services, setServices] = useState([]);
  const [service, setService] = useState('');
  const [barber, setBarber] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      const snapshot = await getDocs(collection(db, 'services'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(list);
    }
    fetchServices();
  }, []);

  // Horários possíveis
  const allSlots = useMemo(() => generateTimeSlots(), []);

  // Horários disponíveis
  const availableTimes = useMemo(() => {
    if (!service || !barber || !date) return [];
    const serv = services.find(s => s.id === service);
    if (!serv) return [];
    const duration = serv.duration;
    const today = new Date();
    const selectedDay = new Date(date);
    const isToday = today.toDateString() === selectedDay.toDateString();
    const dateStr = format(selectedDay, 'yyyy-MM-dd');
    return allSlots.filter(slot => {
      // Regra: só pode agendar a partir de 2h do horário atual
      if (isToday) {
        const [sh, sm] = slot.split(':').map(Number);
        const slotDate = new Date(selectedDay);
        slotDate.setHours(sh, sm, 0, 0);
        if (slotDate.getTime() < today.getTime() + 2 * 60 * 60 * 1000) return false;
      }
      // Regra: não pode passar do fechamento
      const endSlot = addMinutes(slot, duration);
      if (endSlot > '20:00') return false;
      // Regra: não pode invadir almoço
      if ((slot < '14:00' && endSlot > '13:00' && endSlot <= '14:00') || (slot >= '13:00' && slot < '14:00')) return false;
      // Regra: não pode sobrepor agendamento existente
      const conflict = mockAppointments.some(app => {
        if (app.barberId !== barber) return false;
        if (app.date !== dateStr) return false;
        const appStart = app.time;
        const appEnd = addMinutes(app.time, app.duration);
        return (slot < appEnd && endSlot > appStart);
      });
      return !conflict;
    });
  }, [service, barber, date, allSlots, services]);

  function handleSubmit(e) {
    e.preventDefault();
    setSuccess(true);
  }

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-[#D4AF37] mb-6 text-center">Novo Agendamento</h2>
      {success ? (
        <div className="text-green-500 text-center font-bold">Agendamento realizado com sucesso!</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Serviço */}
          <div>
            <label className="block text-white font-bold mb-2">1. Serviço</label>
            <select value={service} onChange={e => {setService(e.target.value); setBarber(''); setDate(new Date()); setTime('');}} className="w-full p-3 bg-zinc-700 text-white rounded-lg">
              <option value="">Selecione...</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.duration} min) - R${s.price}</option>
              ))}
            </select>
          </div>
          {/* Barbeiro */}
          <div>
            <label className="block text-white font-bold mb-2">2. Barbeiro</label>
            <select value={barber} onChange={e => {setBarber(e.target.value); setDate(new Date()); setTime('');}} disabled={!service} className="w-full p-3 bg-zinc-700 text-white rounded-lg disabled:opacity-50">
              <option value="">Selecione...</option>
              {mockBarbers.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          {/* Data */}
          <div>
            <label className="block text-white font-bold mb-2">3. Data</label>
            <input
              type="date"
              value={format(date, 'yyyy-MM-dd')}
              onChange={e => { setDate(new Date(e.target.value)); setTime(''); }}
              disabled={!barber}
              className="w-full p-3 bg-zinc-700 text-white rounded-lg disabled:opacity-50"
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
          {/* Horário */}
          <div>
            <label className="block text-white font-bold mb-2">4. Horário</label>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {availableTimes.length === 0 && (service && barber && date) && (
                <span className="col-span-3 text-zinc-400 text-center">Nenhum horário disponível</span>
              )}
              {availableTimes.map(h => (
                <button type="button" key={h} onClick={() => setTime(h)} className={`p-2 rounded-lg font-semibold ${time === h ? 'bg-[#D4AF37] text-black' : 'bg-zinc-600 text-white hover:bg-zinc-500'}`}>{h}</button>
              ))}
            </div>
          </div>
          {/* Confirmar */}
          <button type="submit" disabled={!service || !barber || !date || !time} className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed">Agendar</button>
        </form>
      )}
    </div>
  );
} 