// FeedPage.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MemeFeed.css';

const FeedPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const img = state?.img;

  useEffect(() => {
    if (img?.capturedImageUrl) {
      saveToServer(img);
    }
  }, [img]);

  const saveToServer = async (img) => {
    try {
      const blob = await (await fetch(img.capturedImageUrl)).blob();
      const formData = new FormData();
      formData.append('image', blob, 'meme.png');
      formData.append('temId', img.temId);
      formData.append('categori', img.categori);

      const res = await axios.post('/feed', formData);
      console.log('업로드 완료:', res.data);
      alert('업로드 성공!');
      navigate('/meme/success', { state: res.data });
    } catch (err) {
      console.error('업로드 실패:', err);
      alert('업로드 실패');
    }
  };

  return (
    <div className="feed-container">
      <h2>미리보기</h2>
      {img?.capturedImageUrl && (
        <img src={img.capturedImageUrl} alt="캡처 미리보기" className="preview-img" />
      )}
    </div>
  );
};

export default FeedPage;
