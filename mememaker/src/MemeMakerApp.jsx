import { useEffect, useState } from 'react';
import './MemeMakerApp.css';
import mainBg from './assets/main_bg.png';


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
    handleScroll(); // 초기 상태 설정

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    setShowOverlay(true);
    setShowScrollHint(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="MemeMakerApp">
      <img
      src={mainBg}
      alt="배경"
      className="main_bg"
    />
      {showScrollHint && (
        <div className="scroll-hint">화면을 아래로 스크롤해주세요</div>
      )}
      {showOverlay && <div className="bottom-overlay" />}
      {showTopButton && (
        <button className="top-button" onClick={scrollToTop}>
          맨 위로
        </button>
      )}
    </div>
  );
}

export default MemeMakerApp;