import {rulesets} from '../presets/rules.js'
function generatePrimaryPrompt(formData,additionalCharacters,bakedCharacters,baked,starterString ="Begin the game by setting the scene in present tense, then ask the player what they do."){

  const name1 = formData.name1;
  const race1 = formData.race1;
  const class1 = formData.class1;

  const name2 = formData.name2;
  const race2 = formData.race2;
  const class2 = formData.class2;
  const gametype = formData.gametype;
  

  const companionString = ((additionalCharacters.filter(item => item.type === 'character').length==0 && !name2) ) 
    ? ''
    : ((name2 && additionalCharacters.length==0) || (!name2 && additionalCharacters.filter(item => item.type === 'character').length==1))
    ? 'the player has a companion'
    : 'the player has these companions' 
  const ruleString = formData.rules ? formData.rules : ""

  const player2String = (name2 || race2 || class2 ) ? `${name2} - ${race2} - ${class2} (DM Controlled)` : ""
  let additionalCharacterString = "";
  let worldString = "";
additionalCharacters.forEach(item => {
    if(!(item.inactive==true)){
      if(item.type){
        if(item.type=="character"){
  additionalCharacterString += `${item.name} - ${item.role} - ${item.background} (DM Controlled)\n`
        }}else{
          additionalCharacterString += `${item.name} - ${item.role} - ${item.background} (DM Controlled)\n`
    }}
});

  //adding world info
  additionalCharacters.forEach(item => {
    if(!(item.inactive==true)){
      if(item.type){
        if(item.type=="world"){
  worldString += `${item.name} - ${item.role} \n`  
    }}}
});
  
  const worldIntroString = worldString ? "Here is some more relevant information about key places or items in the world or setting:" : ''

  const starterPrompt = (!baked | bakedCharacters=="") ? 
    `You are a ${gametype} role playing game simulator. Follow these rules:
${ruleString}
The player is:
${name1} - ${race1} - ${class1}
Additionally ${companionString}:
${player2String}
${additionalCharacterString}
${worldIntroString}
${worldString}
${starterString}
` 
    : 
    `You are a ${gametype} role playing game simulator. The player is ${name1}.
Follow these rules.:
${ruleString}
Information about the characters and world: ${bakedCharacters}
${starterString}`

  return starterPrompt
}

export default generatePrimaryPrompt