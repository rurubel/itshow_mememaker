// MemeMakerComplete.jsx

import { useLocation, useNavigate } from 'react-router-dom';
import './MemeMakerComplete.css';
import download from './assets/download.png';

function MemeMakerComplete() {
  const location = useLocation();
  const navigate = useNavigate();
  const imageUrl = location.state?.capturedImageUrl;

  const handleDownload = () => {
    if (!imageUrl) return;

    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meme.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      });
  };

  const handleSendGmail = () => {
    window.open('https://mail.google.com/mail/u/0/#inbox?compose=new', '_blank');
  };

  return (
    <div className="container">
      <h1 className="text-complete">완성!</h1>
      {imageUrl ? (
        <img src={imageUrl} alt="완성된 짤" className="completed-image" />
      ) : (
        <p>이미지가 없습니다.</p>
      )}

        <img src={download} alt='다운로드' onClick={handleDownload} className="btn-download"></img>


      <div className="button-group navigation">
        <button className="btn-main" onClick={() => navigate('/')}>메인 화면으로</button>
        <button className="btn-see" onClick={() => navigate('/see')}>다른 사람의 짤 보러가기</button>
      </div>
    </div>
  );
}

export default MemeMakerComplete;