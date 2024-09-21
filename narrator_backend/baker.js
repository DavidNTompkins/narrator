//const speakAPI = require('./speakAPI');
async function bake(ingredients, openai, client) {

  var messages = [{ role: "system", 
                    content: "Please condense and summarize the provided information. Retain all important information: names of characters; character relationships; character affiliations; character motivations; character inventory; character emotional state; any key facts about location, setting and dialog. Summarize in a format useful in recreating relevant character, setting, plot, and story elements"},{role: "user", content:ingredients}]
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages,
  });
  //console.log(completion.data.choices[0].message);
  let response = completion.choices[0].message.content
  return response
  //let speech = speakAPI(response, client)
  //return speech
  //console.log(response)
  //console.log(await response.json())
  
}
module.exports = bake