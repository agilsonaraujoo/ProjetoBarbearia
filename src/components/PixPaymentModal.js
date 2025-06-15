import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

const PIX_KEY = "000.111.222-33";
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=pix-key-${PIX_KEY}`;

const PixPaymentModal = ({ isOpen, onClose, appointment, onConfirm }) => {
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);

    useEffect(() => {
        setPaymentConfirmed(false);
    }, [isOpen]);

    if (!isOpen) return null;

    // Verificação de segurança para evitar o crash
    if (!appointment) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                <div className="bg-zinc-800 text-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4 text-center">
                    <h2 className="text-2xl font-display text-[#D4AF37]">Processando agendamento...</h2>
                </div>
            </div>
        );
    }

    const handleConfirmPayment = async () => {
        try {
            const appointmentRef = doc(db, 'appointments', appointment.id);
            await updateDoc(appointmentRef, {
                status: 'confirmed'
            });
            setPaymentConfirmed(true);
            // Chama a função onConfirm para o componente pai saber que foi sucesso
            if (onConfirm) {
                onConfirm();
            }
        } catch (error) {
            console.error("Erro ao confirmar pagamento: ", error);
            alert("Houve um erro ao confirmar seu pagamento. Por favor, tente novamente.");
        }
    };

    const handleClose = () => {
        if (paymentConfirmed) {
            window.location.reload(); // Recarrega a página para limpar o estado
        } else {
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-zinc-800 text-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4">
                {!paymentConfirmed ? (
                    <>
                        <h2 className="text-3xl font-display text-[#D4AF37] mb-4 text-center">Pagamento com PIX</h2>
                        <div className="text-center mb-6">
                            <p className="text-lg">Serviço: <span className="font-bold">{appointment.serviceName}</span></p>
                            <p className="text-lg">Valor: <span className="font-bold text-green-400">R$ {appointment.price}</span></p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg flex justify-center mb-4">
                            <img src={QR_CODE_URL} alt="QR Code para pagamento PIX" />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2 text-gray-400">Ou use a chave PIX (fictícia):</label>
                            <div className="bg-zinc-700 p-3 rounded-lg text-center">
                                <p className="text-lg font-mono tracking-widest">{PIX_KEY}</p>
                            </div>
                        </div>

                        <p className="text-sm text-center text-gray-400 mb-6">Após realizar o pagamento, clique no botão abaixo para confirmar seu agendamento.</p>

                        <button 
                            onClick={handleConfirmPayment}
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition duration-300 text-lg"
                        >
                            Já Paguei, Confirmar Agendamento
                        </button>
                        <button 
                            onClick={onClose} 
                            className="w-full mt-3 bg-transparent hover:bg-zinc-700 text-gray-300 font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            Cancelar
                        </button>
                    </>
                ) : (
                    <div className="text-center">
                        <h2 className="text-3xl font-display text-green-400 mb-4">Pagamento Confirmado!</h2>
                        <p className="text-lg mb-6">Seu agendamento foi realizado com sucesso. Te esperamos aqui!</p>
                        <button 
                            onClick={handleClose}
                            className="w-full bg-[#D4AF37] hover:bg-amber-400 text-black font-bold py-3 px-4 rounded-lg transition duration-300 text-lg"
                        >
                            Fechar
                        </button>
                    </div>
                )}
                <p className="text-center text-xs text-gray-500 mt-6">Após enviar o comprovante, aguarde a confirmação do barbeiro. Se o pagamento não for confirmado, a vaga será liberada automaticamente.</p>
            </div>
        </div>
    );
};

export default PixPaymentModal;
