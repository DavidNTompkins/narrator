module.exports = function formatMessagesMistral(messages) {

  let formattedString = '';

    // Iterate through the messages array but skip the last element
    for (let i = 0; i < messages.length - 1; i++) {
      const message = messages[i];
      const role = message.role;
      if (role === 'user') {
        formattedString += `<|im_start|> user ${message.content} <|im_end|> `;
      } else if (role === 'assistant') {
        formattedString += `<|im_start|> assistant ${message.content} <|im_end|> `;
      } else if (role === 'system') {
        formattedString += `<|im_start|> system ${message.content} <|im_end|> `;
      }
    }

    // Append the 'tk_start user {prompt} tk_end tk_start assistant' at the end
    formattedString += `<|im_start|> user {prompt} <|im_end|> <|im_start|> assistant: \n\n`;

    return formattedString; // No need to trim because we want it to end this way
  }


  

/*
// Usage
const messages = [
  { role: 'system', content: 'Please act as a text-based Virtual simulation role…present tense, then ask the player what they do.\n' },
  { role: 'user', content: 'game start, setting: The Doors to the Holodeck. As… player what simulation they would like to play..'}
];

const result = formatMessages(messages);
console.log('First system message:', result.firstSystemMessage);
console.log('Formatted messages:', result.formattedMessages);
*/
