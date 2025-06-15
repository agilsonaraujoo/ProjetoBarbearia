import React from 'react';

const Header = ({ user, onLogout, onLoginClick }) => {
    return (
        <header className="bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-2xl font-display text-[#D4AF37]">
                    Barbearia do César
                </div>
                <nav>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-white hidden sm:block">Olá, {user.displayName || user.email}</span>
                            <button 
                                onClick={onLogout} 
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                            >
                                Sair
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={onLoginClick} 
                            className="bg-[#D4AF37] hover:bg-amber-400 text-black font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            Login / Cadastrar
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
