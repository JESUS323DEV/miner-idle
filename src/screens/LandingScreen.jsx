import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import '../styles/landing.css';
import logo from '../assets/landing-pico-pata/logo.webp';
import ayudantes from '../assets/landing-pico-pata/ayudantes.webp';
import minas from '../assets/landing-pico-pata/minas.webp';
import picos from '../assets/landing-pico-pata/picos.webp';
import produccionOro from '../assets/landing-pico-pata/produccion-oro.webp';

const CARDS = [
    { img: picos, title: 'Tu pico', desc: 'Mejóralo para extraer más materiales y avanzar en los biomas.' },
    { img: ayudantes, title: 'Ayudantes', desc: 'Recluta mascotas con habilidades únicas que trabajan a tu lado.' },
    { img: minas, title: 'Minas', desc: 'Explora distintas minas y desbloquea nuevos biomas.' },
    { img: produccionOro, title: 'Producción', desc: 'Construye una red pasiva que genera recursos continuamente.' },
];

const LandingScreen = ({ active, onPlay }) => {
    const [index, setIndex] = useState(0);
    const touchStartX = useRef(null);

    const prev = () => setIndex(i => (i - 1 + CARDS.length) % CARDS.length);
    const next = () => setIndex(i => (i + 1) % CARDS.length);
    const card = CARDS[index];

    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const delta = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
        touchStartX.current = null;
    };

    return (
        <div className={`landing-screen${active ? '' : ' landing-slide-out'}`}>

            <section className="landing-hero">
                <div className="landing-title">Pata y Pico</div>
                <div className="landing-tagline">Mina, mejora y recluta.</div>
                <button className="landing-play-btn" onClick={onPlay}>
                    <img src={logo} alt="Pata y Pico" className="landing-logo" />
                    <span className="landing-play-label">Jugar</span>
                </button>
                <div className="landing-scroll-hint">
                    <ChevronDown size={28} />
                </div>
            </section>

            <section className="landing-gallery-section">
                <div className="landing-scroll-hint-up">
                    <ChevronUp size={28} />
                </div>
                <div className="landing-section-title">¿Qué es el juego?</div>

                <div className="landing-gallery" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    <button className="landing-arrow" onClick={prev}>
                        <ChevronLeft size={22} />
                    </button>

                    <div className="landing-card">
                        <img src={card.img} alt={card.title} className="landing-card-img" />
                        <div className="landing-card-info">
                            <div className="landing-card-title">{card.title}</div>
                            <div className="landing-card-desc">{card.desc}</div>
                        </div>
                    </div>

                    <button className="landing-arrow" onClick={next}>
                        <ChevronRight size={22} />
                    </button>
                </div>

                <div className="landing-dots">
                    {CARDS.map((_, i) => (
                        <button
                            key={i}
                            className={`landing-dot${i === index ? ' landing-dot-active' : ''}`}
                            onClick={() => setIndex(i)}
                        />
                    ))}
                </div>

                <div className="landing-footer">
                    <span>Proyecto personal en desarrollo activo</span>
                    <a href="https://jesusdev.es" target="_blank" rel="noreferrer">jesusdev.es</a>
                </div>
            </section>

        </div>
    );
};

export default LandingScreen;
