import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MemeMakerEditPage.css';
import axios from 'axios';
import help from './assets/help.png';
import discription from './assets/sqchat.png';
import addtext from './assets/add-text.png';
import addchat from './assets/add-chat.png';
import rotate from './assets/rotate.png';
import addblank from './assets/add-blank.png';

function MemeMakerEditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const img = location.state?.img;
  const imageRef = useRef(null);
  const [scale, setScale] = useState(0.7);
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(img?.imgURL || '');

  const getAllImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/meme/all');
        setImageUrls(response.data);
      } catch (error) {
        console.error('전체 이미지 불러오기 실패:', error);
      }
    };

  const Tohome = () => navigate('/');

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    setScale(prev => Math.min(Math.max(delta > 0 ? prev * 0.95 : prev * 1.05, 0.2), 5));
  };

  const handleTemplateClick = (url) => {
  setSelectedImageUrl(url);
  setScale(0.7);
  };

  const addText = () =>{

  };
  const addChat = () =>{

  };
  const Rotate = () =>{

  };
  const addBlank = () =>{

  };

  useEffect(() => {
    getAllImages();
    const imgEl = imageRef.current;
    if (imgEl) imgEl.addEventListener('wheel', handleWheel);
    return () => {
      if (imgEl) imgEl.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="edit-page">
      <div className="sidebar">
        템플릿 교체
        {imageUrls.map((img, i) => (
          <img
            key={i}
            src={img.imgURL}
            alt={`템플릿-${img.temId}`}
            className="template-item"
            onClick={() => handleTemplateClick(img.imgURL)}
          />
        ))}
      </div>
      <div className="help-item" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
        <img src={help} alt="도움말" className="btn-help" />
          {showTooltip && (
            <div className="tooltip">
                <div className="tooltip-text">
                  짤을 편집하는 화면입니다!<br />
                  이미지를 스크롤해서<br />
                  확대/축소 할 수 있습니다.
                  </div>
              </div>
              )}
          </div>
      {img ? (
        <div className="image-container">
          <div className="image-wrapper">
          <img
            ref={imageRef}
            src={selectedImageUrl}
            alt="편집할 이미지"
            className="editable-image"
            style={{ transform: `scale(${scale})` }}
          />
          </div>
        </div>
      ) : (
        <p>이미지가 없습니다.</p>
      )}

      <div className="button-group">
        <button onClick={Tohome} className="cancel-btn">취소</button>
        <button  className="confirm-btn">완성</button>
      </div>

      <div className="editor-navbar">
        <div className="add-text">
          <img src={addtext} alt="텍스트 추가" className="btn-text" onClick={addText}/>
          텍스트 추가
        </div>
        <div className="add-chat">
          <img src={addchat} alt="말풍선 추가" className="btn-chat" onClick={addChat}/>
          말풍선 추가
        </div>
        <div className="rotate">
          <img src={rotate} alt="회전 추가" className="rotate" onClick={Rotate}/>
          회전
        </div>
        <div className="add-blank">
          <img src={addblank} alt="여백 추가" className="btn-blank" onClick={addBlank}/>
          여백 생성
        </div>
      </div>
    </div>
  );
}

export default MemeMakerEditPage;