import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, onSnapshot } from 'firebase/firestore';

const ClientsView = () => {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'users'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const clientsData = [];
            querySnapshot.forEach((doc) => {
                clientsData.push({ id: doc.id, ...doc.data() });
            });
            setClients(clientsData);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return <p className="p-8 text-white">Carregando clientes...</p>;
    }

    return (
        <div className="p-8 text-white">
            <h1 className="text-3xl font-display text-[#D4AF37] mb-6">Lista de Clientes</h1>
            <div className="bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-zinc-700">
                        <tr>
                            <th className="py-3 px-4 text-left">Nome</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Aniversário</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-700">
                        {clients.map(client => (
                            <tr key={client.id} className="hover:bg-zinc-700 transition-colors duration-200">
                                <td className="py-3 px-4">{client.name}</td>
                                <td className="py-3 px-4">{client.email}</td>
                                <td className="py-3 px-4">{client.birthdate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {clients.length === 0 && <p className="p-8 text-center">Nenhum cliente encontrado.</p>}
            </div>
        </div>
    );
};

export default ClientsView;
