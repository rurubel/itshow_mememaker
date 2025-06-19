import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MemeMakerApp.css';
import mainBg from './assets/main_bg.png';
import logo from './assets/logo.png';
import uproad from './assets/btn_uproad.png';
import explain from './assets/explain.gif';
import axios from 'axios';

function MemeMakerApp() {
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [toMakePage, setMakePage] = useState(false);
  const [toSeePage, setSeePage] = useState(false);
  const [ranimageUrls, setranImageUrls] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  
  const fileInputRef = useRef(null)
  const navigate = useNavigate();
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

  const ToEditPage = (img) => {
    navigate('/edit', { state: { img } });
  }

  const upload = () => {
    fileInputRef.current.click();
  };

  const reset = () => {
    fileInputRef.current.click();
  };

  const fileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const imageURL = URL.createObjectURL(file);
      setUploadedImage(imageURL);
    }
    else if(!file){
      return;
    }
    else {
      alert('PNG 또는 JPG 이미지만 사용할 수 있습니다.');
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
    setUploadedImage(null);
    fileInputRef.current.value = null;
  };

  const ToMakePage = () => {
    setMakePage(true);
    window.scrollTo({ top: 1200, behavior: 'smooth' });
  };

  const ToCategoryPage = () => {
  window.scrollTo({ top: 2430, behavior: 'smooth' });
};

  const ToSeePage=()=>{
    navigate('/see');
  }

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
          /
          <span className="nav-link"
              onClick={ToSeePage}>
              다른 사람의 짤
              </span>
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
          {ranimageUrls.map((img, index) => (
            <div key={index} className="image-box" onClick={() => ToEditPage(img)}>
              <img src={img.imgURL} alt={`meme-${img.temId}`} className="image" />
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
                  <img key={i} src={img.imgURL} alt={`cute-${img.temId}`} onClick={() => ToEditPage(img)} />
                ))}
              </div>
            </div>
            <div className="category-cell category-box">
              <div className="category-images">
                {funny.map((img, i) => (
                  <img key={i} src={img.imgURL} alt={`funny-${img.temId}`} onClick={() => ToEditPage(img)} />
                ))}
              </div>
            </div>
            <div className="category-cell category-box">
              <div className="category-images">
                {template.map((img, i) => (
                  <img key={i} src={img.imgURL} alt={`template-${img.temId}`} onClick={() => ToEditPage(img)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="make-page3">
        <div className="fourth-text">내 사진도 사용할 수 있어요</div>
          {!uploadedImage && (
            <div className="explain">
              <img src={explain} alt="설명" className="explain" />
              </div>
            )}
        
        <div className="custom-upload">
         <div className="upload-box" onClick={!uploadedImage ? upload : undefined}>
          {!uploadedImage ? (
            <>
              <img src={uproad} alt="업로드" className="btn_uproad" />
              <div className="uproad-text">클릭해서 이미지를 업로드 해주세요</div>
            </>
          ) : (
            <>
              <img src={uploadedImage} alt="업로드된 이미지" className="btn_uproad" />
              <div className="uproad-text">이 사진으로 결정할까요?</div>
              <div className="button-group">
                <button className="reset-btn" onClick={reset}>다시 선택</button>
                <button className="confirm-btn" onClick={() => ToEditPage({ imgURL: uploadedImage, temId: 'uproad', categori: '#내사진' })}>선택 완료</button>
              </div>
            </>
          )}
          <input
            type="file"
            accept="image/png, image/jpeg"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={fileChange}
          />
          </div>
        </div>
      </section>
    </div>
  );
}

export default MemeMakerApp;
