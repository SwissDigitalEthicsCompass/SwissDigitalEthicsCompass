import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SurveyCard from '../components/SurveyCard';
import EvaluationCard from '../components/EvaluationCard';
import api from '../api';

function Home() {
    const [surveys, setSurveys] = useState([]);
    const [userResponses, setUserResponses] = useState([]);

    useEffect(() => {
        fetchSurveys();
        fetchUserResponses();
    }, []);

    const fetchSurveys = async () => {
        try {
            const response = await api.get("api/surveys/");
            setSurveys(response.data);
        } catch (error) {
            console.error("Failed to fetch surveys:", error);
            alert("Failed to fetch surveys: " + error.message);
        }
    };

    const fetchUserResponses = async () => {
        try {
            const response = await api.get("api/user-responses/");
            setUserResponses(response.data);
        } catch (error) {
            console.error("Failed to fetch user responses:", error);
            alert("Failed to fetch user responses: " + error.message);
        }
    };

    const deleteUserResponse = async (id) => {
        try {
            await api.delete(`api/user-responses/${id}/delete/`);
            setUserResponses(userResponses.filter(response => response.id !== id));
        } catch (error) {
            console.error("Failed to delete user response:", error);
            alert("Failed to delete user response: " + error.message);
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <h1>SWISS DIGITAL ETHICS COMPASS - Services</h1>
                <p>This section allows you to respond to services and will redirect you to an evaluation of the digital service provided.</p>
            </div>
            <section style={sectionStyle}>
                <h2 style={titleStyle}>Available Surveys</h2>
                <div style={cardContainerStyle}>
                    {surveys.map(survey => (
                        <SurveyCard key={survey.id} survey={survey} />
                    ))}
                </div>
            </section>
            <section style={sectionStyle}>
                <h2 style={titleStyle}>Existing Evaluations</h2>
                <div style={cardContainerStyle}>
                    {userResponses.map(response => (
                        <EvaluationCard key={response.id} evaluation={response} onDelete={deleteUserResponse} />
                    ))}
                </div>
            </section>
        </>
    );
}

const sectionStyle = {
    textAlign: 'center', // Ensures that the title is centered
    marginBottom: '20px'
};

const titleStyle = {
    margin: '0 0 10px 0' // Adds space below the title
};

const cardContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center', // Ensures cards are centered and wrapped
    gap: '10px' // Adds a gap between cards for better spacing
};

export default Home;
