import React, { useState, useEffect, useRef } from 'react';
import { FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaClock, FaPhone, FaChevronLeft, FaChevronRight, FaAward, FaCertificate, FaCut, FaUserTie, FaUserCheck } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './LandingPage.module.css';

const LandingPage = ({ onAgendarClick, isAuthenticated }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Configurações do Slider
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
    };

    // Configurações do Slider de Certificações
    const certificationsSliderSettings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        pauseOnHover: true,
        swipe: true,
        arrows: false,
        adaptiveHeight: true,
    };

    // Array com as certificações
    const certifications = [
        {
            title: "Especialista em Cortes Modernos",
            issuer: "Academia Brasileira de Barbeiros",
            year: "2023",
            icon: <FaAward className="text-4xl text-[#D4AF37] mb-4" />
        },
        {
            title: "Mestre em Técnicas de Barba",
            issuer: "Instituto Nacional de Barbeiros",
            year: "2023",
            icon: <FaCertificate className="text-4xl text-[#D4AF37] mb-4" />
        },
        {
            title: "Especialista em Colorimetria",
            issuer: "Escola de Beleza Profissional",
            year: "2022",
            icon: <FaAward className="text-4xl text-[#D4AF37] mb-4" />
        },
        {
            title: "Técnicas Avançadas de Degradê",
            issuer: "Academia de Barbeiros Profissionais",
            year: "2022",
            icon: <FaCertificate className="text-4xl text-[#D4AF37] mb-4" />
        },
        {
            title: "Gestão de Barbearia",
            issuer: "Instituto de Empreendedorismo",
            year: "2021",
            icon: <FaAward className="text-4xl text-[#D4AF37] mb-4" />
        },
        {
            title: "Atendimento ao Cliente Premium",
            issuer: "Escola de Excelência em Serviços",
            year: "2021",
            icon: <FaCertificate className="text-4xl text-[#D4AF37] mb-4" />
        }
    ];

    // Componentes personalizados para as setas do slider
    function CustomNextArrow(props) {
        const { onClick } = props;
        return (
            <button
                onClick={onClick}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                aria-label="Próximo vídeo"
            >
                <FaChevronRight className="text-xl" />
            </button>
        );
    }

    function CustomPrevArrow(props) {
        const { onClick } = props;
        return (
            <button
                onClick={onClick}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                aria-label="Vídeo anterior"
            >
                <FaChevronLeft className="text-xl" />
            </button>
        );
    }

    const StarRating = ({ rating }) => (
        <div className="flex text-[#D4AF37]">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-[#D4AF37]' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );

    const cortes = [
        { nome: 'Navalhado', preco: 30 },
        { nome: 'Corte Social', preco: 25 },
        { nome: 'Corte na Tesoura', preco: 25 },
        { nome: 'Degradê', preco: 25 },
        { nome: 'Corte Militar', preco: 22 },
        { nome: 'Pezinho', preco: 10 },
    ];
    const barbas = [
        { nome: 'Barba Degradê', preco: 20 },
        { nome: 'Pigmentação', preco: 20 },
        { nome: 'Barba Desenhada', preco: 17 },
        { nome: 'Barba Lisa', preco: 15 },
    ];
    const sobrancelhasCombos = [
        { nome: 'Corte + Barba', preco: 35 },
        { nome: 'Sobrancelha Pinça', preco: 15 },
        { nome: 'Sobrancelha Navalha', preco: 10 },
    ];
    // Ordenar por preço decrescente
    cortes.sort((a, b) => b.preco - a.preco);
    barbas.sort((a, b) => b.preco - a.preco);
    sobrancelhasCombos.sort((a, b) => b.preco - a.preco);

    const services = [
        { name: 'Corte de Cabelo', price: 'R$ 30,00', description: 'Corte tradicional ou moderno com finalização' },
        { name: 'Barba', price: 'R$ 25,00', description: 'Aparar e modelar com toalha quente' },
        { name: 'Corte + Barba', price: 'R$ 50,00', description: 'Pacote completo com desconto' },
        { name: 'Hidratação', price: 'R$ 20,00', description: 'Tratamento capilar profissional' },
    ];

    const galleryItems = [
        { src: '/images/gallery/1.jpg', alt: 'Trabalho 1' },
        { src: '/images/gallery/2.jpg', alt: 'Trabalho 2' },
        { src: '/images/gallery/3.jpg', alt: 'Trabalho 3' },
        { src: '/images/gallery/4.jpg', alt: 'Trabalho 4' },
        { src: '/images/gallery/5.jpg', alt: 'Trabalho 5' },
        { src: '/images/gallery/6.jpg', alt: 'Trabalho 6' },
        { src: '/images/gallery/7.jpg', alt: 'Trabalho 7' },
        { src: '/images/gallery/8.jpg', alt: 'Trabalho 8' },
    ];

    // Adicionar CSS inline para o carrossel contínuo
    const galleryScrollStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        animation: 'gallery-scroll 10s linear infinite',
    };

    // Adicionar CSS inline para o carrossel contínuo das certificações
    const certificationsScrollStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        animation: 'gallery-scroll 10s linear infinite',
    };

    // Função para scroll suave (atualizada para fechar o menu mobile)
    const handleSmoothScroll = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    // Função para scrollar até o topo
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsMobileMenuOpen(false);
    };

    // Função para saudação dinâmica
    function getSaudacao() {
        const hora = new Date().getHours();
        if (hora >= 5 && hora < 12) return 'Bom dia';
        if (hora >= 12 && hora < 18) return 'Boa tarde';
        return 'Boa noite';
    }
    const saudacao = getSaudacao();
    const whatsappMsg = encodeURIComponent(`${saudacao}, meu nome é [seu nome] e gostaria de agendar um horário para um corte de cabelo (ou serviço desejado) na Barbearia do César. Pode me informar os horários disponíveis?`);
    const whatsappUrl = `https://wa.me/5583994045375?text=${whatsappMsg}`;

    return (
        <>
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo e Nome */}
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={handleScrollToTop}>
                            <img 
                                src="/images/gallery/barbearia-logo.png" 
                                alt="Logo Barbearia do César" 
                                className="h-12 w-auto"
                            />
                            <span className="text-2xl font-display text-primary">
                                Barbearia do César
                            </span>
                        </div>

                        {/* Menu de Navegação */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <button onClick={handleScrollToTop} className="link bg-transparent border-none p-0 m-0">Início</button>
                            <button onClick={() => handleSmoothScroll('gallery')} className="link bg-transparent border-none p-0 m-0">Galeria</button>
                            <button onClick={() => handleSmoothScroll('certifications')} className="link bg-transparent border-none p-0 m-0">Certificações</button>
                            <button onClick={() => handleSmoothScroll('services')} className="link bg-transparent border-none p-0 m-0">Serviços</button>
                            <button onClick={() => handleSmoothScroll('location')} className="link bg-transparent border-none p-0 m-0">Localização</button>
                            <button
                                onClick={onAgendarClick}
                                className="btn-primary px-6 py-2 rounded-lg"
                            >
                                Agendar
                            </button>
                        </nav>

                        {/* Menu Mobile */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:text-[#D4AF37] transition-colors focus:outline-none">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            {isMobileMenuOpen && (
                                <div className="absolute top-20 left-0 w-full bg-black/95 z-50 flex flex-col items-center py-6 space-y-6 shadow-lg animate-fade-in">
                                    <button onClick={handleScrollToTop} className="link text-lg">Início</button>
                                    <button onClick={() => handleSmoothScroll('gallery')} className="link text-lg">Galeria</button>
                                    <button onClick={() => handleSmoothScroll('certifications')} className="link text-lg">Certificações</button>
                                    <button onClick={() => handleSmoothScroll('services')} className="link text-lg">Serviços</button>
                                    <button onClick={() => handleSmoothScroll('location')} className="link text-lg">Localização</button>
                                    <button
                                        onClick={() => { setIsMobileMenuOpen(false); onAgendarClick(); }}
                                        className="btn-primary px-8 py-3 rounded-lg text-lg"
                                    >
                                        Agendar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section sem vídeo */}
            <section className="relative h-screen section-snap">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="/images/hero-poster.jpg"
                        alt="Barbearia do César Hero"
                        className="w-full h-full object-cover"
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="absolute inset-0 bg-black/70"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
                    <img 
                        src="/images/gallery/barbearia-logo.png" 
                        alt="Logo Barbearia do César" 
                        className="h-24 w-auto mx-auto mb-4"
                        onContextMenu={e => e.preventDefault()}
                        draggable={false}
                    />
                    <h1 className="text-5xl md:text-7xl font-display tracking-wider mb-6">
                        Barbearia do César
                    </h1>
                    <p className="text-xl md:text-2xl text-muted mb-8 max-w-2xl">
                        Excelência em cortes e barbas, com mais de 30 certificações profissionais
                    </p>
                    <button
                        onClick={onAgendarClick}
                        className="btn-primary px-8 py-4 rounded-lg text-lg"
                    >
                        Agendar Horário
                    </button>
                </div>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
                    </div>
                </div>
            </section>

            {/* Galeria */}
            <section id="gallery" className="py-20 bg-[#1a1a1a] section-snap">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display tracking-wider mb-4">
                            Nossa Galeria
                        </h2>
                        <p className="text-xl text-muted max-w-2xl mx-auto">
                            Conheça alguns dos nossos trabalhos na Barbearia do César
                        </p>
                    </div>
                    <div className="overflow-x-hidden w-full">
                        <div className="marquee-track-gallery">
                            <div className="marquee-content-gallery">
                                {galleryItems.map((item, idx) => (
                                    <div key={idx} className="flex-shrink-0 rounded-lg" style={{ width: '220px', height: '275px', overflow: 'hidden' }}>
                                        <img
                                            src={item.src}
                                            alt={item.alt}
                                            className="w-full h-full object-cover object-center select-none rounded-lg"
                                            draggable={false}
                                            onContextMenu={e => e.preventDefault()}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="marquee-content-gallery">
                                {galleryItems.map((item, idx) => (
                                    <div key={"dup-"+idx} className="flex-shrink-0 rounded-lg" style={{ width: '220px', height: '275px', overflow: 'hidden' }}>
                                        <img
                                            src={item.src}
                                            alt={item.alt}
                                            className="w-full h-full object-cover object-center select-none rounded-lg"
                                            draggable={false}
                                            onContextMenu={e => e.preventDefault()}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Certificações */}
            <section id="certifications" className="py-20 bg-[#121212] section-snap">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display tracking-wider mb-4">
                            Certificações
                        </h2>
                        <p className="text-xl text-muted max-w-2xl mx-auto">
                            Conheça algumas das certificações profissionais do César
                        </p>
                    </div>
                    <div className="overflow-x-hidden w-full">
                        <div className="marquee-track-cert">
                            <div className="marquee-content-cert">
                                {certifications.map((cert, idx) => (
                                    <div key={idx} className="flex flex-col justify-between items-center bg-black rounded-lg overflow-hidden p-8 shadow-lg h-full" style={{ minWidth: '320px', maxWidth: '320px', height: '340px' }}>
                                        <div>
                                            {cert.icon}
                                            <h3 className="text-xl font-bold text-white mb-2 mt-2">{cert.title}</h3>
                                            <p className="text-[#D4AF37] font-medium mb-1">{cert.issuer}</p>
                                        </div>
                                        <div className="w-full flex justify-center">
                                            <span className="cert-year text-muted text-sm">{cert.year}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="marquee-content-cert">
                                {certifications.map((cert, idx) => (
                                    <div key={"dup-"+idx} className="flex flex-col justify-between items-center bg-black rounded-lg overflow-hidden p-8 shadow-lg h-full" style={{ minWidth: '320px', maxWidth: '320px', height: '340px' }}>
                                        <div>
                                            {cert.icon}
                                            <h3 className="text-xl font-bold text-white mb-2 mt-2">{cert.title}</h3>
                                            <p className="text-[#D4AF37] font-medium mb-1">{cert.issuer}</p>
                                        </div>
                                        <div className="w-full flex justify-center">
                                            <span className="cert-year text-muted text-sm">{cert.year}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Serviços */}
            <section id="services" className="py-20 bg-[#1a1a1a] section-snap">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display tracking-wider mb-4">
                            Nossos Serviços
                        </h2>
                        <p className="text-xl text-muted max-w-2xl mx-auto">
                            Qualidade e excelência em todos os nossos serviços
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Cortes */}
                        <div className="card-service animate-fade-up p-8 flex flex-col items-center text-center">
                            <FaCut className={styles.icon} />
                            <h3 className="text-2xl font-display text-primary mb-4">Cortes</h3>
                            <ul className="space-y-4 w-full">
                                {cortes.map((item, idx) => (
                                    <li key={idx} className="flex justify-between items-center border-b border-[#333] pb-2">
                                        <span className="text-muted">{item.nome}</span>
                                        <span className={styles['price-animated']}>R$ {item.preco.toFixed(2).replace('.', ',')}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Barbas */}
                        <div className="card-service animate-fade-up p-8 flex flex-col items-center text-center">
                            <FaUserTie className={styles.icon} />
                            <h3 className="text-2xl font-display text-primary mb-4">Barbas</h3>
                            <ul className="space-y-4 w-full">
                                {barbas.map((item, idx) => (
                                    <li key={idx} className="flex justify-between items-center border-b border-[#333] pb-2">
                                        <span className="text-muted">{item.nome}</span>
                                        <span className={styles['price-animated']}>R$ {item.preco.toFixed(2).replace('.', ',')}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Sobrancelhas e Combos */}
                        <div className="card-service animate-fade-up p-8 flex flex-col items-center text-center">
                            <FaUserCheck className={styles.icon} />
                            <h3 className="text-2xl font-display text-primary mb-4">Sobrancelhas e Combos</h3>
                            <ul className="space-y-4 w-full">
                                {sobrancelhasCombos.map((item, idx) => (
                                    <li key={idx} className="flex justify-between items-center border-b border-[#333] pb-2">
                                        <span className="text-muted font-medium">{item.nome}</span>
                                        <span className={styles['price-animated']}>R$ {item.preco.toFixed(2).replace('.', ',')}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 text-center">
                        <button
                            onClick={onAgendarClick}
                            className="btn-primary px-8 py-4 rounded-lg text-lg animate-fade-up"
                        >
                            Agendar Horário
                        </button>
                    </div>
                </div>
            </section>

            {/* Localização */}
            <section id="location" className="py-20 bg-[#1a1a1a] section-snap">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display tracking-wider mb-4">
                            Nossa Localização
                        </h2>
                        <p className="text-xl text-muted max-w-2xl mx-auto">
                            Venha conhecer a Barbearia do César em um local de fácil acesso
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="card p-6 rounded-lg hover:shadow-lg transition-all duration-300">
                            <h3 className="text-2xl font-display text-primary mb-4">
                                Barbearia do César
                            </h3>
                            <p className="text-muted mb-4">
                                R. Ernesto Cavalcante, boxe 03<br />
                                Alagoa Grande - PB<br />
                                58388-000
                            </p>
                            <p className="text-muted mb-4">
                                <strong className="text-primary">Horário de Funcionamento:</strong><br />
                                Domingo: Fechado<br />
                                Segunda-feira: 08:00–18:00<br />
                                Terça-feira: 08:00–18:00<br />
                                Quarta-feira: 08:00–18:00<br />
                                Quinta-feira: 08:00–20:00<br />
                                Sexta-feira: 08:00–20:00<br />
                                Sábado: 08:00–20:00
                            </p>
                            <p className="text-muted">
                                <strong className="text-primary">Contato:</strong><br />
                                (83) 99404-5375<br />
                                augustocesarc@outlook.com
                            </p>
                        </div>

                        <div className="h-[400px] rounded-lg overflow-hidden shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d494.9696798963693!2d-35.630958899679484!3d-7.037768547439055!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ac372e08d5d059%3A0x6eb59a5fc2bd7898!2sBarbearia%20do%20C%C3%A9sar!5e0!3m2!1spt-BR!2sbr!4v1749961903095!5m2!1spt-BR!2sbr"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Localização da Barbearia do César"
                                className="rounded-lg"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#121212] py-12 border-t border-[#333]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-display text-primary mb-4">
                                Barbearia do César
                            </h3>
                            <p className="text-muted">
                                Excelência em cortes e barbas, com mais de 30 certificações profissionais.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-display text-primary mb-4">Links Rápidos</h4>
                            <ul className="space-y-2">
                                <li><button onClick={handleScrollToTop} className="link bg-transparent border-none p-0 m-0 w-full text-left">Início</button></li>
                                <li><button onClick={() => handleSmoothScroll('gallery')} className="link bg-transparent border-none p-0 m-0 w-full text-left">Galeria</button></li>
                                <li><button onClick={() => handleSmoothScroll('certifications')} className="link bg-transparent border-none p-0 m-0 w-full text-left">Certificações</button></li>
                                <li><button onClick={() => handleSmoothScroll('services')} className="link bg-transparent border-none p-0 m-0 w-full text-left">Serviços</button></li>
                                <li><button onClick={() => handleSmoothScroll('location')} className="link bg-transparent border-none p-0 m-0 w-full text-left">Localização</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-display text-primary mb-4">Contato</h4>
                            <ul className="space-y-2 text-muted">
                                <li>R. Ernesto Cavalcante, boxe 03</li>
                                <li>Alagoa Grande - PB</li>
                                <li>58388-000</li>
                                <li>(83) 9404-5375</li>
                                <li>augustocesarc@outlook.com</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-[#333] text-center text-muted">
                        <p>&copy; {new Date().getFullYear()} Barbearia do César. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>

            {/* Botão Flutuante WhatsApp */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 rounded-full shadow-lg p-4 flex items-center justify-center transition-colors"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}
                title="Agende pelo WhatsApp"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 24 24">
                    <path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.18-1.62A12.07 12.07 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.85 0-3.68-.5-5.25-1.45l-.38-.23-3.67.96.98-3.58-.25-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.28.42-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/>
                </svg>
            </a>
        </>
    );
};

export default LandingPage;
