import Navbar from '../components/Navbar'
import SurveyCard from '../components/SurveyCard'
import React, {useEffect, useState} from 'react'
import api from '../api'

function Home() {
    const [surveys, setSurveys] = useState([])

    useEffect(() => {
        fetchSurveys();
    }, [])


    const fetchSurveys = async () => {
        try {
            const res = await api.get("api/surveys/")
            setSurveys(res.data)
        } catch (error) {
            alert("Failed to fetch surveys:", error)
        }
    }

    return (
        <>
            <Navbar />
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <h1>SWISS DIGITAL ETHICS COMPASS - Services</h1>
                <p>This section allows you to respond to services and will redirect you to an evaluation of the digital service provided.</p>
            </div>
            <section style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {surveys.map(survey => (
                    <SurveyCard key={survey.id} survey={survey} />
                ))}
            </section>
        </>
    );
}

export default Home