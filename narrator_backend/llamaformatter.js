module.exports = function formatMessages(messages) {
  let firstSystemMessage = '';
  let formattedMessages = '';
  
  let foundFirstSystemMessage = false;
  
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    
    if (message.role === 'system' && !foundFirstSystemMessage) {
      firstSystemMessage = message.content;
      foundFirstSystemMessage = true;
    } else {
      if (message.role === 'user') {
        formattedMessages += `[INST] ${message.content} [/INST]\n`;
      } else {
        formattedMessages += `${message.content}\n`;
      }
    }
  }
  
  return {
    firstSystemMessage,
    formattedMessages,
  };
}
