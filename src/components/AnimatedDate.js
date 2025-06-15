import React, { useEffect, useRef } from 'react';
import './AnimatedDate.css';

// date: objeto Date
// exemplo de uso: <AnimatedDate date={new Date()} />
export default function AnimatedDate({ date }) {
  const dayRef = useRef();
  const monthRef = useRef();
  const yearRef = useRef();

  useEffect(() => {
    if (!date) return;
    // Reinicia animações
    dayRef.current.classList.remove('slide-in');
    monthRef.current.classList.remove('fade-in');
    yearRef.current.classList.remove('flip-in');
    void dayRef.current.offsetWidth; void monthRef.current.offsetWidth; void yearRef.current.offsetWidth;
    dayRef.current.classList.add('slide-in');
    monthRef.current.classList.add('fade-in');
    yearRef.current.classList.add('flip-in');
  }, [date]);

  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
  const year = date.getFullYear();

  return (
    <div className="date-card-anim">
      <div className="date-part-anim day slide-in" ref={dayRef}>{day}</div>
      <div className="date-part-anim month fade-in" ref={monthRef}>{month}</div>
      <div className="date-part-anim year flip-in" ref={yearRef}>{year}</div>
    </div>
  );
} 