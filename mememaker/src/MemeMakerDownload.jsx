import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './MemeMakerDownload.css';

function MemeMakerDownload() {
  const location = useLocation();
  const navigate = useNavigate();
  const imageUrl = location.state?.capturedImageUrl;
  const [imageBase64, setImageBase64] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (imageUrl) {
      setImageBase64(imageUrl);
    }
  }, [imageUrl]);

  const handleSendEmail = async () => {
    if (!email || !imageUrl) return;

    setSending(true);
    setStatus('');

    try {
      const response = await fetch('http://localhost:5000/meme/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: '짤메이커 - 당신의 짤이 도착했습니다!',
          image: imageBase64,
        }),
      });

      if (response.ok) {
        setStatus('이메일이 성공적으로 전송되었습니다.');
      } else {
        setStatus('이메일 전송에 실패했습니다.');
      }
    } catch (error) {
      console.log(error);
      setStatus('오류가 발생했습니다.');
    }

    setSending(false);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleUploadToFeed = () => {
    navigate('/meme/feed', { state: { imageBase64 } });
  };

  return (
    <div className="download-container">
      <h1 className="text-email">짤을 내 이메일로 받기</h1>

      {imageUrl ? (
        <img src={imageUrl} alt="내가 만든 짤" className="preview-image" />
      ) : (
        <p>이미지를 불러올 수 없습니다.</p>
      )}

      <input
        type="email"
        placeholder="Gmail 주소를 입력하세요"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="email-input"
        disabled={status === '이메일이 성공적으로 전송되었습니다.'}
      />

      {status === '이메일이 성공적으로 전송되었습니다.' ? (
        <>
          <button className="btn-main" onClick={handleGoHome}>
            메인 화면으로
          </button>
          <button className="btn-feed" onClick={handleUploadToFeed}>
            다른 사람의 짤에 올리기
          </button>
        </>
      ) : (
        <button className="confirm-btn" onClick={handleSendEmail} disabled={sending}>
          {sending ? '전송 중...' : '메일 확인'}
        </button>
      )}

      {status && <p className="status-message">{status}</p>}
    </div>
  );
}

export default MemeMakerDownload;
