import React, { useState } from 'react';
import AgendaView from './AgendaView';
import ServiceManager from './ServiceManager';
import ClientList from './ClientList';

const AdminPanel = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('agenda');

    const renderContent = () => {
        switch (activeTab) {
            case 'agenda':
                return <AgendaView />;
            case 'services':
                return <ServiceManager />;
            case 'clients':
                return <ClientList />;
            default:
                return <AgendaView />;
        }
    };

    const getButtonClass = (tabName) => {
        return `py-2 px-4 rounded-lg font-semibold transition-colors duration-300 ${
            activeTab === tabName
                ? 'bg-[#D4AF37] text-black'
                : 'bg-zinc-700 hover:bg-zinc-600 text-white'
        }`;
    };

    return (
        <div className="bg-zinc-900/50 p-4 md:p-6 rounded-lg shadow-xl mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-display text-[#D4AF37]">Painel do Administrador</h2>
                <button
                    onClick={onLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                    Sair da Conta
                </button>
            </div>
            <div className="flex justify-center gap-4 mb-6 border-b border-zinc-700 pb-4">
                <button onClick={() => setActiveTab('agenda')} className={getButtonClass('agenda')}>
                    Agenda
                </button>
                <button onClick={() => setActiveTab('services')} className={getButtonClass('services')}>
                    Serviços
                </button>
                <button onClick={() => setActiveTab('clients')} className={getButtonClass('clients')}>
                    Clientes
                </button>
            </div>

            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminPanel;
