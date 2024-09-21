export default function hallucinatorFilter(message, keyValueArray,priorMessage,guessedHallucinationStyles) {
  // Create a copy of the original message to avoid modifying it directly
   const filterWords = ["child", "kid", "toddler", "infant", "minor", "youngster", "juvenile", "adolescent", "teenager", "teen", "babe", "newborn", "offspring", "progeny", "youth", "schoolboy", "schoolgirl", "preteen", "little one", "baby", "nursling", "suckling", "neonate", "cherub", "whippersnapper", "tyke", "tot", "rugrat", "nipper", "moppet", "kiddo", "junior", "brat", "daughter", "step-daughter", "son", "step-son", "brother","sister","step-brother","step-sister",
]; // Extend this list as needed
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}\u{FE0F}]/gu;
  //console.log(guessedHallucinationStyles)
   let shallowImplicitStyles = guessedHallucinationStyles ? guessedHallucinationStyles.slice() : null;  
  // Remove emojis and trim whitespace
    let modifiedMessage = message + priorMessage;
    modifiedMessage = modifiedMessage.replace(emojiRegex, '').trim();
  let youValue = null;
  let replacementMade = false;

  
  // Iterate through the array of key-value pairs
if (keyValueArray) {
  keyValueArray.forEach(({ key, value }) => {
    // Split the key on comma and trim each part, then join with pipe '|' for regex
    const keys = key.trim().replace(/,\s*$/, '').split(',').map(k => k.trim());
    const regexPattern = keys.map(escapeRegExp).join('|');
    const regex = new RegExp(`\\b(${regexPattern})([.,!?]*)\\b`, 'gi');

    modifiedMessage = modifiedMessage.replace(regex, value);
  });
  // Check for 'you' key and remove it from keyValueArray if present
  if (keyValueArray) {
    const youIndex = keyValueArray.findIndex(({ key }) => key === 'you');
    if (youIndex !== -1) {
      youValue = keyValueArray[youIndex].value;
      keyValueArray.splice(youIndex, 1);
    }

    keyValueArray.forEach(({ key, value }) => {
      const keys = key.trim().replace(/,\s*$/, '').split(',').map(k => k.trim());
      const regexPattern = keys.map(escapeRegExp).join('|');
      const regex = new RegExp(`\\b(${regexPattern})([.,!?]*)\\b`, 'gi');
      const newMessage = modifiedMessage.replace(regex, `${value},`);
      if (newMessage !== modifiedMessage) {
        replacementMade = true;
      }
      modifiedMessage = newMessage;
    });

  }
}
  /*if (shallowImplicitStyles) {
      shallowImplicitStyles.forEach(({ key, value }) => {
    // Split the key on comma and trim each part, then join with pipe '|' for regex
    const keys = key.split(',').map(k => k.trim()).join('|');
    const regex = new RegExp(`\\b(${keys})\\b`, 'gi'); // Case-insensitive, match whole word
    modifiedMessage = modifiedMessage.replace(regex, value);
  }); */
    if (shallowImplicitStyles) {
        // Find an index of the first element whose key is 'you' or starts with 'you,'
        const youIndex = shallowImplicitStyles.findIndex(({ key }) => key === 'you' || key.startsWith('you,'));
        if (youIndex !== -1 && !youValue) {
            youValue = shallowImplicitStyles[youIndex].value;
            shallowImplicitStyles.splice(youIndex, 1);
        }
    
        //console.log(shallowImplicitStyles);
        shallowImplicitStyles.forEach(({ key, value }) => {
      const keys = key.split(',').map(k => k.trim()).join('|');
      const regex = new RegExp(`\\b(${keys})\\b`, 'gi');
      const newMessage = modifiedMessage.replace(regex, `${value},`);
      if (newMessage !== modifiedMessage) {
        replacementMade = true;
      }
      modifiedMessage = newMessage;
         // console.log(modifiedMessage);
    });


    filterWords.forEach(word => {
      const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
      modifiedMessage = modifiedMessage.replace(wordRegex, '');
      
    });
  }
  
  // If no replacements were made and 'you' key was present, replace 'you'
  if (!replacementMade && youValue) {
    const youRegex = new RegExp(`\\byou\\b`, 'gi');
    modifiedMessage = modifiedMessage.replace(youRegex, youValue);
  }
  const generalStyleValue = keyValueArray ? keyValueArray.find(item => item.key === 'general_style')?.value || '' : '';
  const guessedStyleValue = guessedHallucinationStyles? guessedHallucinationStyles.find(item => item.key === 'implied_style')?.value || '' : '';
  modifiedMessage += `. ${generalStyleValue}. ${guessedStyleValue}`;

return modifiedMessage;
}
