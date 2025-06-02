import React, { useEffect, useState } from 'react';
import './MemeMakerApp.css';
import mainBg from './assets/main_bg.png';
import logo from './assets/logo.png';

function MemeMakerApp() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const atBottom = window.innerHeight + scrollY >= document.body.scrollHeight - 5;

      setShowScrollHint(scrollY <= 50);
      setShowOverlay(scrollY <= 50);
      setShowTopButton(atBottom);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    setShowOverlay(true);
    setShowScrollHint(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="MemeMakerApp">
      <img src={mainBg} alt="배경" className="main_bg" />
      <nav className="navbar">
        <img src={logo} alt="로고" className="logo"/>
        <div className="nav-links">만들기 / 다른 사람의 짤</div>
      </nav>
      <div className="main_text">누구나 쉽게 짤 만들기</div>
      {showScrollHint && (
        <div className="scroll-hint">화면을 아래로 스크롤해주세요</div>
      )}
      {showOverlay && <div className="bottom-overlay" />}
      {showTopButton && (
        <button className="top-button" onClick={scrollToTop}>
          맨 위로
        </button>
      )}
      <div style={{ height: '200vh' }}></div>
    </div>
  );
}

export default MemeMakerApp;
