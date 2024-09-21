import {encode} from 'gpt-3-encoder';
function countTokensPrimaryPrompt(formData,additionalCharacters,starterString ="Begin the game by setting the scene in present tense, then ask the player what they do."){

  const name1 = formData.name1;
  const race1 = formData.race1;
  const class1 = formData.class1;

  const name2 = formData.name2;
  const race2 = formData.race2;
  const class2 = formData.class2;
  const gametype = formData.gametype;

  const companionString = additionalCharacters.length==0 ? `the player has a companion` : `the player has these companions`
  
  let additionalCharacterString = "";

additionalCharacters.forEach(item => {
  additionalCharacterString += `${item.name} - ${item.role} - ${item.background} (DM Controlled)\n`;
});
  
  const starterPrompt = `Please act as a text-based ${gametype} role playing game simulator. Follow these rules:
1. Address the player as 'you' 
2. Stay in character. 
3. Be brief. Responses should be one paragraph at most.
4. Game mechanics are decided by you. No dice are rolled.
5. Battle takes multiple turns.
6. The player decides what their character would do. 
7. Use dialogue and emotion in accordance with the creative writing technique: show don't tell.
8. This is difficult game. The player should experience setbacks.
The player is:
${name1} - ${race1} - ${class1}
Additionally ${companionString}:
${name2} - ${race2} - ${class2} (DM Controlled)
${additionalCharacterString}
${starterString}
`

  return encode(starterPrompt).length;
}

export default countTokensPrimaryPrompt