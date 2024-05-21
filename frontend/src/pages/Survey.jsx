import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

function Survey() {
    const { surveyId } = useParams();
    const [surveyDetails, setSurveyDetails] = useState([]);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSurveyDetails = async () => {
            try {
                const response = await api.get(`/api/survey/${surveyId}/questions/`);
                setSurveyDetails(response.data);
                // Initialize answers state
                const initialAnswers = {};
                response.data.forEach(question => {
                    initialAnswers[question.id] = '';
                });
                setAnswers(initialAnswers);
            } catch (error) {
                console.error('Failed to fetch survey details:', error);
            }
        };
        fetchSurveyDetails();
    }, [surveyId]);

    const handleAnswerChange = (questionId, choiceId) => {
        setAnswers(prev => ({ ...prev, [questionId]: choiceId }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/evaluation'); 
    };

    if (surveyDetails.length === 0) {
        return <div><Navbar /><p>Loading...</p></div>;
    }

    return (
        <>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <form onSubmit={handleSubmit}>
                    {surveyDetails.map(question => (
                        <div key={question.id}>
                            <h2>{question.text}</h2>
                            <div>
                                {question.choices.map(choice => (
                                    <div key={choice.id}>
                                        <input
                                            type="radio"
                                            id={`choice-${choice.id}`}
                                            name={`question-${question.id}`}
                                            value={choice.id}
                                            checked={answers[question.id] === choice.id}
                                            onChange={() => handleAnswerChange(question.id, choice.id)}
                                        />
                                        <label htmlFor={`choice-${choice.id}`} style={{ marginLeft: '10px' }}>{choice.text}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button type="submit" className="btn btn-primary" style={{ marginTop: "20px" }}>Submit Answers</button>
                </form>
            </div>
        </>
    );
}

export default Survey;