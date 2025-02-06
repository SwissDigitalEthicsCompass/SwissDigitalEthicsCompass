import React, { useState } from 'react';
import styled from 'styled-components';

const GradientWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 30px; /* Adjusted height */
  width: 100%; /* Adjusted width */
  background: linear-gradient(to right, #4CAF50, #8BC34A, #FFC107, #FF5722, #D32F2F);
  position: relative;
  margin-left: 20px;
`;

const Label = styled.div`
  position: absolute;
  height: 100%;
  text-align: center;
  color: #000;
  font-weight: bold;
  opacity: ${(props) => (props.alwaysVisible || props.isHovered ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const Pointer = styled.div`
  position: absolute;
  top: -10px; /* Adjusted position */
  width: 0;
  height: 0;
  border-top: 10px solid #000;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
`;

const Tooltip = styled.div`
  position: absolute;
  background-color: white;
  color: black;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  z-index: 10;
  white-space: pre-wrap;
`;

const GradientArea = ({ averageScore }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('');

  const labels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];

  const riskDescriptions = {
    'Very Low': 'Very Low risk indicates very minimal ethical concerns and impacts. Suitable for most contexts without significant adjustments.',
    'Low': 'Low risk indicates minimal ethical concerns and impacts. Suitable for most contexts without significant adjustments.',
    'Medium': 'Medium risk suggests moderate ethical considerations are needed. May require periodic reviews and oversight.',
    'High': 'High risk indicates significant ethical concerns. Requires active management and mitigation strategies to address.',
    'Very High': 'Very high risk represents severe ethical concerns with potential major negative impacts. Urgent and comprehensive mitigation measures are necessary.'
  };

  const handleMouseEnter = (index) => {
    setHoverIndex(index);
    setTooltipContent(riskDescriptions[labels[index]]);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setTooltipContent('');
  };

  return (
    <GradientWrapper>
      {labels.map((label, index) => (
        <React.Fragment key={index}>
          <Label
            style={{
              left: `${index * 20}%`, /* Adjusted position for horizontal alignment */
            }}
            alwaysVisible={label === 'Very Low' || label === 'Very High'}
            isHovered={hoverIndex === index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {label}
          </Label>
          {hoverIndex === index && (
            <Pointer
              style={{
                left: `${index * 20}%`,
                transform: `translateX(-50%) rotate(0deg)`, /* Adjusted for horizontal pointer */
              }}
            />
          )}
        </React.Fragment>
      ))}
      {tooltipContent && (
        <Tooltip style={{ left: `${hoverIndex * 20}%`, transform: 'translateX(-50%)', top: '30px' }}>
          {tooltipContent}
        </Tooltip>
      )}
      <Pointer
        style={{
          left: `${averageScore * 100}%`, /* Adjusted position for horizontal pointer */
          transform: `translateX(-50%) rotate(0deg)`,
        }}
      />
    </GradientWrapper>
  );
};

export default GradientArea;