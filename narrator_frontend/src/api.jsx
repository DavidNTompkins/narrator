import axios from 'axios'
import generatePrimaryPrompt from './smallScripts/PromptGenerator.js'


async function handleSubmit(event, setShowForm, setPrompts, setCharacters, setMessages, setImageData, setStatus,setHandler,formData, additionalCharacters, additionalCharactersOffset=2) {
  console.log("here")
  event.preventDefault();
  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';

  
  const data = new FormData(event.target);
  const setting = data.get("setting")
  const name1 = data.get("name1");
  const name2 = data.get("name2");
  const race1 = data.get("race1");
  const race2 = data.get("race2");
  const class1 = data.get("class1");
  const class2 = data.get("class2");
  const background1 = data.get("background1");
  const background2 = data.get("background2");
  const gametype = data.get("gametype");
  const storyhook = data.get("storyhook")
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
    ? `Begin the game by setting the scene in present tense then asking the player what they do. End your response with a summary of these tracked stats: ${generateFormattedString(formData.trackedFields)}`
    :'Begin the game by setting the scene in present tense, then ask the player what they do.' 
    :'Begin the game by setting the scene in present tense, then ask the player what they do.'; 

  const trackerString = formData.trackedFields 
  ? hasTrackedFieldData(formData.trackedFields)
    ? `As a reminder, please track, update, and include the following attributes at the end of your next response: ${generateFormattedString(formData.trackedFields)}.`
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
  
  // Optional handling of fields to allow for backwards compatibility
  const storyhookString = (storyhook=="") ? "" : `Story hook: ${storyhook}.`
  
  const promptMessages = [{
    promptOne: `${background1}`,// ${race1} ${class1}.`,
    promptTwo: `${background2}`//. ${race2} ${class2}.`
  }]
  setStatus('loading')
  if (additionalCharactersOffset==2){
const response = await fetch(`${api_url}endpoint1`,{
  method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ promptMessages }),
  })
  console.log(response)
  const result = await response.json()
  console.log(result)
  setImageData(result)  
  }
  const starterPrompt = generatePrimaryPrompt(formData,additionalCharacters,"",false,starterString);
    
    /*`Please act as a text-based ${gametype} role playing game simulator. Follow these rules:
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
Begin the game by setting the scene in present tense, then ask the player what they do.
` */
  setMessages([{ role: "system", content: starterPrompt }, 
               { role: "user", content: `game start, setting: ${setting}. ${storyhookString}` },
              ...(trackOrRemindString!="" ? [{ name: 'reminder', role: 'user', content: trackOrRemindString}] : []),])
  
  setShowForm(false); // triggers image display
  
};


const makeApiCall = async (formData) => {
  try {
    const response = await fetch(`${api_url}endpoint`, {
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
