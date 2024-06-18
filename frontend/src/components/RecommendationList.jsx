import React, { useState, useEffect } from 'react';

const suggestions = [
  "Implement comprehensive data protection policies.",
  "Ensure transparency of algorithms and data processing.",
  "Conduct regular ethical audits of your systems.",
  "Enhance user consent processes with clearer explanations.",
  "Provide users with easy access to their own data.",
  "Introduce robust mechanisms for user feedback and complaints.",
  "Promote digital literacy among users to foster informed decision-making.",
  "Incorporate privacy by design into your service development.",
  "Regularly update security measures to guard against emerging threats.",
  "Facilitate user control over personal data usage.",
  "Support open source frameworks to ensure accountability.",
  "Adopt ethical AI guidelines and adhere to them strictly.",
  "Provide clear user guidelines on data ethics and protection.",
  "Develop and enforce strict penalties for ethical breaches.",
  "Foster a company culture that prioritizes ethical considerations in all operations."
];

const RecommendationList = () => {
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);

  useEffect(() => {
    // Randomly select 5 unique suggestions to display
    const shuffled = suggestions.sort(() => 0.5 - Math.random());
    setSelectedRecommendations(shuffled.slice(0, 5));
  }, []);

  return (
    <div style={{ backgroundColor: '#f7f7f7', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h4>Recommendations for Enhancing Digital Ethics</h4>
      <ul>
        {selectedRecommendations.map((recommendation, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            {recommendation}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationList;
