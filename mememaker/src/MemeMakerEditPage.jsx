import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function MemeMakerEditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const img = location.state?.img;

  const goBackHome = () => {
    navigate('/');
  };

  return (
    <div style={{
      padding: '100px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {img ? (
        <img src={img.imgURL} alt="편집할 이미지" style={{ maxWidth: '80%' }} />
      ) : (
        <p>이미지가 없습니다.</p>
      )}
      <button
        onClick={goBackHome}
        style={{
          marginTop: '40px',
          padding: '12px 24px',
          backgroundColor: '#5B3A29',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        메인으로 돌아가기
      </button>
    </div>
  );
}

export default MemeMakerEditPage;

