import React from 'react';

const ExtraAdvancedFeatures = ({ formData, setFormData,modelOptions }) => {

  const handleInputChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
    
  };


    return (
        <form>
          <div className="setting-field">
              <label htmlFor="temperature">Temperature: </label>
              <input
                  type="number"
                  id="temperature"
                  name="temperature"
                  min="0"
                  max="2.0"
                  step="0.1"
                  placeholder="0.8"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  title="Controls model creativity. Recommended: 0.8"
              />
          </div>
          {formData.model=="GPT 4o-Mini" ? <>
            <div className="setting-field">
                <label htmlFor="presence_penalty">Presence Penalty: </label>
                <input
                    type="number"
                    id="presence_penalty"
                    name="presence_penalty"
                    min="0"
                    max="2.0"
                    step="0.1"
                    value={formData.presence_penalty}
                    onChange={handleInputChange}
                  placeholder="0.2"
                    title="Discourages repetition, applies only to GPT models. Recommended: 0.2"
                />
            </div>

            <div className="setting-field">
                <label htmlFor="frequency_penalty">Frequency Penalty: </label>
                <input
                    type="number"
                    id="frequency_penalty"
                    name="frequency_penalty"
                    min="0"
                    max="2.0"
                    step="0.1"
                    value={formData.frequency_penalty}
                  placeholder="0.2"
                    onChange={handleInputChange}
                    title="Discourages repetition, with a bonus penalty for already repeated words. Applies only to GPT models. Recommended: 0.2"
                />
            </div> </>: <div className="setting-field">
              <label htmlFor="repetition_penalty">Repetition Penalty: </label>
              <input
                  type="number"
                  id="repetition_penalty"
                  name="repetition_penalty"
                  min="0"
                  max="2.0"
                  step="0.1"
                  value={formData.repetition_penalty}
                placeholder="0.8"
                  onChange={handleInputChange}
                  title="Discourages repetition in non-GPT models. Recommended: 0.8"
              />
          </div>
 }
          
          <br></br><br></br>
          {false && <div className="setting-field">
              <label htmlFor="baker_model">Baker Model: </label>
              <select
                  id="baker_model"
                  name="baker_model"
                  value={formData.baker_model}
                  onChange={handleInputChange}
              >
                <option value='default'>
                Default
                </option>
                  {modelOptions.map((option, index) => (
                      <option key={index} value={option}>
                          {option}
                      </option>
                  ))}
              </select>
              <p>Controls the model used for summarizing information. GPT4o-Mini is recommended for general play, Toppy is recommended for NSFW or violent games. Defaults to your gameplay model.</p>
          </div>}

            
        </form>
    );
};

export default ExtraAdvancedFeatures;
