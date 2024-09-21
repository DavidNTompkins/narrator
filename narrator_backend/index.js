// Catch unhandled exceptions
process.on('uncaughtException', (err) => {
  console.error('An uncaught exception occurred:', err);
  // Additional logging, cleanup, or graceful shutdown code here
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('An unhandled promise rejection occurred:', reason);
  // Additional logging, cleanup, etc. here
});
require('dotenv').config();

//const imageGenAPI = require('./imageGenAPI');
const sd_imageGenAPI = require('./sd_imageGenAPI');
//const streamGenerator = require('./streamGenerator');
const ANYSD_imageGen = require('./ANYSD_imageGen');
//const streamChatCompletion = require('./streamGeneratorV2')
const cookieParser = require('cookie-parser');
//const speakAPI = require('./speakAPI');
const express = require('express');
const multer = require('multer');
const { Readable } = require('stream');
const app = express();
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const CryptoJS = require('crypto-js');
const {encode} = require('gpt-3-encoder')
const bake = require('./baker.js')

const formatMessages = require('./llamaformatter')
const formatMessagesBison = require('./bisonformatter')
const formatMessagesMistral = require('./mistralformatter')
//const Replicate = require("replicate");
const {chatStream} = require('@replit/ai-modelfarm');

//const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { getModelParameters } = require('./modelParams.js'); // Adjust the path as necessary


const EventSource = require('eventsource');
//const openRouterBake = require('./openRouterBaker.js');
const { hallucinate } = require('./Hallucinator');
const { fancyHallucinate, generateVideo, storyboard  } = require('./Recapper');


function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


const originalFetch = fetch;
global.fetch = async (...args) => {
    console.log('Fetching:', ...args);
    return originalFetch(...args);
};


// for generating stripe coupons

// messed with this 
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
})

const upload = multer({ storage })
const fs = require('fs');
const cors = require('cors');
const textToSpeech = require('@google-cloud/text-to-speech');
const chatGenerator = require('./chatGenerator') // name is tech debt - actually is openai hyperion
const openRouterHyperion = require('./openRouterHyperion')
const OpenAI = require("openai");
//const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
//const client = new textToSpeech.TextToSpeechClient({ credentials });

const openai = null
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.openrouter_key,
  defaultHeaders: {
    //"HTTP-Referer": `https://playnarrator.com/`, // Replace with your site URL
    "X-Title": `playnarrator.com`, // Replace with your site name
  },
  // dangerouslyAllowBrowser: true,
})

const decart = null

//const replicate = new Replicate({
//  auth: process.env.replicate_key,
//});

/* LOGGER DETAILS */
const winston = require('winston');


// Create a new logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});
const tokenlogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'usageLog.json' })
  ]
});





app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: 'audio/*', limit: '50mb' }));
app.use(cookieParser());



const allowedOrigins = [
  'https://playnarrator.com', 
  "http://localhost:3003",
];

app.use(cors({
 origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('origin blocked, origin is: ', origin)
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
  maxAge: 25 * 60,
}));


// for strictly neccessary session cookie
function ensureSession(req, res, next) {
  if (!req.cookies.sessionId) {
    const sessionId = uuidv4();
    res.cookie('sessionId', sessionId, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }); // expires in 1 day
  }
  next();
}

app.use(ensureSession);

app.use(bodyParser.json()); // this is for everyone but borks the raw signing of the webhooks (outdated notice - stripe related)



// I  think this is outdated
app.post('/endpoint1', async (req, res) => {
  res.set('Content-Type', 'application/json');
  //console.log(req.body.promptMessages)
  const inputString = req.body;
  const sessionId = req.cookies.sessionId;
  console.log(inputString); 
  const startTime = Date.now();

  const outputString = await sd_imageGenAPI(req.body.promptMessages, openrouter);
  //console.log(outputString)
  const endTime = Date.now();
  const duration = endTime - startTime;
  logger.info({ message: `endpoint1 call took ${duration}ms` });

  res.send(outputString);
});

