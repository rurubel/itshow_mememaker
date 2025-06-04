import React, { useEffect, useState } from 'react';
import './MemeMakerApp.css';
import mainBg from './assets/main_bg.png';
import logo from './assets/logo.png';

function MemeMakerApp() {
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [toMakePage, setMakePage] = useState(false);
  const [toSeePage, setPage] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 0);
}, []);

  useEffect(() => {
    const handleScroll = () => {
      console.log(window.scrollY);
       if(window.scrollY >= 1){
          setShowScrollHint(false);
      }else{
          setShowScrollHint(true);
      }
  };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="MemeMakerApp">
      <nav className="navbar">
        <img src={logo} alt="로고" className="logo" />
        <div className="nav-links">만들기 / 다른 사람의 짤</div>
      </nav>

      <section className="first-page">
        <img src={mainBg} alt="배경" className="main_bg" />
        <div className="main_text">누구나 쉽게 짤 만들기</div>
        <div className={`scroll-hint ${showScrollHint ? 'visible' : 'hidden'}`}>
          화면을 아래로 스크롤해주세요
        </div>
        <div className={`bottom-overlay ${showScrollHint ? 'visible' : 'hidden'}`} />
      </section>

      <section className="make-page1">
        <div className="second_text">
          만들고 싶은 이미지를 선택해<br />지금 바로 시작하세요
        </div>
        <div className="image-grid">
          <div className="image-box" />
          <div className="image-box" />
          <div className="image-box" />
        </div>
        <div className="more_text">더 많은 사진 ➡</div>
      </section>

      {showTopButton && (
        <button className="top-button" onClick={scrollToTop}>
          맨 위로
        </button>
      )}
    </div>
  );
}

export default MemeMakerApp;
