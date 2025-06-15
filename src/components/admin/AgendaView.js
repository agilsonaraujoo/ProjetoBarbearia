import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { format } from 'date-fns';

const AgendaView = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ordena para mostrar os mais recentes primeiro
        const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const appointmentsData = [];
            querySnapshot.forEach((doc) => {
                appointmentsData.push({ id: doc.id, ...doc.data() });
            });
            setAppointments(appointmentsData);
            setLoading(false);
        });

        return () => unsubscribe(); // Limpa o listener ao desmontar o componente
    }, []);

    const handleConfirmPayment = async (id) => {
        const appointmentRef = doc(db, 'appointments', id);
        try {
            await updateDoc(appointmentRef, {
                status: 'confirmed'
            });
            // Opcional: pode adicionar uma notificação de sucesso
        } catch (error) {
            console.error("Erro ao confirmar agendamento: ", error);
            alert('Erro ao confirmar o agendamento.');
        }
    };

    const handleCancelAppointment = async (id) => {
        if (window.confirm('Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.')) {
            const appointmentRef = doc(db, 'appointments', id);
            try {
                await deleteDoc(appointmentRef);
                // Opcional: pode adicionar uma notificação de sucesso
            } catch (error) {
                console.error("Erro ao cancelar agendamento: ", error);
                alert('Erro ao cancelar o agendamento.');
            }
        }
    };

    // Função para dar classes de estilo com base no status
    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending_payment':
                return { 
                    borderColor: 'border-yellow-500',
                    bgColor: 'bg-yellow-900/50',
                    textColor: 'text-yellow-400',
                    label: 'Aguardando Pagamento'
                };
            case 'confirmed':
                return { 
                    borderColor: 'border-green-500',
                    bgColor: 'bg-green-900/50',
                    textColor: 'text-green-400',
                    label: 'Confirmado'
                };
            default:
                return { 
                    borderColor: 'border-zinc-700',
                    bgColor: 'bg-zinc-800',
                    textColor: 'text-gray-400',
                    label: 'Desconhecido'
                };
        }
    };

    if (loading) {
        return <p className="text-center text-gray-400 p-10">Carregando agenda...</p>;
    }

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-3xl font-display text-white mb-6">Agenda de Clientes</h2>
            
            {appointments.length === 0 ? (
                <div className="text-center bg-zinc-800 p-10 rounded-lg">
                    <p className="text-gray-400">Nenhum agendamento encontrado.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments.map(app => {
                        const style = getStatusStyle(app.status);
                        return (
                            <div key={app.id} className={`p-4 rounded-lg border ${style.borderColor} ${style.bgColor}`}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Coluna 1: Cliente e Serviço */}
                                    <div className="md:col-span-2">
                                        <p className="font-bold text-lg text-white">{app.clientName}</p>
                                        <p className="text-gray-300">{app.serviceName} com {app.barber}</p>
                                        <p className="text-sm text-gray-400">
                                            {app.dateTime ? format(app.dateTime.toDate(), 'dd/MM/yyyy') : 'Data não definida'} às {app.dateTime ? format(app.dateTime.toDate(), 'HH:mm') : ''}
                                        </p>
                                    </div>

                                    {/* Coluna 2: Status e Preço */}
                                    <div className="text-left md:text-right">
                                        <p className={`font-semibold text-sm capitalize ${style.textColor}`}>
                                            {style.label}
                                        </p>
                                        <p className="text-lg font-bold text-white">R$ {app.price ? app.price.toFixed(2) : '0.00'}</p>
                                    </div>
                                </div>

                                {/* Ações para agendamentos pendentes */}
                                {app.status === 'pending_payment' && (
                                    <div className="mt-4 pt-4 border-t border-zinc-700 flex flex-wrap gap-4">
                                        <button 
                                            onClick={() => handleConfirmPayment(app.id)} 
                                            className="flex-grow sm:flex-grow-0 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition text-sm"
                                        >
                                            Confirmar Pagamento
                                        </button>
                                        <button 
                                            onClick={() => handleCancelAppointment(app.id)} 
                                            className="flex-grow sm:flex-grow-0 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition text-sm"
                                        >
                                            Cancelar Agendamento
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default AgendaView;
