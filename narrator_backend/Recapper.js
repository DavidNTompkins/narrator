// imageGenerator.js
const fal = require("@fal-ai/serverless-client");
fal.config({

  credentials: `${process.env.FAL_KEY_SECRET}`,
});


async function storyboard(prompt,openai){
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            "role": "system",
            "content": "You are a precise Image describer. You help filmmakers create storyboards for short stories. You respond by providing descriptions of single images that collectively tell a story. Your descriptions are precise and descriptive. Collectively they tell the story presented by the filmaker. You provide between 7 and 10 image suggestions. Providing each on its own line. Each image is self contained with location, providing all information in a single sentence. Always include location, always show, don't tell, always drive plot. Be quite literal, describe the scene in specifics. Your final scene should imply a dramatic hook or mystery, or the major plot point.\n\nFor example:\n1. A scene on a pirate ship with Captain Bluebeard standing on the deck, biting into a crisp apple. Birds are flying overhead in a clear sky. The scene captures the essence of a pirate's life at sea, with the captain appearing confident and at ease, the wooden deck and sails of the ship detailed and aged, reflecting the sunlight in a vibrant yet natural way. The ocean in the background is calm, with the horizon stretching far. This image should look like it's from a cinematic movie, focusing on realism and atmospheric detail. \n2. A vivid scene on a pirate ship showing a pirate first-mate in the midst of loading a cannon, preparing for an imminent battle. It's a sunny day with clear blue skies overhead. The first-mate is focused, showcasing the intensity and readiness for combat, with cannonballs and gunpowder nearby. The ship's deck is bustling with activity, yet this pirate stands out with determination. The sun casts dynamic shadows across the wooden deck, highlighting the textures of the ship and the ocean's serene beauty in the background. This image should capture the tension and excitement of a cinematic pirate movie, with a high level of realism and detail.\n3. A scene inside the hull of a wooden pirate ship, focusing on a dimly lit, cramped space. In this gloomy atmosphere, a man named Kevin is depicted, his expression a mix of defiance and resignation. He's chained up behind rusted iron bars, adding to the feeling of despair. The wooden textures of the ship's interior are detailed, with faint streams of light filtering through cracks above, casting shadows that dance on the damp floor and Kevin's face..\n4. A breathtaking underwater scene depicting an ancient monument that pulsates with an unseen power. This monument, intricate and mysterious, stands on the ocean floor, surrounded by a myriad of fish that swim in mesmerizing vortexes around it. The water's hue shifts subtly around the monument, suggesting an ethereal glow emanating from it. The scene captures the sense of awe and the timeless power of the ocean's depths, with the monument serving as a focal point that draws the eye and stirs the imagination.\n5. A close-up of a prisoner's arm, showing a piece of jewelry glowing with mystical, eldritch power. The arm is shackled, hinting at the prisoner's status, and the jewelry emits a soft, otherworldly light that contrasts with the dark, grim surroundings of a cell. The focus is on the intricate details of the jewelry, showcasing its unique design and the supernatural energy it radiates.\n6.  A dramatic scene in the open ocean where a pirate ship explodes. The sky is filled with smoke and debris, flying in all directions, as flames engulf the wooden structure of the ship. The intense fire contrasts with the dark, stormy sea around it, creating a powerful image of chaos and destruction. This scene captures the moment of impact, with waves crashing around the ship, emphasizing the ship's vulnerability in the vast, open water.\n7. A thrilling scene depicting Captain Bluebeard falling through the upper atmosphere, his clothes singed and tattered from an unknown disaster. The sky around him transitions from the deep, dark blue of space to the lighter blue of the Earth's atmosphere, with clouds swirling below. His expression is one of determined resilience despite the perilous situation, and his pirate attire is visibly damaged, indicating he has survived an incredible ordeal. This image captures the moment of free fall, emphasizing the vastness of the sky and the gravity of his situation.\netc."
          },
          {
            "role": "user",
            "content": `Please create a list of images for \"${prompt}\"`
          }
        ],
        temperature: 1,
        max_tokens: 960,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return response.choices[0].message.content;
}


async function fancyHallucinate(prompt,negativePrompt,censorImages) {
  if (!prompt) {
    throw new Error('No prompt provided', prompt);
  }

 const result = await fal.subscribe("fal-ai/fast-lcm-diffusion", {
    input: { prompt: `Well-lit lifelike movie still of ${prompt}, photographic, high resolution, octane, dynamic lighting`,
            negative_prompt: negativePrompt,
            model_name: "runwayml/stable-diffusion-v1-5",
            image_size: {
                width: 768,
                height: 512
              },
            image_url:"https://storage.googleapis.com/falserverless/model_tests/lcm/source_image.png",
            strength:1,
            steps:6,
            enable_safety_checks: censorImages,
            sync_mode:false,
            },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        update.logs.map((log) => log.message).forEach(console.log);
      }
    },
  }); 

  //console.log(result);
  if (result.images && result.images.length > 0 ) {
    return result.images[0].url;
  } else {
    throw new Error('No image generated');
  }
}

async function generateVideo(image_url) {
   
  
    const result = await fal.subscribe("fal-ai/fast-svd-lcm", {
        input: {
          image_url: image_url,
          motion_bucket_id: 20 + Math.round(Math.random()*10),
          cond_aug: 0.005,
          steps: 6,
          fps: 10,
          seed: 32843
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });
  
    //console.log(result);
    if (result.video) {
      return result.video.url;
    } else {
      throw new Error('No video generated');
    }
  }

module.exports = { fancyHallucinate, generateVideo, storyboard };
