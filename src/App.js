import React, { useState, useEffect } from 'react';
import { auth, db, ADMIN_UIDS } from './firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Importação de Componentes
import Header from './components/Header';
import AdminPanel from './components/admin/AdminPanel';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import PerfilPage from './app/perfil/page';
import BookingNovo from './components/BookingNovo';

function App() {
    // Estados da Aplicação
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [showBooking, setShowBooking] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    // Efeito para observar o estado de autenticação
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                
                setUser(currentUser);
                setIsAdmin(ADMIN_UIDS.includes(currentUser.uid));

                if (userDocSnap.exists()) {
                    setUserData(userDocSnap.data());
                } else {
                    setUserData(null); 
                }
            } else {
                setUser(null);
                setUserData(null);
                setIsAdmin(false);
            }
            setIsAppLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Funções de controle do Modal
    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    // Função de Logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setShowBooking(false);
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    // Função para lidar com o clique no botão de agendamento
    const handleAgendarClick = () => {
        setShowProfile(true);
    };

    // Função para lidar com sucesso no login
    const handleLoginSuccess = () => {
        setShowProfile(true);
        setIsAuthModalOpen(false);
    };

    // Renderização de Loading
    if (isAppLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-zinc-900 text-white font-display text-2xl">
                Carregando Barbearia do César...
            </div>
        );
    }

    // Renderização Principal da Aplicação
    return (
        <div className="bg-zinc-900 min-h-screen flex flex-col text-white">
            {isAdmin ? (
                // Se for admin, mostra o painel de administração
                <AdminPanel onLogout={handleLogout} />
            ) : showProfile ? (
                <PerfilPage />
            ) : showBooking ? (
                // Se não for admin e showBooking for true, mostra a página de agendamento
                <>
                    <Header 
                        user={user} 
                        onLogout={handleLogout} 
                        onLoginClick={openAuthModal} 
                    />
                    <main className="flex-grow container mx-auto px-4 py-8">
                        <div className="my-8 text-center">
                            <h1 className="text-5xl font-display text-[#D4AF37] mb-4">Barbearia do César</h1>
                            <p className="text-xl text-gray-300">Tradição e estilo em cada corte.</p>
                        </div>
                        <BookingNovo 
                            user={user} 
                            userData={userData} 
                            openAuthModal={openAuthModal} 
                        />
                    </main>
                    <Footer />
                </>
            ) : (
                // Se não for admin e showBooking for false, mostra a landing page
                <LandingPage 
                    onAgendarClick={handleAgendarClick}
                    isAuthenticated={!!user}
                />
            )}
        </div>
    );
}

export default App;
