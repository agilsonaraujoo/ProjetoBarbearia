'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaEdit } from 'react-icons/fa';
import AnimatedDate from '../../components/AnimatedDate';
import AuthModal from '../../components/AuthModal';

export default function PerfilPage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                setUserData(null);
                setLoading(false);
                return;
            }
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUserData({ ...userDoc.data(), email: user.email });
                }
            } catch (error) {
                console.error("Erro ao carregar dados do usuário:", error);
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    if (!userData && !loading) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <div className="w-full max-w-md">
                    <AuthModal />
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <div className="text-[#D4AF37] text-xl">Carregando...</div>
            </div>
        );
    }

    if (!userData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-zinc-800 rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-[#D4AF37]/60">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-display text-[#D4AF37]">Meu Perfil</h1>
                        <button className="text-[#D4AF37] hover:text-amber-400 transition-colors">
                            <FaEdit size={24} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <FaUser className="text-[#D4AF37] text-xl" />
                            <div>
                                <p className="text-gray-400 text-sm">Nome Completo</p>
                                <p className="text-white text-lg">{userData.firstName} {userData.lastName}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <FaPhone className="text-[#D4AF37] text-xl" />
                            <div>
                                <p className="text-gray-400 text-sm">WhatsApp</p>
                                <p className="text-white text-lg">{userData.whatsapp}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <FaEnvelope className="text-[#D4AF37] text-xl" />
                            <div>
                                <p className="text-gray-400 text-sm">E-mail</p>
                                <p className="text-white text-lg">{userData.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <FaCalendarAlt className="text-[#D4AF37] text-xl" />
                            <div>
                                <p className="text-gray-400 text-sm">Data de Nascimento</p>
                                <div className="flex items-center gap-4">
                                    <p className="text-white text-lg">
                                        {new Date(userData.birthDate).toLocaleDateString('pt-BR')}
                                    </p>
                                    <AnimatedDate date={new Date(userData.birthDate)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-zinc-700">
                        <h2 className="text-xl font-display text-[#D4AF37] mb-4">Meus Agendamentos</h2>
                        <p className="text-gray-400">Em breve você poderá ver seus agendamentos aqui.</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 