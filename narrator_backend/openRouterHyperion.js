
async function openRouterHyperion(messages,modelName){
const modelName_hyperion = (() => {
  switch (modelName) {
    case "Open Orca": return "open-orca/mistral-7b-openorca";
    case "Mistral": return "open-orca/mistral-7b-openorca";
    case "Zephyr": return "huggingfaceh4/zephyr-7b-beta";
    case "Hermes": return "teknium/openhermes-2-mistral-7b";
    case "Toppy" : return "undi95/toppy-m-7b";
    default: return "CRASH";
  }
})();
console.log(`trying: ${modelName_hyperion}`);
const requestOptions = {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.openrouter_key}`, // Replace with your OpenRouter API key
    "HTTP-Referer": `https://playnarrator.com/`, // Replace with your site URL
    "X-Title": `playnarrator.com`, // Replace with your site name
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    messages: messages,
    stream: false,
    model: modelName_hyperion,
    temperature: 0.7,
    repetition_penalty: 1.0,
    max_tokens: 600,
  })
};

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", requestOptions);


const answer = response.choices[0].message.content;
console.log(answer);
return answer
}

module.exports = openRouterHyperion; 
