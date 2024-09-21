import axios from 'axios'
import generatePrimaryPrompt from '../smallScripts/PromptGenerator.js'


async function handleSubmit(event, setShowForm, setCharacters, setMessages, setStatus,setHandler,formData,additionalCharacters) {
  console.log("here")
  event.preventDefault();
  setStatus('loading');
  // could be cleaned up here!
  const setting = formData.setting;
  const name1 = formData.name1;
  const name2 = formData.name2;
  const race1 = formData.race1;
  const race2 = formData.race2;
  const class1 = formData.class1;
  const class2 = formData.class2;
  const background1 = formData.background1;
  const background2 = formData.background2;
  const gametype = formData.gametype;
  //const bio1 = name1 + " - " + race1 //+ " - " + class1
  //const bio2 = name2 + " - " + race2 //+ " - " + class2
  setCharacters([name1, name2]);

  // Used to check if there are tracked fields
  const hasTrackedFieldData = (fields) => {
    return fields.some(pair => pair.key.trim() !== '' || pair.value.trim() !== '');
  }
    const generateFormattedString = (fields) => {
      return fields.map(pair => `\n | ${pair.key}: ${pair.value}`).join('| ');
  }
  
  const starterString = formData.trackedFields 
    ? hasTrackedFieldData(formData.trackedFields) 
    ? `Begin the game by informing the user of: who and where they are; what goals or objectives the player has; and the player character’s relation(s) to other characters. Next, set the scene in present tense. End your response by asking the player what they do next followed by a summary of these tracked stats: ${generateFormattedString(formData.trackedFields)}`
    :'Begin the game by informing the user of: who and where they are; what goals or objectives the player has; and the player character’s relation(s) to other characters. Next, set the scene in present tense. End your response by asking the player what they do next.' 
    :'Begin the game by informing the user of: who and where they are; what goals or objectives the player has; and the player character’s relation(s) to other characters. Next, set the scene in present tense. End your response by asking the player what they do next.'; 

  const trackerString = formData.trackedFields 
  ? hasTrackedFieldData(formData.trackedFields)
    ? `As a reminder, please track, update, and include the following attributes at the end of your next response: ${generateFormattedString(formData.trackedFields)}`
    : ''
    : ''

  const reminderString = formData.reminderText 
  ? formData.reminderText 
    ? `Additionally, ${formData.reminderText}`
    : ''
    : ''

  const trackOrRemindString = trackerString
  ? reminderString
    ? `${trackerString} \n ${reminderString}`
    : `${trackerString}`
    : reminderString
    ? `${reminderString}`
    : ''

  const storyhookString = (formData.storyhook=="") ? "" : `Story hook: ${formData.storyhook}.`

  // does not have baked here but should not need it.
  const starterPrompt = generatePrimaryPrompt(formData,additionalCharacters,"",false,starterString);/*`Please act as a text-based ${gametype} role playing game simulator. Follow these rules:
1. Address the player as 'you' 
2. Stay in character. 
3. Be brief. Responses should be one paragraph at most.
4. Game mechanics are decided by you. No dice are rolled.
5. Battle takes multiple turns.
6. The player decides what their character would do.
7. Use dialogue and emotion in accordance with the creative writing technique: show don't tell.
The player is:
${name1} - ${race1} - ${class1}
Additionally the player has a companion:
${name2} - ${race2} - ${class2} (DM Controlled)
Begin the game by briefly introducing the characters, then setting the scene in present tense, then asking the player what they do.
`*/
  setMessages([{ role: "system", content: starterPrompt }, ...(trackOrRemindString!="" ? [{ name: 'reminder', role: 'user', content: trackOrRemindString}] : []), { role: "user", content: `game start, setting: ${setting}. ${storyhookString}` }])
  
  setShowForm(false); // triggers image display
  
};


const makeApiCall = async (formData) => {
  try {
    const response = await fetch("https://api.example.com/endpoint", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    // Process the response data here
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export default handleSubmit;
