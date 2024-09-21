import axios from 'axios'
import generatePrimaryPrompt from '../smallScripts/PromptGenerator.js'
import {encode} from '@nem035/gpt-3-encoder';


async function handleSubmit(event, setShowForm, setPrompts, setCharacters, setMessages, imageData, setImageData, setStatus,setHandler,formData,adventureSummary,additionalCharacters,lasttimeMessages,isPublic,bakedCharacters, useBaked,AISpokeLast=false) {
  console.log("here")
  event.preventDefault();
  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';

  
   
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
  const storyhookString = (formData.storyhook=="") ? "" : `Story hook: ${formData.storyhook}.`
  //const bio1 = name1 + " - " + race1 //+ " - " + class1
  //const bio2 = name2 + " - " + race2 //+ " - " + class2
  setCharacters([name1, name2]);

   // Used to check if there are tracked fields
  const hasTrackedFieldData = (fields) => {
    return fields.some(pair => pair.key.trim() !== '' || pair.value.trim() !== '');
  }
    const generateFormattedString = (fields) => {
      return fields.map(pair => `| ${pair.key}: ${pair.value}`).join('|');
  }
  
  const starterString = formData.trackedFields 
    ? hasTrackedFieldData(formData.trackedFields) 
    ? `Begin the game by setting the scene in present tense, ask the player what they do, then provide these tracked stats: ${generateFormattedString(formData.trackedFields)}`
    :'Begin the game by setting the scene in present tense, then ask the player what they do.' 
    :'Begin the game by setting the scene in present tense, then ask the player what they do.'; 

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
  
  const promptMessages = [{
    promptOne: `${background1}`,// ${race1} ${class1}.`,
    promptTwo: `${background2}`//. ${race2} ${class2}.`
  }]
  setStatus('loading')
  if(imageData[0] == null){
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
  // this is missing baked and baked characters! 
  var starterPrompt = generatePrimaryPrompt(formData,additionalCharacters,bakedCharacters, useBaked,starterString)
  

    if(isPublic){
      setMessages([{ role: "system", content: starterPrompt },
                   ...(trackOrRemindString!="" ? [{ name: 'reminder', role: 'user', content: trackOrRemindString}] : []),
                   { role: "user", content: `game start, setting: ${setting}. ${storyhookString}` }])
    } else{
  
   if(lasttimeMessages.length==0){
  setMessages([{ role: "system", content: starterPrompt }, { role: "user", content: `Resume Game. I have forgotten what has happened. Welcome me back, then recap the adventure so far and then ask what I would like to do next. Here is the summary: ${adventureSummary}` }])
   } else { // in the now default case that there is carried over messages.
  let totalString = lasttimeMessages
  .map(message => message.content)
  .slice(1) // Exclude the first element
  .join(' ');
     if (encode(`${totalString} ${starterPrompt}`).length>3000 && bakedCharacters) {
       starterPrompt = generatePrimaryPrompt(formData,additionalCharacters,bakedCharacters, true,'Ask the player what they would like to do.')
     }
     
     setMessages([{ role: "system", content: starterPrompt }, { role: "system", content: `Game resume. Summary of game so far: ${adventureSummary}` }, ...lasttimeMessages])
     if (AISpokeLast){
       setStatus("reading");
        console.log("AI spoke last")}
   }
    }
  
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
