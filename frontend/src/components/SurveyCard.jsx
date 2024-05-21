import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SurveyCard.css'; 

function SurveyCard({ survey }) {
    console.log(survey)
    const navigate = useNavigate();
    const imageSrc = `${import.meta.env.VITE_API_URL}${survey.image}` || '';  

    const handleNavigate = () => {
        navigate(`/survey/${survey.id}`);
    };

    return (
        <div className="card">
            <img src={imageSrc} alt={survey.name} className="image" />
            <div className="content">
                <h3>{survey.name}</h3>
                <p className="topic">{survey.topic}</p>
                <button onClick={handleNavigate} className="button">Take Survey</button>
            </div>
        </div>
    );
}

export default SurveyCard;
