import React, { createContext, useState, useEffect, useContext } from 'react';

const HallucinationContext = createContext();

export const HallucinationProvider = ({ children }) => {
  const [images, setImages] = useState([]);

  // Check local storage for initial value or use default
  const [hallucinationOn, setHallucinationOn] = useState(
    () => JSON.parse(localStorage.getItem('hallucinationOn')) ?? true
  );

  const addImage = (image) => {
    setImages((prevImages) => [...prevImages, image]);
  };

  // Function to update hallucinationOn without affecting local storage
  const setHallucinationOnStateOnly = (newValue) => {
    setHallucinationOn(newValue);
  };

  // Update local storage whenever hallucinationOn changes
  useEffect(() => {
    localStorage.setItem('hallucinationOn', JSON.stringify(hallucinationOn));
  }, [hallucinationOn]);

  return (
    <HallucinationContext.Provider value={{ images, addImage, hallucinationOn, setHallucinationOn, setHallucinationOnStateOnly }}>
      {children}
    </HallucinationContext.Provider>
  );
};

export const useHallucination = () => useContext(HallucinationContext);
