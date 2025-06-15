import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const AddServiceModal = ({ onClose }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!name || !price || isNaN(price) || !duration || isNaN(duration)) {
            alert('Por favor, preencha todos os campos com valores válidos.');
            return;
        }

        setIsSaving(true);

        try {
            await addDoc(collection(db, 'services'), {
                name: name,
                price: Number(price),
                duration: Number(duration)
            });
            alert('Serviço adicionado com sucesso!');
            onClose();
        } catch (error) {
            console.error('Erro ao adicionar o serviço: ', error);
            alert('Ocorreu um erro ao salvar. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-zinc-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-display text-[#D4AF37] mb-4">Adicionar Novo Serviço</h2>
                
                <div className="mb-4">
                    <label htmlFor="name" className="block text-white text-sm font-bold mb-2">Nome do Serviço</label>
                    <input 
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-zinc-300"
                        placeholder="Ex: Corte de Cabelo"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="price" className="block text-white text-sm font-bold mb-2">Preço (R$)</label>
                    <input 
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-zinc-300"
                        placeholder="Ex: 45.50"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="duration" className="block text-white text-sm font-bold mb-2">Duração (minutos)</label>
                    <input 
                        type="number"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-zinc-300"
                        placeholder="Ex: 30"
                    />
                </div>

                <div className="flex items-center justify-end space-x-4">
                    <button 
                        onClick={onClose} 
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="btn-gold font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Salvando...' : 'Adicionar Serviço'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddServiceModal;
