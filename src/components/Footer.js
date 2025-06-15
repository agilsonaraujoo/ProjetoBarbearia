import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-zinc-800 text-center p-4 mt-8">
            <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Barbearia do César. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-xs mt-1">
                Desenvolvido por Rodrigo.
            </p>
        </footer>
    );
};

export default Footer;
