
//const speakAPI = require('./speakAPI');
async function chatGenerator(messages, openai, client) {

  var newMessage = { role: "system", 
                    content: "To preserve memory, please summarize the story so far in brief. Ensure that character names, traits, party or group members, and key events have been captured along with current objectives, location, and the state of any in-progress conversation." }
  messages.push(newMessage)
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages,
  });
  console.log(completion.choices[0].message);
  let response = completion.choices[0].message.content
  return response
  //let speech = speakAPI(response, client)
  //return speech
  //console.log(response)
  //console.log(await response.json())
  
}
module.exports = chatGenerator