import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

const EditServiceModal = ({ service, onClose }) => {
    const [price, setPrice] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (service) {
            setPrice(service.price);
        }
    }, [service]);

    const handleSave = async () => {
        if (!price || isNaN(price)) {
            alert('Por favor, insira um preço válido.');
            return;
        }

        setIsSaving(true);
        const serviceRef = doc(db, 'services', service.id);

        try {
            await updateDoc(serviceRef, {
                price: Number(price)
            });
            alert('Preço atualizado com sucesso!');
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar o preço: ', error);
            alert('Ocorreu um erro ao salvar. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!service) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-zinc-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-display text-[#D4AF37] mb-4">Editar Serviço</h2>
                <p className="text-white mb-2">Serviço: <span className="font-bold">{service.name}</span></p>
                
                <div className="mb-4">
                    <label htmlFor="price" className="block text-white text-sm font-bold mb-2">Novo Preço (R$)</label>
                    <input 
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-zinc-300"
                        placeholder="Ex: 45.50"
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
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditServiceModal;
