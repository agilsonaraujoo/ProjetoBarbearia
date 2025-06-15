import React from 'react';

const AdminSidebar = ({ setView, handleLogout }) => {
    const navigationItems = ['Agenda', 'Clientes', 'Serviços'];

    return (
        <div className="bg-zinc-800 text-white w-64 p-4 flex flex-col min-h-screen">
            <h2 className="text-2xl font-display text-[#D4AF37] mb-8">Admin</h2>
            <nav className="flex-grow">
                <ul>
                    {navigationItems.map(item => (
                        <li key={item} className="mb-4">
                            <button 
                                onClick={() => setView(item.toLowerCase())} 
                                className="w-full text-left text-lg hover:text-[#D4AF37] transition-colors duration-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            >
                                {item}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div>
                <button 
                    onClick={handleLogout} 
                    className="w-full text-left text-lg btn-gold font-bold py-2 px-4 rounded-lg"
                >
                    Sair
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
