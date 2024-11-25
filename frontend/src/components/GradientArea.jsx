import React, { useState } from 'react';
import styled from 'styled-components';

const GradientWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  width: 40px;
  background: linear-gradient(to top, #4CAF50, #8BC34A, #FFC107, #FF5722, #D32F2F);
  position: relative;
  margin-left: 20px;
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
  left: -20px;
  width: 0;
  height: 0;
  border-right: 10px solid #000;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
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

  const labels = ['Very High', 'High', 'Medium', 'Low', 'Very Low'];

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
              top: `${index * 22}%`
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
              style={{ top: `${index * 22}%`, transform: `translateY(-50%) rotate(180deg)` }}
            />
          )}
        </React.Fragment>
      ))}
      {tooltipContent && (
        <Tooltip style={{ top: `${hoverIndex * 22}%`, transform: 'translateY(-50%)', left: '50px' }}>
          {tooltipContent}
        </Tooltip>
      )}
      <Pointer
        style={{
          top: `${(1 - averageScore) * 100}%`,
          transform: `translateY(-50%) rotate(180deg)`
        }}
      />
    </GradientWrapper>
  );
};

export default GradientArea;