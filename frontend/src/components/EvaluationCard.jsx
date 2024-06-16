import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

const EvaluationCard = ({ evaluation, onDelete }) => {
    const navigate = useNavigate();  // Hook for navigation

    // Function to navigate to evaluation details
    const handleViewDetails = () => {
        navigate(`/evaluation/${evaluation.id}`);
    };

    console.log(`Evaluation card ${evaluation.id}: {id: ${evaluation.id}, user: ${evaluation.user}, survey: ${evaluation.survey}, total_points: ${evaluation.total_points}, created_at: ${evaluation.created_at}}`);

    return (
        <div className="card m-2" style={{ width: '18rem' }}>
            <div className="card-header text-center">
                <h3>{`Evaluation of ${formatDate(evaluation.created_at)}`}</h3>
            </div>
            <div className="card-body">
                <p className="card-text">{`Survey: ${evaluation.survey}`}</p>
                <p className="card-text">{`Total Points: ${evaluation.total_points.toFixed(2)}`}</p>
                <p className="card-text">{`Date: ${formatDate(evaluation.created_at)}`}</p>
                <button className="btn btn-primary mb-2" onClick={handleViewDetails}>View Details</button>
                <button className="btn btn-danger" onClick={() => onDelete(evaluation.id)}>Delete Evaluation</button>
            </div>
        </div>
    );
};

function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

export default EvaluationCard;
