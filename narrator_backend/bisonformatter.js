function formatMessagesBison(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { firstMessageContent: '', modifiedMessages: [] };
  }

  let firstMessageContent = messages[0].content;
  const reminders = messages.filter(message => message.name === 'reminder');
  
  reminders.forEach(reminder => {
    firstMessageContent += `\n${reminder.content}`;
  });

  const modifiedMessages = messages.slice(1).filter(message => message.name !== 'reminder').map(message => {
    return { author: message.role, content: message.content };
  });

  return { firstMessageContent, modifiedMessages };
}

module.exports = formatMessagesBison;
