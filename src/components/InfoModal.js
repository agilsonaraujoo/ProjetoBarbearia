import React from 'react';

const InfoModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-lg bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-700 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
            <h2 className="text-4xl font-display text-center text-white mb-6">Informações Importantes</h2>
            <div className="text-left bg-zinc-800 p-6 rounded-lg space-y-4 text-gray-300">
                <div>
                    <h3 className="font-bold text-lg text-[#D4AF37] mb-2">Política de Tolerância de Atraso</h3>
                    <p>A Barbearia do César valoriza o tempo de todos os nossos clientes e profissionais. Pedimos a sua colaboração para chegar no horário.</p>
                    <p className="mt-2 font-semibold">Oferecemos uma tolerância de <span className="text-white">15 minutos</span> de atraso. Após este período, para não comprometer a agenda do dia, seu horário será <span className="text-red-400">automaticamente cancelado</span> e será necessário realizar um novo agendamento, conforme a disponibilidade.</p>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-[#D4AF37] mb-2">Cancelamentos</h3>
                    <p>Se precisar cancelar ou reagendar, por favor, entre em contato conosco com o máximo de antecedência possível para que possamos liberar o horário para outro cliente.</p>
                </div>
            </div>
            <div className="text-center mt-8"><button onClick={onClose} className="btn-gold font-bold py-2 px-10 rounded-lg">Entendi</button></div>
        </div>
    </div>
);

export default InfoModal;
