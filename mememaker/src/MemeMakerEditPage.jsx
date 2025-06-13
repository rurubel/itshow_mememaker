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
  const [addStack, setAddStack] = useState([]);
  const [texts, setTexts] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
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

  const addText = () => {
  const id = Date.now()+'text';
  const newTextBox = {
    id,
    x: 50,
    y: 50,
    text: '텍스트를 입력해주세요.',
    fontSize: 16,
    color: '#000000',
  };

  setTexts(prev => [...prev, newTextBox]);

  setAddStack(prev => [...prev, { type: 'add-text', data: newTextBox }]);
  }

  const handleTextClick = (id) => {
  setSelectedText(id);
  };

  const handleMouseDown = (e, id) => {
  setDraggingId(id);
  setDragStart({ x: e.clientX, y: e.clientY });
};

const handleMouseMove = (e) => {
  if (!draggingId || !imageRef.current) return;

  const deltaX = e.clientX - dragStart.x;
  const deltaY = e.clientY - dragStart.y;

  const imageRect = imageRef.current.getBoundingClientRect();

  setTexts(prev => prev.map(tb => {
    if (tb.id !== draggingId) return tb;

    const newX = tb.x + (deltaX / imageRect.width) * 100;
    const newY = tb.y + (deltaY / imageRect.height) * 100;

    return { ...tb, x: newX, y: newY };
  }));

  setDragStart({ x: e.clientX, y: e.clientY }); 
};

const handleMouseUp = () => {
  if (!draggingId) return;

  const tb = texts.find(t => t.id === draggingId);
  const prev = addStack[addStack.length - 1]?.data;

  if (tb && prev && (prev.x !== tb.x || prev.y !== tb.y)) {
    setAddStack(prevStack => [
      ...prevStack,
      {
        type: 'move-text',
        id: tb.id,
        from: { x: prev.x, y: prev.y },
        to: { x: tb.x, y: tb.y },
      },
    ]);
  }

  setDraggingId(null);
  setDragStart(null);
};


  const updateTextBox = (id, key, value) => {
  setTexts(prev =>
    prev.map(tb =>
      tb.id === id ? { ...tb, [key]: value } : tb
    )
  );
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
    const handleClickOutside = (e) => {
    if (
      e.target.closest('.text-box') ||
      e.target.closest('.text-edit')
    ) {
      return;
    }
    setSelectedText(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      if (imgEl) imgEl.removeEventListener('wheel', handleWheel);
      document.removeEventListener('click', handleClickOutside);
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
      {selectedText && (
      <div className="text-edit">
        <label>크기 : 
      <input
        type="number"
        value={texts.find(tb => tb.id === selectedText)?.fontSize || 16}
        onChange={e => updateTextBox(selectedText, 'fontSize', parseInt(e.target.value))}
      />
      </label>
      <label>색상 : 
      <input
        type="color"
        value={texts.find(tb => tb.id === selectedText)?.color || '#000000'}
        onChange={e => updateTextBox(selectedText, 'color', e.target.value)}
      />
      </label>
      </div>
      )}
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
          {texts.map(tb => (
            <div
              key={tb.id}
              className="text-box"
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              onClick={(e) => {
              e.stopPropagation();
              setSelectedText(tb.id);
              }}
            style={{
              position: 'absolute',
              top: `${tb.y}%`,
              left: `${tb.x}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${tb.fontSize}px`,
              color: tb.color,
              backgroundColor: 'transparent',
              border: tb.id === selectedText ? '1px dashed #aaa' : 'none',
              padding: '2px',
              minWidth: '50px',
    }}
  >
        {tb.text}
      </div>
        ))}
          </div>
        </div>
      ) : (
        <p>이미지가 없습니다.</p>
      )}

      <div className="btn-group">
        <button onClick={Tohome} className="cancel-btn">취소</button>
        <button  className="confirm-btn">완성</button>
      </div>

      <div className="editor-navbar">
        <div className="add-text">
          <img src={addtext} alt="텍스트 추가" className="btn-text" onClick={addText}/><br/>
          텍스트 추가
        </div>
        <div className="add-chat">
          <img src={addchat} alt="말풍선 추가" className="btn-chat" onClick={addChat}/><br/>
          말풍선 추가
        </div>
        <div className="rotate">
          <img src={rotate} alt="회전 추가" className="btn-rotate" onClick={Rotate}/><br/>
          회전
        </div>
        <div className="add-blank">
          <img src={addblank} alt="여백 추가" className="btn-blank" onClick={addBlank}/><br/>
          여백 생성
        </div>
      </div>
    </div>
  );
  }

export default MemeMakerEditPage;