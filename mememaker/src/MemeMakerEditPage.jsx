import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MemeMakerEditPage.css';
import axios from 'axios';
import help from './assets/help.png';
import addtext from './assets/add-text.png';
import addchat from './assets/add-chat.png';
import imgchat from './assets/chat.png';
import sqchat from './assets/sqchat.png';
import rotate from './assets/rotate.png';
import addblank from './assets/add-blank.png';
import up from './assets/up.png';
import down from './assets/down.png';
import left from './assets/left.png';
import right from './assets/right.png';

function MemeMakerEditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const img = location.state?.img;
  const imageRef = useRef(null);
  const draggingRef = useRef({ id: null, startX: 0, startY: 0 });
  const [scale, setScale] = useState(0.7);
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [addStack, setAddStack] = useState([]);
  const [texts, setTexts] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [draggingTextId, setDraggingTextId] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatTypeSelector, setShowChatTypeSelector] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showDirectionSelector, setShowDirectionSelector] = useState(false);
  const [blankDirection, setBlankDirection] = useState(null);
  const [paddingUp, setPaddingUp] = useState(0);
  const [paddingDown, setPaddingDown] = useState(0);
  const [paddingLeft, setPaddingLeft] = useState(0);
  const [paddingRight, setPaddingRight] = useState(0);
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
    const id = Date.now() + 'text';
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

  const updateTextBox = (id, key, value) => {
    setTexts(prev =>
      prev.map(tb =>
        tb.id === id ? { ...tb, [key]: value } : tb
      )
    );
  };


  const handleMouseDown = (e, tb) => {
    e.stopPropagation();
    draggingRef.current = {
      id: tb.id,
      startX: e.clientX,
      startY: e.clientY,
    };
  };


