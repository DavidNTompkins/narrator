
async function ANYSD_imageGen(prompt,style) {
  (async () => {
      const { default: fetch } = await import('node-fetch');
      // Use fetch here
  })();

const stabilityApiKey = process.env.sd_key;

if (!stabilityApiKey) {
  console.error('STABILITY_API_KEY environment variable is not set');
  process.exit(1);
}
const negativePrompt = "ugly, poorly drawn, out of frame, extra limbs, disfigured, deformed, body out of frame, shutterstock, watermark, signature, bad art, distorted face, blurry, draft, grainy"
const negativePromptTwo = "watermark, signature, watermarked, logo"
const outputFile = './v1beta_txt2img.png';
const baseUrl = process.env.API_HOST || 'https://api.stability.ai';
const url = `${baseUrl}/v1/generation/stable-diffusion-v1-6/text-to-image`;

const requestBody1 = {
  text_prompts: [
    {
      text: prompt,
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
  style_preset: style,
  height: 512,
  width: 512,
  samples: 1,
  steps: 20,
}

let resultOne = await fetch(url, {
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
  .catch((error) => {
    console.error(error);
    return "reject";
  })

  return resultOne

  //JSON.stringify([resultOne.data.data[0].url, resultTwo.data.data[0].url])
}
module.exports = ANYSD_imageGen