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
  const [ranimageUrls, setranImageUrls] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const cute = imageUrls.filter(img => img.categori === '#귀여운');
  const funny = imageUrls.filter(img => img.categori === '#재밌는');
  const template = imageUrls.filter(img => img.categori === '#템플릿');

  const getRandomImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/meme/random');
      setranImageUrls(response.data);
    } catch (error) {
      console.error('랜덤 이미지 불러오기 실패:', error);
    }
  };

  const getAllImages = async () => {
  try {
    const response = await axios.get('http://localhost:5000/meme/all');
    setImageUrls(response.data);
  } catch (error) {
    console.error('전체 이미지 불러오기 실패:', error);
  }
};

  useEffect(() => {
    getRandomImages();
    getAllImages();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
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
    getRandomImages();
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
          {ranimageUrls.map((image, index) => (
            <div key={index} className="image-box">
        <img src={image.imgURL} alt={`meme-${image.temId}`} className="image" />
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
            <div className="category-cell category-box">
              <div className="category-images">
                {cute.map((img, i) => (
                  <img key={i} src={img.imgURL} alt={`cute-${img.temId}`} />
                ))}
              </div>
            </div>
            <div className="category-cell category-box">
              <div className="category-images">
                {funny.map((img, i) => (
                  <img key={i} src={img.imgURL} alt={`funny-${img.temId}`} />
                ))}
              </div>
            </div>
            <div className="category-cell category-box">
              <div className="category-images">
                {template.map((img, i) => (
                  <img key={i} src={img.imgURL} alt={`template-${img.temId}`} />
                ))}
              </div>
            </div>
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
