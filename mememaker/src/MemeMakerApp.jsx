import React, { useEffect, useState } from 'react';
import './MemeMakerApp.css';
import mainBg from './assets/main_bg.png';
import logo from './assets/logo.png';
import uproad from './assets/btn_uproad.png';
import axios from 'axios';

function MemeMakerApp() {
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [toMakePage, setMakePage] = useState(false);
  const [toSeePage, setSeePage] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  const getImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/images');
      console.log(response.data);
      setImageUrls(response.data);
      console.log('옹?');
    } catch (error) {
      console.error('이미지 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    getImages();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      console.log(window.scrollY);
      if (window.scrollY >= 1) {
        setShowScrollHint(false);
      } else {
        setShowScrollHint(true);
      }

      if (window.scrollY >= 1200) {
        setMakePage(true);
      }
      else{
        setMakePage(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const ToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    getImages();
  };

  const ToMakePage = () => {
    setMakePage(true);
    window.scrollTo({ top: 1200, behavior: 'smooth' });
  };

  const ToCategoryPage = () => {
  window.scrollTo({ top: 2405, behavior: 'smooth' });
};

  return (
    <div className="MemeMakerApp">
      <nav className="navbar">
        <img src={logo} alt="로고" className="logo" onClick={ToTop}/>
        <div className="nav-links">
          <span
            className={`nav-link ${toMakePage ? 'active' : ''}`}
            onClick={ToMakePage}>
            만들기
          </span>
          <span className="nav-link"> / 다른 사람의 짤</span>
        </div>
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
  {imageUrls.map((image, index) => (
    <div key={index} className="image-box">
      <img src={image.url} alt={`meme-${index}`} className="image" />
    </div>
  ))}
</div>

        <div className="more_text" onClick={ToCategoryPage}>더 많은 사진 ⬇</div>
      </section>

      <section className="make-page2">
        <div className="third-text">
          사진을 카테고리별로<br />정리했어요
        </div>
        <div className="category-table">
          <div className="category-head">
            <div className="category-cell">#귀여운</div>
            <div className="category-cell">#재밌는</div>
            <div className="category-cell">#템플릿</div>
          </div>
          <div className="category-btm">
            <div className="category-cell"><div className="category_image" /></div>
            <div className="category-cell"><div className="category_image" /></div>
            <div className="category-cell"><div className="category_image" /></div>
          </div>
        </div>
      </section>

      <section className="make-page3">
        <div className="fourth-text">내 사진도 사용할 수 있어요</div>
        <div className="custom-upload-row">
        <div className="upload-box">
          <img src={uproad} alt="업로드" className="btn_uproad" />
    </div>
  </div>
</section>

    </div>
  );
}

export default MemeMakerApp;
