import React from 'react';

const Modal = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-800 p-8 rounded-lg shadow-xl text-center mx-4">
            <p className="text-white text-lg mb-6">{message}</p>
            <button onClick={onClose} className="btn-gold font-bold py-2 px-8 rounded-lg">
                Ok
            </button>
        </div>
    </div>
);

export default Modal;