app.post('/singleimage', async (req, res, next) => {
  res.set('Content-Type', 'application/json');
  //console.log(req.body.promptMessages)
  const inputString = req.body;
  const sessionId = req.cookies.sessionId;
  console.log(inputString); 
  const startTime = Date.now();

  const outputString = await ANYSD_imageGen(req.body.newText, req.body.style);
  //console.log(outputString)
  const endTime = Date.now();
  const duration = endTime - startTime;
  logger.info({ message: `endpoint1 call took ${duration}ms` });

  res.send(outputString);
  next();
});

app.post('/hyperion', async (req, res, next) => {
  const messages = req.body.messages;
  const modelChoice = req.body.model || "GPT 4o-Mini";
    let newMessages;
  //xconsole.log(messages)
  //const startTime = Date.now();
  if (false &&req.body.model && (req.body.model == 'Open Orca' || req.body.model == 'Zephyr' || req.body.model == "Hermes" || req.body.model=="Mistral" || req.body.model == "Toppy")) {
  newMessages = openRouterHyperion(messages, req.body.model) // never finished implementing this sorry
  }else {
  newMessages = await chatGenerator(messages, openrouter, "client")//speakAPI(text, client);
  }
  //const endTime = Date.now();
  //const duration = endTime - startTime;
  //logger.info({ message: `endpoint2 call took ${duration}ms` });

  console.log("Summary: "+ newMessages)
  req.fullResponse = newMessages.content;
  res.set('Content-Type', 'application/json');
  res.send({message:newMessages});
  next();
});

//baker's store now open for business:
app.post('/bake', async (req, res, next) => {
  const ingredients = req.body.unbakedIngredients;
  //xconsole.log(messages)
  //const startTime = Date.now();
  let newMessages;
  if(false && req.body.model && req.body.model !== "GPT 4o-Mini"){
    //newMessages = await openRouterBake(ingredients,req.body.model);
  } else {
    newMessages = await bake(ingredients, openrouter, "client")//speakAPI(text, client);
  }
  console.log("baked: "+ newMessages)
  req.fullResponse = newMessages.content;
  res.set('Content-Type', 'application/json');
  res.send({message:newMessages});
  next();
});


/*// I think this is the old speech to text path - it was always pretty bad.
app.post('/endpoint3', upload.single('file'), async (req, res) => {
  try {
    //console.log(req.file)
    const startTime = Date.now()
    console.log(req.file)
    const transcript = await whisperAPI(req.file.path,openai)
    const endTime = Date.now();
  const duration = endTime - startTime;
  logger.info({ message: `endpoint3 call took ${duration}ms` });
    fs.unlink(req.file.path, (err) => {
      if (err) throw err;
      console.log('Audio file was successfully deleted');
    });  
    res.set('Content-Type', 'application/json');
    console.log("IM HERE!")
    console.log(transcript);
    res.send(transcript);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}); */

app.post('/access',async (req,res)=>{
// this used to check for content moderation. It's on you now.
  res.send({code:"good"});
})

app.post('/moderation',async (req,res)=>{
 // same here for different routes
  res.send({code:"good"});
 })
// easy Check ban logic for non-endpoint based actions.

app.get('/check-ban-status', (req, res) => {
 // not sure this ended up getting implemented fully - used to check if you were on a banlist
 res.status(200).send('You are not blocked.');
});

// lowkey i have no idea what this does? I can't imagine this being useful?
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// outdated - was using a company that went under for the free zephyr model
async function getChatCompletion(req, model_params) {
  if (req.body.model === 'Zephyr') {
    return await decart.chat.completions.create(model_params);
  } else {
    return await openrouter.chat.completions.create(model_params);
  }
}

