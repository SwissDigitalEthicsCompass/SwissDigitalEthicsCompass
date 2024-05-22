import React from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import RadarChart from '../components/RadarChart';
import RecommendationList from '../components/RecommendationList';
import AIChat from '../components/AIChat';

function Evaluation() {
    const { evaluationId } = useParams(); // Extract evaluationId from the URL

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div>
                            <RadarChart />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <div>
                                <RecommendationList /> {/* Display the recommendation list here */}
                            </div>
                        </div>
                        <div>
                            <div>
                                <AIChat />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Evaluation;
