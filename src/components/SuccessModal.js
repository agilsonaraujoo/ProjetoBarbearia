import React from 'react';

const SuccessModal = ({ details, onClose }) => {
    if (!details) return null;
    const { service, date, time, barber, clientName } = details;
    const formattedDate = new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: 'long', year: 'numeric' });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg bg-zinc-900 p-8 rounded-2xl shadow-2xl border-2 border-green-500 text-center">
                <div className="mx-auto bg-green-500 rounded-full h-16 w-16 flex items-center justify-center mb-6">
                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-4xl font-display text-center text-white mb-4">Agendamento Realizado!</h2>
                <p className="text-gray-300 mb-6">O horário para <span className="font-bold text-white">{clientName}</span> foi confirmado com sucesso.</p>
                <div className="text-left bg-zinc-800 p-4 rounded-lg space-y-2 mb-6">
                    <p><span className="font-bold text-gray-400">Serviço:</span> <span className="font-semibold">{service.name}</span></p>
                    <p><span className="font-bold text-gray-400">Data:</span> <span className="font-semibold">{formattedDate}</span></p>
                    <p><span className="font-bold text-gray-400">Horário:</span> <span className="font-semibold">{time}</span></p>
                    <p><span className="font-bold text-gray-400">Barbeiro:</span> <span className="font-semibold">{barber}</span></p>
                    <p className="pt-2 border-t border-zinc-700"><span className="font-bold text-gray-400">Preço Total:</span> <span className="font-bold text-2xl text-[#D4AF37]">R$ {service.price.toFixed(2).replace('.',',')}</span></p>
                </div>
                <button onClick={onClose} className="btn-gold font-bold py-3 px-10 rounded-lg">Ótimo!</button>
            </div>
        </div>
    );
};

export default SuccessModal; 
