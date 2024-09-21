// modelParams.js
// this got around some pretty nasty model behavior with some values

// Define default parameters for each model
const defaultModelParameters = {
    "Toppy": { temperature: 0.3, repetition_penalty: 1.0, presence_penalty: 0.5, frequency_penalty: 0.5 },
    "MythoMax 13b": { temperature: 0.3, repetition_penalty: 1.5, presence_penalty: 0, frequency_penalty: 0 },
    "Mixtral": { temperature: 0.3, repetition_penalty: 2.0, presence_penalty: 0.5, frequency_penalty: 0.5 },
    "Hermes Mixtral": { temperature: 0.3, repetition_penalty: 2.0, presence_penalty: 0.5, frequency_penalty: 0.5 },
    "Hermes 13b": { temperature: 0.7, repetition_penalty: 1.0, presence_penalty: 0.5, frequency_penalty: 0.5 },
    "Open 3.5": { temperature: 0.7, repetition_penalty: 1.0, presence_penalty: 0.5, frequency_penalty: 0.5 },
    // Add other models with their default values here
    "MythoMizt 7b" : { temperature: 0.3, repetition_penalty: 1.0, presence_penalty: 0.5, frequency_penalty: 0.5 },
  };
  
  // Function to get model-specific parameters
  function getModelParameters(model, reqBody) {
    let params = {
      temperature: parseFloat(reqBody.temperature) || defaultModelParameters[model]?.temperature || 0.8,
      repetition_penalty: parseFloat(reqBody.repetition_penalty) || defaultModelParameters[model]?.repetition_penalty || 0.8,
      presence_penalty: parseFloat(reqBody.presence_penalty) || defaultModelParameters[model]?.presence_penalty || 0.2,
      frequency_penalty: parseFloat(reqBody.frequency_penalty) || defaultModelParameters[model]?.frequency_penalty || 0.5,
    };
  
    // Overrides (this instead of user pref)
    if (model === "Toppy" || model === "MythoMist 7b") {
        //console.log("Toppy Override")
      params.repetition_penalty = Math.max(1.0,params.repetition_penalty);
      // Add other specific changes for "Toppy" here
    }
  
    // Add conditions for other specific models if needed
  
    return params;
  }
  
  // Export the function for use in other files
  module.exports = {
    getModelParameters,
  };
  