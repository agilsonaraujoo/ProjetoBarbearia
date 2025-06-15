import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import EditServiceModal from './EditServiceModal';
import AddServiceModal from './AddServiceModal'; // Importando o novo modal

const ServicesView = () => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Estado para o modal de adição
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'services'), orderBy('name'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const servicesData = [];
            querySnapshot.forEach((doc) => {
                servicesData.push({ id: doc.id, ...doc.data() });
            });
            setServices(servicesData);
            setIsLoading(false);
        }, (error) => {
            console.error("Erro ao buscar serviços: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleEditClick = (service) => {
        setSelectedService(service);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedService(null);
    };

    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    if (isLoading) {
        return <p className="p-8 text-white">Carregando serviços...</p>;
    }

    return (
        <>
            <div className="p-8 text-white">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-display text-[#D4AF37]">Serviços e Preços</h1>
                    <button 
                        onClick={handleOpenAddModal}
                        className="btn-gold font-bold py-2 px-4 rounded-lg"
                    >
                        Adicionar Novo Serviço
                    </button>
                </div>
                <div className="bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-zinc-700">
                            <tr>
                                <th className="py-3 px-4 text-left">Serviço</th>
                                <th className="py-3 px-4 text-left">Preço</th>
                                <th className="py-3 px-4 text-left">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-700">
                            {services.map(service => (
                                <tr key={service.id} className="hover:bg-zinc-700 transition-colors duration-200">
                                    <td className="py-3 px-4">{service.name}</td>
                                    <td className="py-3 px-4">{`R$ ${Number(service.price).toFixed(2)}`}</td>
                                    <td className="py-3 px-4">
                                        <button 
                                            onClick={() => handleEditClick(service)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {services.length === 0 && (
                        <div className="p-8 text-center">
                            <p>Nenhum serviço encontrado.</p>
                            <p className="text-sm text-gray-400 mt-2">
                                Clique em "Adicionar Novo Serviço" para começar.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {isEditModalOpen && (
                <EditServiceModal service={selectedService} onClose={handleCloseEditModal} />
            )}

            {isAddModalOpen && (
                <AddServiceModal onClose={handleCloseAddModal} />
            )}
        </>
    );
};

export default ServicesView;
