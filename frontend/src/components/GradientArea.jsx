// src/components/GradientArea.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const GradientWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 500px;
  width: 50px;
  background: linear-gradient(to bottom, #00ff00, #ffffff); /* Reverse gradient colors */
  position: relative;
  margin-right: 20px; /* Add margin if needed to space it from other components */
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
  right: -20px; /* Adjust as needed */
  width: 0;
  height: 0;
  border-left: 10px solid #000; /* Color of the pointer */
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
`;

const GradientArea = () => {
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
            style={{ top: `${index * 25}%` }}
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
    </GradientWrapper>
  );
};

export default GradientArea;
