async function sayAWord(word) {
  const message = new SpeechSynthesisUtterance(word);
  message.volume = 0.1; 
  window.speechSynthesis.speak(message);
}

export default sayAWord;