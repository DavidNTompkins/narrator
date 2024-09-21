import React, { useState } from 'react';
import styled from 'styled-components';
import parse from 'html-react-parser';
import logoImage from '../img/logo.png'

/*
--form: #004040;
  --formOutline: #007a7a;
  --ButtonShadow: #3d0000;
  --Button: #7a0000;
  --easeTime: 0.3s;
  */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin:0;
  align-items:center;
  text-align:center;
  
`;

const CategoryTitle = styled.h2`
  font-size: 2rem;
  margin: 1.5rem 0;
`;

const QuestionContainer = styled.div`
  width: 600px;
  margin-bottom: 1rem;
  cursor: pointer;
  background-color:#999;
  box-shadow: 0 4px 8px 0 #007a7a, 0 6px 20px 0 #007a7a;
  border-radius:10px;
  padding:4px;
  color: #004040;
`;

const Question = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Answer = styled.p`
  white-space: pre-wrap;
  font-size: 1.25rem;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const faqData = [
  {
    category: 'Getting Started',
    faqs: [
      {
        question: 'What is this? How do I play',
        answer: `This is Narrator. It used to be a website called playnarrator.com. It was pretty fun for a while! Eventually costs and taxes got pretty nasty, so I shut it down, but have open-sourced it here so people can keep playing if they really want to. \n \n You'll need to follow the installation guide on the github link to set up your API keys. This is now open source and freely available, but it still will cost you money - just straight to the model providers.`,
      },
      
    ],
  },
  // Add more categories, questions, and answers here
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(-1);
  document.body.style.backgroundColor = "#242631"
  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <Container>
      <a href="https://discord.gg/KhRHNerQjj" target="_blank" rel="noopener noreferrer"><button className="blue-button">Join Discord</button></a>
      <a href ="/">
       <img className="logo" src ={logoImage}></img>
        </a>
      <Title>FAQ</Title>
      {faqData.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <CategoryTitle>{category.category}</CategoryTitle>
          {category.faqs.map((faq, index) => {
            const uniqueIndex = categoryIndex * 1000 + index;
            return (
              <QuestionContainer key={uniqueIndex} onClick={() => handleClick(uniqueIndex)}>
                <Question>{faq.question}</Question>
                <Answer isOpen={openIndex === uniqueIndex}>{parse(faq.answer)}</Answer>
              </QuestionContainer>
            );
          })}
        </div>
      ))}
    </Container>
  );
};

export default FAQPage;
