import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ServiceManager = () => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados do formulário
    const [serviceName, setServiceName] = useState('');
    const [servicePrice, setServicePrice] = useState('');
    const [serviceDuration, setServiceDuration] = useState('');
    const [editingServiceId, setEditingServiceId] = useState(null);

    // Busca os serviços do Firestore
    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const servicesSnapshot = await getDocs(collection(db, 'services'));
            const serviceList = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setServices(serviceList);
            setError('');
        } catch (err) {
            console.error("Erro ao buscar serviços: ", err);
            setError('Falha ao carregar os serviços. Tente recarregar a página.');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Lida com o envio do formulário (Adicionar ou Editar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!serviceName || !servicePrice || !serviceDuration) {
            setError('Nome, preço e duração são obrigatórios.');
            return;
        }

        const priceNumber = parseFloat(servicePrice);
        const durationNumber = parseInt(serviceDuration, 10);
        if (isNaN(priceNumber) || priceNumber <= 0 || isNaN(durationNumber) || durationNumber <= 0) {
            setError('Por favor, insira um preço e duração válidos.');
            return;
        }

        setIsLoading(true);
        const serviceData = { name: serviceName, price: priceNumber, duration: durationNumber };

        try {
            if (editingServiceId) {
                // Atualiza o serviço existente
                const serviceDoc = doc(db, 'services', editingServiceId);
                await updateDoc(serviceDoc, serviceData);
            } else {
                // Adiciona um novo serviço
                await addDoc(collection(db, 'services'), serviceData);
            }
            resetForm();
            await fetchServices(); // Recarrega a lista
        } catch (err) {
            console.error("Erro ao salvar serviço: ", err);
            setError('Não foi possível salvar o serviço. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // Prepara o formulário para edição
    const handleEdit = (service) => {
        setEditingServiceId(service.id);
        setServiceName(service.name);
        setServicePrice(service.price.toString());
        setServiceDuration(service.duration ? service.duration.toString() : '');
    };

    // Deleta um serviço
    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
            setIsLoading(true);
            try {
                await deleteDoc(doc(db, 'services', id));
                await fetchServices(); // Recarrega a lista
            } catch (err) {
                console.error("Erro ao deletar serviço: ", err);
                setError('Não foi possível excluir o serviço. Tente novamente.');
                setIsLoading(false);
            }
        }
    };

    // Limpa o formulário
    const resetForm = () => {
        setEditingServiceId(null);
        setServiceName('');
        setServicePrice('');
        setServiceDuration('');
        setError('');
    };

    return (
        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Gerenciar Serviços</h3>

            {/* Formulário de Adicionar/Editar Serviço */}
            <form onSubmit={handleSubmit} className="mb-8 bg-zinc-900/50 p-4 rounded-lg">
                <h4 className="text-xl text-white mb-4">{editingServiceId ? 'Editando Serviço' : 'Adicionar Novo Serviço'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Nome do Serviço</label>
                        <input 
                            type="text"
                            placeholder="Ex: Corte de Cabelo"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            className="w-full p-2 bg-zinc-700 text-white rounded-md border border-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Preço (R$)</label>
                        <input 
                            type="number"
                            placeholder="Ex: 45.00"
                            value={servicePrice}
                            onChange={(e) => setServicePrice(e.target.value)}
                            className="w-full p-2 bg-zinc-700 text-white rounded-md border border-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Duração (min)</label>
                        <input 
                            type="number"
                            value={serviceDuration}
                            onChange={(e) => setServiceDuration(e.target.value)}
                            placeholder="Ex: 30"
                            className="w-full p-2 bg-zinc-700 text-white rounded-md border border-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button type="submit" disabled={isLoading} className="flex-grow bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed">
                        {isLoading ? 'Salvando...' : (editingServiceId ? 'Atualizar Serviço' : 'Adicionar Serviço')}
                    </button>
                    {editingServiceId && (
                        <button type="button" onClick={resetForm} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                            Cancelar Edição
                        </button>
                    )}
                </div>
                {error && <p className="text-red-500 bg-red-100 border border-red-500 rounded-md p-2 text-center mt-4">{error}</p>}
            </form>

            {/* Lista de Serviços */}
            <div>
                <h4 className="text-xl text-white mb-3">Serviços Cadastrados</h4>
                {isLoading && !services.length ? (
                    <p className="text-gray-400">Carregando serviços...</p>
                ) : (
                    <ul className="space-y-3">
                        {services.map(service => (
                            <li key={service.id} className="bg-zinc-700 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-semibold text-white">{service.name}</p>
                                    <p className="text-md text-gray-300">R$ {service.price.toFixed(2)} - {service.duration || 'N/A'} min</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(service)} disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-3 rounded text-sm">Editar</button>
                                    <button onClick={() => handleDelete(service.id)} disabled={isLoading} className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded text-sm">Excluir</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                 {services.length === 0 && !isLoading && (
                    <p className="text-gray-400 bg-zinc-700 p-4 rounded-lg">Nenhum serviço cadastrado ainda.</p>
                )}
            </div>
        </div>
    );
};

export default ServiceManager;
