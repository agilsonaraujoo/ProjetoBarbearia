import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const clientList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setClients(clientList);
            } catch (err) {
                console.error("Erro ao buscar clientes:", err);
                setError("Não foi possível carregar a lista de clientes.");
            }
            setIsLoading(false);
        };

        fetchClients();
    }, []);

    return (
        <div className="bg-zinc-800 p-4 md:p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-display text-white mb-4">Lista de Clientes</h3>
            
            {error && <p className="text-red-400 p-3 bg-red-900/50 rounded-md">{error}</p>}

            {isLoading ? (
                <p className="text-center text-gray-400 p-10">Carregando clientes...</p>
            ) : clients.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto">
                        <thead className="bg-zinc-900 text-gray-300 uppercase text-sm">
                            <tr>
                                <th className="p-3 font-semibold">Nome</th>
                                <th className="p-3 font-semibold">Email</th>
                                <th className="p-3 font-semibold">WhatsApp</th>
                                <th className="p-3 font-semibold">Data de Nasc.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-700 text-gray-200">
                            {clients.map(client => (
                                <tr key={client.id} className="hover:bg-zinc-700/50 transition-colors">
                                    <td className="p-3">{`${client.firstName || ''} ${client.lastName || ''}`.trim()}</td>
                                    <td className="p-3">{client.email}</td>
                                    <td className="p-3">{client.whatsapp || '-'}</td>
                                    <td className="p-3">{client.birthDate || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center bg-zinc-900/50 p-10 rounded-lg">
                    <p className="text-gray-400">Nenhum cliente encontrado.</p>
                </div>
            )}
        </div>
    );
};

export default ClientList;
