// this is the summarizing feature that allows for infinite regress and saving. 
import saveOrUpdateAdventure from './adventure'
import fetchWithRetry from './smallScripts/FetchWithRetry.js'
async function hyperion(messages,setHyperionFlag,user,save,formData,adventureID,imageData,setImageData,additionalCharacters,textlog,hyperionNeeded, setHyperionNeeded,hyperionSummary,editableTextlog,bakedCharacters,isPublished=false, adventureName="",download=false) {
const userID = user ? user.uid : "NotLoggedIn"; 
  const filteredMessages = messages.filter(message => message.name !== 'reminder')
  const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';

  let result = {};
  if(hyperionNeeded | hyperionSummary == ""){
const response = await fetchWithRetry(`${api_url}hyperion`,{
  method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
      messages:filteredMessages, 
      userID }), // this says to use the baker model if specified, the gameplay model if not specified, and 'GPT 4o-Mini' if no gameplay model specified.
  })
    /*model:formData.baker_model 
        ? (formData.baker_model=='Default') 
          ? formData.model 
            ? formData.model
            : 'GPT 4o-Mini'
          : formData.baker_model
        : 'GPT 4o-Mini' */
  console.log(response)
  console.log("sent to hyperion: ",messages);
  result = await response.json()
  console.log(`${result.message}`)
  console.log(`Hyperion msg count: ${messages.length}`)
    
  } else {
    result.message=await hyperionSummary;
    console.log(result.message)
  }
  if(download){ 
    const lastMessages = getLastTimeMessages(messages, editableTextlog);
    await saveOrUpdateAdventure(user,adventureName,result.message,formData,adventureID,imageData,setImageData,additionalCharacters,textlog,lastMessages,bakedCharacters,isPublished);
  }
  
  
  return(result.message);
}
function getLastTimeMessages(messages,editableTextlog) {
  const numOfMessages = messages.length;

  if (numOfMessages > 3) {
    const temp_messages = messages.slice(2 + Math.max(0, (numOfMessages-14)), numOfMessages);
    const lt_messages = editableTextlog=="" ? temp_messages : [...temp_messages, {role:"assistant", content:editableTextlog}];
    return lt_messages;
  } else if (numOfMessages === 3) {
    return messages.slice(numOfMessages - 1, numOfMessages); //this used to be needed. Leaving in for future reversion
  } else {
    return [];
  }
}


export default hyperion