// src/components/GradientArea.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const GradientWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  width: 40px;
  background: linear-gradient(to top, #ffffff, #00ff00); /* Correct gradient colors */
  position: relative;
  margin-left: 20px; /* Add margin if needed to space it from other components */
`;

const Label = styled.div`
  position: absolute;
  width: 100%;
  text-align: center;
  color: #000;
  font-weight: bold;
  opacity: ${(props) => (props.alwaysVisible || props.isHovered ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const Pointer = styled.div`
  position: absolute;
  left: -20px; /* Adjust as needed */
  width: 0;
  height: 0;
  border-right: 10px solid #000; /* Color of the pointer */
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
`;

const GradientArea = ({ averageScore }) => {
  const labels = ['Very High', 'High', 'Medium', 'Low', 'Very Low']; // Reversed order
  const [hoverIndex, setHoverIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <GradientWrapper>
      {labels.map((label, index) => (
        <React.Fragment key={index}>
          <Label
            style={{
              top: label === 'Very Low' ? `${index * 25 - 2}%` : `${index * 25}%`,
            }} /* Adjust "Very Low" label slightly upwards */
            alwaysVisible={label === 'Very Low' || label === 'Very High'}
            isHovered={hoverIndex === index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {label}
          </Label>
          {hoverIndex === index && (
            <Pointer style={{ top: `${index * 25}%`, transform: `translateY(-50%)` }} />
          )}
        </React.Fragment>
      ))}
      <Pointer style={{ top: `${(1 - averageScore) * 100}%`, transform: `translateY(-50%)` }} />
    </GradientWrapper>
  );
};

export default GradientArea;
