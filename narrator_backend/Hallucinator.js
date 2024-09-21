// imageGenerator.js
const fal = require("@fal-ai/serverless-client");
fal.config({
  // Can also be auto-configured using environment variables:
  // Either a single FAL_KEY or a combination of FAL_KEY_ID and FAL_KEY_SECRET
  credentials: `${process.env.FAL_KEY_SECRET}`,
});

async function hallucinate(prompt,negativePrompt,censorImages) {
  if (!prompt) {
    throw new Error('No prompt provided', prompt);
  }
 

  // optimized, no lora:
 const result = await fal.subscribe("110602490-lcm-sd15-i2i", {
    input: { prompt,
            negative_prompt: negativePrompt,
            image_url:"https://storage.googleapis.com/falserverless/model_tests/lcm/source_image.png",
            strength:1,
            enable_safety_checks: censorImages,
            },
    logs: false,
    onQueueUpdate: (update) => {
      
    },
  }); 

  //console.log(result);
  if (result.images && result.images.length > 0 && !result.nsfw_content_detected[0] ) {
    return result.images[0].url;
  } else if (result.nsfw_content_detected[0]){
    return "/image_assets/hallucinatorAssets/nsfw.jpg"
  } else {
    throw new Error('No image generated');
  }
}

module.exports = { hallucinate };
