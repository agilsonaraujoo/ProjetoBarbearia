import React from 'react';

const BirthdayModal = ({ name, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-2xl border-2 border-[#D4AF37] text-center">
            <div className="mx-auto bg-[#D4AF37] rounded-full h-16 w-16 flex items-center justify-center mb-6">
                 <svg className="w-10 h-10 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6 11h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>
            </div>
            <h2 className="text-4xl font-display text-center text-white mb-4">Feliz Aniversário, {name}!</h2>
            <p className="text-gray-300 mb-6">A equipe da Barbearia do César deseja a você um dia incrível! Aproveite seu dia especial.</p>
            <button onClick={onClose} className="btn-gold font-bold py-3 px-10 rounded-lg">Obrigado!</button>
        </div>
    </div>
);

export default BirthdayModal;
