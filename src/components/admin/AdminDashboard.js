import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AgendaView from './AgendaView';
import ClientsView from './ClientsView';
import ServicesView from './ServicesView';

const AdminDashboard = ({ handleLogout }) => {
    const [view, setView] = useState('agenda');

    const renderView = () => {
        switch (view) {
            case 'agenda':
                return <AgendaView />;
            case 'clientes':
                return <ClientsView />;
            case 'serviços':
                return <ServicesView />;
            default:
                return <AgendaView />;
        }
    };

    return (
        <div className="flex bg-zinc-900 min-h-screen">
            <AdminSidebar setView={setView} handleLogout={handleLogout} />
            <main className="flex-grow">
                {renderView()}
            </main>
        </div>
    );
};

export default AdminDashboard;
