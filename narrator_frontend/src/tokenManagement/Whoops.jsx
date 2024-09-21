import React from 'react';
import styled, { keyframes } from 'styled-components';
import { isMobile } from 'react-device-detect';

// Styled components and animations
const FullScreenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #000;
`;

const fadeIn = keyframes`
  0% { opacity: 0.8; }
  100% { opacity: 1; }
`;

const AnimatedLogo = styled.img`
  animation: 2s ${fadeIn} ease-out;
  margin-bottom:25px;
  margin-top:25px;
`;

const AnimatedText = styled.div`
  animation: 2s ${fadeIn} ease-in-out infinite alternate;
  max-width: isMobile ? 90vw : 200px;
  width: ${isMobile ? '90vw' : '600px'};
`;

// Main component
const FullscreenComponent = () => {
  return (
    <FullScreenWrapper>
      <AnimatedLogo src="/logo.png" alt="Logo" />
      <h1>Narrator is temporarily unavailable!</h1>
      <AnimatedText>
        <p>Sorry folks! We hit our quota limit with OpenAI for the month way sooner than expected! I'm working to get it increased again, but I'd bet it won't be fixed before Monday or Tuesday. You can <a href="https://discord.gg/gFGuHv6YBZ">join our Discord</a> for updates (or just check back here)!</p> <br></br> 
        <p>- David</p>
      </AnimatedText>
    </FullScreenWrapper>
  );
};

export default FullscreenComponent;