//app.use('/stream2', freeLimiter);
app.post('/stream2',async (req,res,next) =>{
  console.log('instream 2')

  let userId = req.body.userID; //this has a default 'notloggedin' if you're not logged in

  let messageTexts = req.body.messages.map(message => message.content).join(' ');

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sessionId = req.cookies.sessionId;
  var shaID
  if(sessionId){
    shaID = CryptoJS.SHA256(sessionId).toString();
  } else{
    shaID = 'anonymous';
  }

  // Send SSE stream
  const sseStream = new Readable({
    read() {}
  });
  if (req.body.model === 'Mistral') { //jank old fix to a bug
    req.setTimeout(120000); // Set timeout to 120 seconds
  }

  // Get SSE data from 3rd party API
  const messages = req.body.messages;
  console.log(messages.length)

  let fullMessage = ''
  let fullText = ''
  sseStream.on('error', (err) => {
    console.error('SSE Stream Error:', err);
    res.status(500).send('Internal Stream Error');
    sseStream.destroy();
  });
  res.on('close', () => {
    console.log('Response closed');
    sseStream.destroy();
  });
  sseStream.pipe(res);
  let answer = ''
  let fullResponse = ''
  let lastFire = 0;
  console.log(shaID);
  let dataSent = false;  // Flag to check if any data was sent
  // checking provided measures
  let temperature = req.body.temperature ? parseFloat(req.body.temperature) : 0.8;
  let repetition_penalty = req.body.repetition_penalty ? parseFloat(req.body.repetition_penalty) : 0.8//Math.max(parseFloat(req.body.repetition_penalty), 1.0)   : 1.0;
  let presence_penalty = req.body.presence_penalty ? parseFloat(req.body.presence_penalty) : 0.2; // only apply to gpt
  let frequency_penalty = req.body.frequency_penalty ? parseFloat(req.body.frequency_penalty) : 0.2; // only apply to gpt
  console.log('temp: ', temperature);
  //console.log(req.body);
  // retry parameters
  const maxAttempts = 3;
  const baseDelay = 500; // in milliseconds
  let buffer = ''; // Buffer to accumulate chunks
  let streamComplete = false;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if(!streamComplete){
  try {
    // this used to only do non gpt models, but now it does them all
    if (true || (req.body.model && (req.body.model == 'Open Orca' || req.body.model == 'Dolphin Mixtral' || req.body.model == 'Zephyr' || req.body.model == "Hermes" || req.body.model=="Mistral" || req.body.model == "Toppy" || req.body.model == "Open 3.5" || req.body.model == "Hermes 13b" || req.body.model == "Mixtral" || req.body.model == "MythoMist 7b" || req.body.model == "MythoMax 13b"  || req.body.model == "Hermes Mixtral"))) {
      // OpenRouter goes here
      //const promptMessages = formatMessagesOpenRouter(messages); // Assuming you have a function to format messages
      
      const modelName = (() => {
        switch (req.body.model) {
          case "Open Orca": return "open-orca/mistral-7b-openorca";
          case "Mistral": return "open-orca/mistral-7b-openorca";
          case "Zephyr": return "openchat/openchat-7b";
          case "Hermes": return "teknium/openhermes-2.5-mistral-7b";
          case "Toppy" : return "undi95/toppy-m-7b";
          case "Open 3.5" : return "openchat/openchat-7b";
          case "Hermes 13b" : return "nousresearch/nous-hermes-llama2-13b";
          case "Mixtral" : return "nousresearch/nous-hermes-2-mixtral-8x7b-dpo";
          case "MythoMist 7b": return "gryphe/mythomist-7b";
          case "MythoMax 13b" : return "gryphe/mythomax-l2-13b";
          case "Hermes Mixtral" : return "nousresearch/nous-hermes-2-mixtral-8x7b-dpo";
          case "Dolphin Mixtral" : return "cognitivecomputations/dolphin-mixtral-8x7b";
          case "GPT 4o-Mini" : return "openai/gpt-4o-mini";
          case "GPT 3.5" : return "openai/gpt-4o-mini";
          default: return req.body.model;
        }
      })();

      console.log(`trying: ${modelName}`, Date.now());
      const modelParams = getModelParameters(req.body.model, req.body);
      //console.log(modelParams);
      const model_params= {
          model: modelName,
          messages,
          stream: true,
          //user:shaID, this was a carry over from openai. No longer relevant
          repetition_penalty: modelParams.repetition_penalty,
          frequency_penalty:modelParams.frequency_penalty,
          max_tokens:800,
          temperature:modelParams.temperature,
        }

        const response = await openrouter.chat.completions.create(model_params)

      console.log("STARTING!" , Date.now())

        for await (const chunk of response) {
            // Check if the chunk indicates completion
          //console.log(chunk);
          //console.log(chunk);
            const finishReason = chunk?.choices[0]?.finish_reason;

           // console.log(Date.now(),"|", chunk.choices[0]?.delta?.content);
            
            if (finishReason) {
                sseStream.push(`data: ${JSON.stringify(answer)}\n\n`);
                sseStream.push(':close\n\n');
                sseStream.push('event:close\n\n');
                sseStream.destroy();

                // Logging and request handling
                console.log(`below: ${req.body.userID}`);
                streamComplete = true;
                req.fullResponse = fullResponse;
                next();
                return;
            }

            // Assuming chunk is already a parsed JSON object and contains content
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              if (fullResponse === '') {
                answer = answer.replace(/^[\n\r]+/, '').trimStart(); // This removes newlines from the start
              }
                answer += content;

                // Check if the last token is a punctuation mark
                if (/[\.\?\!]/.test(content)) {
                    const now = Date.now();
                    if (now - lastFire > 10 && answer !== '') {
                        lastFire = now;
                        sseStream.push(`data: ${JSON.stringify(answer)}\n\n`);
                        fullResponse += answer;
                        answer = "";
                    }
                }
            }
        }
        streamComplete=true;
    } else{continue} // This used to have a set of calls straight to OpenAI. Now goes through openrouter.
    
    if (streamComplete){
      console.log('EXITING STREAM')
      sseStream.push(`data: ${JSON.stringify(answer)}\n\n`);
      sseStream.push(':close\n\n');
      sseStream.push('event:close\n\n');
      sseStream.destroy();
      next();
      return;
      break;
    }
    } catch (error) {
      console.error("Error occurred during OpenAI chat completion: ", error + " "+ error.statusMessage + " "+ error.stack);


      if (attempt === maxAttempts - 1) {
        console.error("Max retries reached, not trying again");
        break;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }}

  req.on('close', () => {
    console.log("In closing")
    sseStream.destroy();
    return fullResponse;
  });
});


