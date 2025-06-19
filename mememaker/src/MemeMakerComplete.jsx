import { useLocation, useNavigate } from 'react-router-dom';
import './MemeMakerComplete.css';
import download from './assets/download.png';

function MemeMakerComplete() {
  const location = useLocation();
  const navigate = useNavigate();
  const { img } = location.state || {};
  const {
  capturedImageUrl,
  temId,
  imgURL,
  categori,
} = img || {};
  const imageUrl = location.state?.capturedImageUrl;

  const handleDownloadClick = () => {
    console.log(imageUrl);
    if (!imageUrl) return;
    navigate('/download', {
      state: {img }},
    );
  };

  const handleSaveClick = () => {
    if (!imageUrl) return;
    navigate('/feed', {
      state: {img }},
    );
  };

  return (
    <div className="container">
      <h1 className="text-complete">완성!</h1>
      {imageUrl ? (
        <img src={imageUrl} alt="완성된 짤" className="completed-image" />
      ) : (
        <p>이미지가 없습니다.</p>
      )}

      <img
        src={download}
        alt="다운로드"
        onClick={handleDownloadClick}
        className="btn-download"
      />

      <div className="button-group navigation">
        <button className="btn-home" onClick={() => navigate('/')}>
          메인 화면으로
        </button>
        <button className="btn-save" onClick={handleSaveClick}>
          이 짤 업로드하기
        </button>
      </div>
    </div>
  );
}

export default MemeMakerComplete;
