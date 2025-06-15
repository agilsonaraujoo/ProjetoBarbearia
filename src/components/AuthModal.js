import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FaEye, FaEyeSlash, FaCalendarAlt } from 'react-icons/fa';

// Função para aplicar máscara de telefone
function maskWhatsapp(value) {
    let v = value.replace(/\D/g, '');
    v = v.replace(/^0+/, '');
    if (v.length > 2) v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
    if (v.length > 10) v = v.slice(0, 10) + '-' + v.slice(10, 15);
    return v.slice(0, 15);
}

const AuthModal = ({ onClose, onLoginSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (!firstName || !lastName || !birthDate) {
            setError('Por favor, preencha todos os campos.');
            return;
        }
        if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(whatsapp)) {
            setError('Digite um WhatsApp válido no formato (99) 99999-9999.');
            return;
        }
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Salvando os dados do perfil do usuário no Firestore
            await setDoc(doc(db, "users", user.uid), {
                firstName: firstName,
                lastName: lastName,
                email: user.email,
                whatsapp: whatsapp,
                birthDate: birthDate,
                createdAt: new Date()
            });

            setMessage('Cadastro realizado com sucesso! Você já pode fazer o login.');

            // Limpa o formulário e volta para a tela de login
            setTimeout(() => {
                setIsRegistering(false);
                setMessage('');
            }, 3000);

        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('Este e-mail já está cadastrado.');
            } else {
                setError('Ocorreu um erro durante o cadastro.');
                console.error("Erro no cadastro: ", err);
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (onLoginSuccess) {
                onLoginSuccess();
            } else {
                onClose();
            }
        } catch (err) {
            setError('E-mail ou senha inválidos.');
        }
    };

    const handlePasswordReset = async () => {
        if (!email) {
            setError('Por favor, insira seu e-mail para redefinir a senha.');
            return;
        }
        setError('');
        setMessage('');
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Link para redefinição de senha enviado para o seu e-mail.');
        } catch (err) {
            setError('Não foi possível enviar o e-mail de redefinição.');
        }
    };

    const handleClose = () => {
        window.location.href = '/';
    };

    const inputStyle = "w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50" onClick={handleClose}>
            <div className="bg-[#121212] p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md relative border-2 border-[#D4AF37]/60 max-h-[90vh] overflow-y-auto" style={{ boxShadow: '0 0 32px 0 #D4AF3744, 0 2px 16px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-3 right-3 text-gray-400 hover:text-[#D4AF37] text-2xl">&times;</button>
                
                <h2 className="text-3xl font-display text-center text-[#D4AF37] mb-6">
                    {isRegistering ? 'Crie sua Conta' : 'Acesse sua Conta'}
                </h2>

                {error && <p className="bg-red-500/10 text-red-400 p-3 rounded-md mb-4 text-center border border-red-400/30">{error}</p>}
                {message && <p className="bg-[#D4AF37]/10 text-[#D4AF37] p-3 rounded-md mb-4 text-center border border-[#D4AF37]/30">{message}</p>}

                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                    {isRegistering && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="firstName">Nome</label>
                                    <input className={inputStyle} id="firstName" type="text" placeholder="Seu nome" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="lastName">Sobrenome</label>
                                    <input className={inputStyle} id="lastName" type="text" placeholder="Seu sobrenome" value={lastName} onChange={e => setLastName(e.target.value)} required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="whatsapp">WhatsApp</label>
                                <input
                                    className={inputStyle}
                                    id="whatsapp"
                                    type="tel"
                                    placeholder="(99) 99999-9999"
                                    value={whatsapp}
                                    onChange={e => setWhatsapp(maskWhatsapp(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="birthDate">Data de Nascimento</label>
                                <input
                                    className={inputStyle + ' pr-10'}
                                    id="birthDate"
                                    type="date"
                                    value={birthDate}
                                    onChange={e => setBirthDate(e.target.value)}
                                    required
                                />
                                <FaCalendarAlt className="absolute right-3 top-9 text-[#D4AF37] pointer-events-none" />
                            </div>
                        </>
                    )}
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="email">Email</label>
                        <input className={inputStyle} id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="password">Senha</label>
                        <input
                            className={inputStyle + ' pr-10'}
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="******************"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button type="button" className="absolute right-3 top-9 text-gray-400 hover:text-[#D4AF37]" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {isRegistering && (
                        <div className="relative">
                            <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="confirmPassword">Confirmar Senha</label>
                            <input
                                className={inputStyle + ' pr-10'}
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirme sua senha"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button type="button" className="absolute right-3 top-9 text-gray-400 hover:text-[#D4AF37]" onClick={() => setShowConfirmPassword(v => !v)} tabIndex={-1}>
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    )}
                    <div className="flex flex-col items-center pt-4">
                        <button className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition duration-300" type="submit">
                            {isRegistering ? 'Cadastrar' : 'Entrar'}
                        </button>
                        <button type="button" className="text-sm text-gray-400 hover:text-[#D4AF37] mt-4" onClick={() => setIsRegistering(!isRegistering)}>
                            {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
                        </button>
                        {!isRegistering && (
                            <button type="button" className="text-xs text-gray-500 hover:text-gray-300 mt-2" onClick={handlePasswordReset}>
                                Esqueceu sua senha?
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;