app.post('/hallucinate', async (req, res) => {
  try {
    console.log('hallucinating');
    const imageUrl = await hallucinate(req.body.prompt,req.body.negativePrompt,req.body.censorImages);
    res.send({ imageUrl });
    //console.log(req.body)
    //console.log('Hallucination complete: ', imageUrl)
  } catch (error) {
    //console.error('Error:', error.message);
    //console.log(error);
    //console.log(req.body);
    res.status(500).send({ error: error.message });
  }
});

// lol I think this is for the video maker iirc
app.post('/fancyHallucinate', async (req, res) => {
  try {
    console.log('fancy hallucinating');
    const imageUrl = await fancyHallucinate(req.body.prompt,req.body.negativePrompt,req.body.censorImages);
    res.send({ imageUrl });
    //console.log(req.body)
    console.log('Hallucination complete: ', imageUrl)
  } catch (error) {
    //console.error('Error:', error.message);
    //console.log(error);
  //  console.log(req.body);
    res.status(500).send({ error: error.message });
  }
});

app.post('/recap', async (req, res) => {
  try {
    console.log('recapping');
    const videoUrl = await generateVideo(req.body.imageUrl);
    res.send({ videoUrl });
    //console.log(req.body)
    console.log('video complete: ', videoUrl)
  } catch (error) {
    console.error('Error:', error.message);
    console.log(error);
    console.log(req.body);
    res.status(500).send({ error: error.message });
  }
});

app.post('/storyboard', async (req, res) => {
  try {
    console.log('recapping');
    const image_set = await storyboard(req.body.prompt,openrouter);
    res.send({ image_set });
    //console.log(req.body)
    console.log('storyboard complete: ', image_set)
  } catch (error) {
    console.error('Error:', error.message);
    console.log(error);
    console.log(req.body);
    res.status(500).send({ error: error.message });
  }
});




const PORT = process.env.PORT || 3000;
console.log(PORT);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});