const handleMouseMove = (e) => {
  const { id, type, startX, startY } = draggingRef.current;
  if (!id) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  const wrapperRect = imageRef.current.getBoundingClientRect();

  const percentX = (dx / wrapperRect.width) * 100;
  const percentY = (dy / wrapperRect.height) * 100;

  if (type === 'chat') {
    setChats(prev =>
      prev.map(chat =>
        chat.id === id
          ? {
              ...chat,
              x: Math.min(Math.max(chat.x + percentX, 0), 100),
              y: Math.min(Math.max(chat.y + percentY, 0), 100),
            }
          : chat
      )
    );
  } else {
    setTexts(prev =>
      prev.map(tb =>
        tb.id === id
          ? {
              ...tb,
              x: Math.min(Math.max(tb.x + percentX, 0), 100),
              y: Math.min(Math.max(tb.y + percentY, 0), 100),
            }
          : tb
      )
    );
  }

  draggingRef.current.startX = e.clientX;
  draggingRef.current.startY = e.clientY;
};




  const handleMouseUp = () => {
    draggingRef.current.id = null;
  };


  const addChat = () => {
    setShowChatTypeSelector(true);
  };

  const updateChat = (id, key, value) => {
    setChats(prev =>
      prev.map(c => c.id === id ? { ...c, [key]: value } : c)
    );
  };

  const handleChatMouseDown = (e, chat) => {
  e.stopPropagation();
  draggingRef.current = {
    id: chat.id,
    type: 'chat',
    startX: e.clientX,
    startY: e.clientY,
  };
};



  const handleAddChat = (shape) => {
    const id = Date.now() + 'chat';
    const newChat = {
      id,
      shape,
      x: 50,
      y: 50,
      text: '텍스트를 입력하세요.',
      fontSize: 16,
      color: '#000000',
      flipped: false,
    };
    setChats(prev => [...prev, newChat]);
    setAddStack(prev => [...prev, { type: 'add-chat', data: newChat }]);
    setShowChatTypeSelector(false);
  };


  const Rotate = () => {
    setRotation(prev => prev + 90);
  };

  const addBlank = () => {
    setShowDirectionSelector(true);
  };

  const handleDirectionClick = async (direction) => {
    switch (direction) {
      case 'up':
        setPaddingUp(prev => prev + 100);
        break;
      case 'down':
        setPaddingDown(prev => prev + 100);
        break;
      case 'left':
        setPaddingLeft(prev => prev + 100);
        break;
      case 'right':
        setPaddingRight(prev => prev + 100);
        break;
      default:
        break;
    }
    setShowDirectionSelector(false);

  };

  useEffect(() => {
    getAllImages();
    const imgEl = imageRef.current;
    if (imgEl) imgEl.addEventListener('wheel', handleWheel);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    const handleClickOutside = (e) => {
      if (
        e.target.closest('.text-box') ||
        e.target.closest('.text-edit') ||
        e.target.closest('.direction-selector') ||
        e.target.closest('.add-blank') ||
        e.target.closest('.chat') ||
        e.target.closest('.chat-edit') ||
        e.target.closest('.chat-selector') ||
        e.target.closest('.add-chat')
      ) return;
      setSelectedText(null);
      setShowDirectionSelector(false);
      setSelectedChat(null);
      setShowChatTypeSelector(false);    
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      if (imgEl) imgEl.removeEventListener('wheel', handleWheel);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
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
              value={texts.find(tb => tb.id === selectedText)?.fontSize ?? ''}
              onChange={e => updateTextBox(selectedText, 'fontSize', parseInt(e.target.value))}
              onBlur={() => updateTextBox(selectedText, 'fontSize',
                isNaN(texts.find(tb => tb.id === selectedText)?.fontSize) ? 16
                  : texts.find(tb => tb.id === selectedText)?.fontSize
              )
              }
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
              짤을 편집하는 화면입니다!<br /><br />
              1. 텍스트 추가<br />
              텍스트 박스를 하나 생성합니다.<br />
              2. 말풍선 추가<br />
              텍스트를 입력 할 수 있는 말풍선을 생성합니다.<br />
              3. 회전<br />
              사진을 90°씩 회전시킵니다.<br />
              4. 여백 추가<br />
              상하좌우 방향으로 하얀색 여백을 추가합니다.<br /><br />
              * 이미지를 스크롤하면<br />
              확대/축소 할 수 있습니다.
            </div>
          </div>
        )}
      </div>
      {img ? (
        <div className="image-container">
          <div className="image-wrapper" ref={imageRef}>
            <img
              src={selectedImageUrl}
              alt="편집할 이미지"
              className="editable-image"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                paddingTop: `${paddingUp}px`,
                paddingBottom: `${paddingDown}px`,
                paddingLeft: `${paddingLeft}px`,
                paddingRight: `${paddingRight}px`,
                backgroundColor: 'white',
              }}
            />

            {texts.map(tb => (
              <div
                key={tb.id}
                className="text-box"
                style={{
                  position: 'absolute',
                  top: `${tb.y}%`,
                  left: `${tb.x}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: `${tb.fontSize}px`,
                  color: tb.color,
                  userSelect: 'none',
                }}
                onMouseDown={(e) => handleMouseDown(e, tb)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedText(tb.id);
                }}
              >
                <div
                  className="text-box-border"
                  style={{
                    border: tb.id === selectedText ? '1px dashed #aaa' : '1px solid transparent',
                    padding: '4px',
                    cursor: 'move',
                  }}
                >
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    style={{
                      outline: 'none',
                      cursor: 'text',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      minWidth: '20px',
                    }}
                    onInput={(e) => {
                      const newText = e.currentTarget.innerText;
                      updateTextBox(tb.id, 'text', newText);
                    }}
                    onBlur={(e) => {
                      updateTextBox(tb.id, 'text', e.currentTarget.innerText);
                    }}
                    ref={(el) => {
                      if (el && el.innerText !== tb.text) {
                        el.innerText = tb.text;
                      }
                    }}
                  />
                </div>
              </div>
            ))}
            {chats.map(chat => (
  
  <div
    key={chat.id}
    className="chat"
    style={{
      position: 'absolute',
      top: `${chat.y}%`,
      left: `${chat.x}%`,
      transform: `translate(-50%, -50%)`,
      userSelect: 'none',
      cursor: 'move',
      cursor: selectedChat === chat.id ? 'move' : 'default', // 일반 영역에서는 move
    }}
    onMouseDown={(e) => handleChatMouseDown(e, chat)}
    onClick={(e) => {
      e.stopPropagation();
      setSelectedChat(chat.id);
    }}
  >
    {/* 반전은 여기서만 적용 (텍스트는 제외) */}
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <img
        src={chat.shape === 'circle' ? imgchat : sqchat}
        alt="말풍선"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: -1,
          transform: `scaleX(${chat.flipped ? -1 : 1})`,
        }}
      />

      {/* 텍스트는 항상 정방향 유지 */}
      <div
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        style={{
          outline: 'none',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          width: chat.shape === 'square' ? '120px' : '200px',
          padding: chat.shape === 'square'
            ? chat.flipped === true ? '20px 80px 20px 20px' : '20px 20px 20px 80px'
            : '25px 10px 30px 10px',
          fontSize: `${chat.fontSize}px`,
          color: chat.color,
          textAlign: chat.shape === 'square' ? 'left' : 'center',
          transform: 'none',
          cursor: 'text',
        }}
        onInput={(e) => {
          const newText = e.currentTarget.innerText;
          updateChat(chat.id, 'text', newText);
        }}
        onBlur={(e) => updateChat(chat.id, 'text', e.currentTarget.innerText)}
        ref={(el) => {
          if (el && el.innerText !== chat.text) {
            el.innerText = chat.text;
          }
        }}
      />
    </div>
  </div>
))}


          </div>
        </div>
      ) : (
        <p>이미지가 없습니다.</p>
      )}

      {showChatTypeSelector && (
          <div className="chat-selector">
            <div onClick={() => handleAddChat('circle')}>
              <img src={imgchat} alt="원형 말풍선" />
            </div>
            <div onClick={() => handleAddChat('square')}>
              <img src={sqchat} alt="사각형 말풍선" />
            </div>
          </div>
        )}

        

        {selectedChat && (
          <div className="chat-edit">
            <label>크기 :
              <input
                type="number"
                value={chats.find(c => c.id === selectedChat)?.fontSize ?? ''}
                onChange={e => updateChat(selectedChat, 'fontSize', parseInt(e.target.value))}
              />
            </label>
            <label>색상 :
              <input
                type="color"
                value={chats.find(c => c.id === selectedChat)?.color ?? '#000000'}
                onChange={e => updateChat(selectedChat, 'color', e.target.value)}
              />
            </label>
            <button onClick={() => {
              const target = chats.find(c => c.id === selectedChat);
              updateChat(selectedChat, 'flipped', !target?.flipped);
            }}>좌우 반전</button>
          </div>
        )}


      <div className="btn-group">
        <button onClick={Tohome} className="cancel-btn">취소</button>
        <button className="confirm-btn">완성</button>
      </div>

      <div className="editor-navbar">
        <div className="add-text" onClick={addText}>
          <img src={addtext} alt="텍스트 추가" className="btn-text" /><br />
          텍스트 추가
        </div>
        <div className="add-chat" onClick={addChat}>
          <img src={addchat} alt="말풍선 추가" className="btn-chat" /><br />
          말풍선 추가
        </div>
        <div className="rotate" onClick={Rotate}>
          <img src={rotate} alt="회전 추가" className="btn-rotate" /><br />
          회전
        </div>
        <div className="add-blank" onClick={addBlank}>
          <img src={addblank} alt="여백 추가" className="btn-blank" /><br />
          여백 생성
        </div>

        {showDirectionSelector && (
          <div className="direction-selector">
            <div className='btn-up' onClick={() => handleDirectionClick('up')}>
              <button>
                <img src={up} alt="상" />
              </button><br />
              상
            </div>
            <div className='btn-down' onClick={() => handleDirectionClick('down')}>
              <button>
                <img src={down} alt="하" />
              </button><br />
              하
            </div>
            <div className='btn-left' onClick={() => handleDirectionClick('left')}>
              <button>
                <img src={left} alt="좌" />
              </button><br />
              좌
            </div>
            <div className='btn-down' onClick={() => handleDirectionClick('right')}>
              <button>
                <img src={right} alt="우" />
              </button><br />
              우
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemeMakerEditPage;