
async function sd_imageGenAPI(messages, openai) {

  let promptOne = `medium portrait shot painting face of  ${messages[0].promptOne}, high quality artwork trending award-winning, exquisite, detailed, stunning, ghibli, dynamic lighting, render, symmetric, baroque oil on canvas, digital character, square picture, centered subject`
  
  let promptTwo = `medium portrait shot painting face of  ${messages[0].promptTwo}, high quality artwork trending award-winning, exquisite, detailed, stunning, ghibli, dynamic lighting, render, symmetric, baroque oil on canvas, digital character, square picture, centered subject`
  //let [promptOne, promptTwo] = completion.data.choices[0].message.content.split(/\n{1,}/, 2)
  console.log(promptOne + "\n" + promptTwo)
const fetch = require('node-fetch'); // if using in Node.js

const stabilityApiKey = process.env.sd_key;

if (!stabilityApiKey) {
  console.error('STABILITY_API_KEY environment variable is not set');
  process.exit(1);
}
const negativePrompt = "ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame,shutterstock, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy"
const negativePromptTwo = "watermark, signature, watermarked, logo"
const outputFile = './v1beta_txt2img.png';
const baseUrl = process.env.API_HOST || 'https://api.stability.ai';
const url = `${baseUrl}/v1/generation/stable-diffusion-512-v2-1/text-to-image`; // if you wanted to change the model to a different stability model, this is where you could.

const requestBody1 = {
  text_prompts: [
    {
      text: promptOne,
      weight:1,
    },
    {
      text: negativePrompt,
      weight: -2,
    },
    {
      text: negativePromptTwo,
      weight: -2,
    }
  ],
  cfg_scale: 7,
  clip_guidance_preset: 'FAST_BLUE',
  height: 512,
  width: 512,
  samples: 1,
  steps: 15,
};
  const requestBody2 = {
  text_prompts: [
    {
      text: promptTwo,
      weight:1,
    },
    {
      text: negativePrompt,
      weight: -2,
    },
    {
      text: negativePromptTwo,
      weight: -2,
    }
  ],
  cfg_scale: 7,
  clip_guidance_preset: 'FAST_GREEN',
  height: 512,
  width: 512,
  samples: 1,
  steps: 15,
};

//I think some of this was relating to when it used to generate images for both characters at same time?

let [resultOne, resultTwo] = await Promise.all([
  fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${stabilityApiKey}`,
  },
  body: JSON.stringify(requestBody1),
})
  .then((res) => {
    if (!res.ok) {
      console.log(res)
      throw new Error(`Failed with status ${res.status}`);
    }
    return res.json()})
    .then((response) => {
      //console.log(response)
      //console.log(response.artifacts[0].base64)
    return response.artifacts[0].base64})                                                 
  /*})
  .then((buffer) => {
    // save the buffer to file
    // you may want to check that the directory exists before saving
    require('fs').writeFileSync(outputFile, buffer);
    console.log(`Saved to ${outputFile}`);
  })*/
  .catch((error) => console.error(error)),
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${stabilityApiKey}`,
  },
  body: JSON.stringify(requestBody2),
})
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Failed with status ${res.status}`);
    }
    return res.json()})
    .then((response) => {
      //console.log(response)
      //console.log(response.artifacts[0].base64)
    return response.artifacts[0].base64})                                                          
  .catch((error) => console.error(error))]);
  
  /*let [resultOne, resultTwo] = await Promise.all([
    openai.createImage({
      prompt: promptOne,
      n: 1,
      size: "256x256",
      response_format: "url"
    }),
    openai.createImage({
      prompt: promptTwo,
      n: 1,
      size: "256x256",
      response_format: "url"
    })
  ]); */

  //console.log(response)
  //console.log(await response.json())
  //console.log(resultOne)
  return [resultOne, resultTwo]
  
  //JSON.stringify([resultOne.data.data[0].url, resultTwo.data.data[0].url])
}
module.exports = sd_imageGenAPI