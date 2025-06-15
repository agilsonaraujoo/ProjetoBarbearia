import React, { useState } from 'react';

const PaymentModal = ({ details, onConfirm, onCancel }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [paymentError, setPaymentError] = useState('');

    if (!details) return null;
    const { service } = details;
    const paymentValue = (service.price / 2).toFixed(2);
    
    const validatePaymentForm = () => {
        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) return 'Número do cartão inválido. Deve ter 16 dígitos.';
        if (cardName.trim().length < 3) return 'Nome no cartão inválido.';
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) return 'Data de validade inválida. Use o formato MM/AA.';
        const [month, year] = expiryDate.split('/');
        const expiryYear = parseInt(`20${year}`, 10);
        const expiryMonth = parseInt(month, 10);
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) return 'Cartão com data de validade expirada.';
        if (!/^\d{3,4}$/.test(cvc)) return 'CVC inválido. Deve ter 3 ou 4 dígitos.';
        return '';
    };

    const handlePayment = () => {
        setPaymentError('');
        const validationError = validatePaymentForm();
        if (validationError) {
            setPaymentError(validationError);
            return;
        }
        setIsLoading(true);
        // Simula uma chamada de API de pagamento
        setTimeout(() => {
            onConfirm();
            setIsLoading(false);
        }, 2000);
    };
    
    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
        if (formattedValue.length <= 19) setCardNumber(formattedValue);
    };

    const handleExpiryDateChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
        if (value.length <= 5) setExpiryDate(value);
    };
    
    const handleCvcChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) setCvc(value);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-700">
                <h2 className="text-4xl font-display text-center text-white mb-2">Pagamento do Sinal</h2>
                <p className="text-center text-gray-400 mb-6">Para confirmar seu agendamento, é necessário o pagamento de 50% do valor do serviço.</p>
                <div className="bg-zinc-800 p-4 rounded-lg text-center mb-6"><p className="text-gray-400">Valor a pagar:</p><p className="font-bold text-4xl text-[#D4AF37]">R$ {paymentValue.replace('.', ',')}</p></div>
                {paymentError && <p className="bg-red-500/50 text-white p-3 rounded-md text-center mb-4 font-bold">{paymentError}</p>}
                <div className="space-y-4">
                    <input value={cardNumber} onChange={handleCardNumberChange} className="w-full p-3 bg-zinc-800 rounded-md text-white border border-zinc-700" placeholder="Número do Cartão (16 dígitos)" disabled={isLoading} />
                    <input value={cardName} onChange={(e) => setCardName(e.target.value)} className="w-full p-3 bg-zinc-800 rounded-md text-white border border-zinc-700" placeholder="Nome no Cartão" disabled={isLoading} />
                    <div className="flex gap-4">
                        <input value={expiryDate} onChange={handleExpiryDateChange} className="w-full p-3 bg-zinc-800 rounded-md text-white border border-zinc-700" placeholder="Validade (MM/AA)" disabled={isLoading} />
                        <input value={cvc} onChange={handleCvcChange} className="w-full p-3 bg-zinc-800 rounded-md text-white border border-zinc-700" placeholder="CVC" disabled={isLoading} type="password" maxLength="4" />
                    </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">Este é um ambiente de demonstração. Nenhum dado de pagamento real é necessário ou armazenado.</p>
                <div className="flex justify-center gap-4 mt-8">
                    <button onClick={onCancel} disabled={isLoading} className="bg-gray-600 hover:bg-gray-700 font-bold py-3 px-8 rounded-lg">Cancelar</button>
                    <button onClick={handlePayment} disabled={isLoading} className="btn-gold font-bold py-3 px-8 rounded-lg flex items-center justify-center min-w-[150px]">{isLoading ? <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : "Pagar e Agendar"}</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
