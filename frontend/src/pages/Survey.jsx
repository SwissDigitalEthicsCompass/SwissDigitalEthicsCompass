import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from '../constants';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Decode the token to get user data
        const token = localStorage.getItem(ACCESS_TOKEN); 
        const decoded = jwtDecode(token);
        const userId = decoded.user_id; 
    
        const totalPoints = surveyDetails.reduce((acc, question) => {
            const answer = answers[question.id];
            const choice = question.choices.find(c => c.id === answer);
            return acc + (choice ? choice.score : 0);
        }, 0);
    
        const userResponse = {
            user: userId,
            survey: surveyId,
            total_points: totalPoints,
        };
    
        try {
            const response = await api.post('/api/user-responses/create/', userResponse);
            navigate(`/evaluation/${response.data.id}`);
        } catch (error) {
            console.error('Failed to submit survey response:', error);
        }
    };

    const handleGoBack = () => {
        navigate(-1); // Navigates back to the last entry in the history stack
    };

    if (surveyDetails.length === 0) {
        return <div><Navbar /><p>Loading...</p></div>;
    }

    return (
        <>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <button onClick={handleGoBack} className="btn btn-secondary" style={{ marginBottom: '10px' }}>Go Back</button>
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
