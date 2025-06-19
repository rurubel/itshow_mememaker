import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MemeMakerSee.css';
import logo from './assets/logo.png';

const hashtags = ["#귀여운", "#재밌는", "#템플릿", "#내사진"];

const MemeMakerSee = () => {
    const navigate = useNavigate();
    const [selectedMeme, setSelectedMeme] = useState(null);
    const [checked, setChecked] = useState(
        hashtags.reduce((acc, tag) => ({ ...acc, [tag]: true }), {})
    );

    const ToMakePage = () => {
        navigate('/');
    };

    return (
        <div className="MemeMakerSee">
            <nav className="navbar">
                <img src={logo} alt="로고" className="logo" onClick={ToMakePage} />
                <div className="see-links">
                    <span
                        className="see-link"
                        onClick={ToMakePage}>
                        만들기
                    </span>
                    /
                    <span className="see-link active">
                        다른 사람의 짤
                    </span>
                </div>

            </nav>
            <div className="text-see">
                <h1>
                    다른 사람이 만든 짤이에요<br />
                    클릭해서 자세히 볼 수 있어요
                </h1>

                <div className="hashtag-container">
                    {hashtags.map((tag) => (
                        <label
                            key={tag}
                            className={`hashtag-item ${checked[tag] ? "checked" : ""}`}
                        >
                            <input
                                type="checkbox"
                                defaultChecked
                            />
                            <span>{tag}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MemeMakerSee;
