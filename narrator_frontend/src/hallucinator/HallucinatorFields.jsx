import React from 'react';

function HallucinatorFields({ formData, setFormData,showValues=true }) {
    
    const handleKeyChange = (index, event) => {
        const newFields = [...formData.hallucinator];
        newFields[index].key = event.target.value;
        setFormData({ ...formData, hallucinator: newFields });
    };

    const handleValueChange = (index, event) => {
        const newFields = [...formData.hallucinator];
        newFields[index].value = event.target.value;
        setFormData({ ...formData, hallucinator: newFields });
    };

    const handleAddPair = () => {
      if(!formData.hallucinator){
        setFormData({ ...formData, hallucinator: [{key:'',value:''}]});
      } else{
        
      
        const newFields = [...formData.hallucinator, { key: '', value: '' }];
        setFormData({ ...formData, hallucinator: newFields });
      }
    };

    const handleRemovePair = (index) => {
        const newFields = [...formData.hallucinator];
        newFields.splice(index, 1);
        setFormData({ ...formData, hallucinator: newFields });
    };
  const handleCensorImagesChange = (event) => {
      setFormData({ ...formData, censorImages: event.target.checked });
  };
  const handleGuessStylesChange = (event) => {
      setFormData({ ...formData, guessHallucinationStyles: event.target.checked });
  };


    return (
        <div className='option-selector-div' style={{alignText:'center',maxWidth:'95%'}}>
          {/* Checkbox for Censor Images */}
         
          <p style={{textAlign:'center',margin:'auto'}}>Add some styles for the Hallucinator. If the word/character name on left appears, the styles on right will be used.</p> 
          <p style={{fontSize:'0.7em'}}>Anything tagged 'general_style' will get added to every image!</p>
            {(formData.hallucinator || []).map((pair, index) => (
                <div key={index} style={{ alignItems: 'center', marginBottom: '0px',maxWidth:'700px',margin:'auto', width:'100%' }}>
                  <button className="rule-option-button" type='button' onClick={() => handleRemovePair(index)}>-</button>
                    <input
                        type="text"
                        placeholder="comma separated keywords"
                        value={pair.key}
                        onChange={event => handleKeyChange(index, event)}
                        style={{ marginRight: '4px', width: showValues ? '35%' : '80%' }}
                    />{showValues && <>:
                    <input
                        type="text"
                        placeholder="short stylistic description (e.g., knight in armor)"
                        value={pair.value}
                        onChange={event => handleValueChange(index, event)}
                        style={{ marginRight: '5px',marginLeft:'4px', width: '35%' }}
                    /></>}
                </div>
          
            ))}
          <button className="rule-option-button" type='button' onClick={handleAddPair}>+ Add Style Control</button>
          <div style={{ margin: '20px auto', maxWidth:'80%' }}>
            <input
                type="checkbox"
                id="guessForMe"
              checked={formData.guessHallucinationStyles !== undefined ? formData.guessHallucinationStyles : true}
                onChange={handleGuessStylesChange}
                style={{display:'inline', marginBottom:'6px'}}
              />
              <label htmlFor="guessForMe" style={{ marginLeft: '8px', display: 'inline', color:'white'}}>
                Guess styles for me.
            </label>
            <br></br>
            <input
                type="checkbox"
                id="censorImages"
              checked={formData.censorImages !== undefined ? formData.censorImages : true}
                onChange={handleCensorImagesChange}
                style={{display:'inline'}}
            />
            <label htmlFor="censorImages" style={{ marginLeft: '8px', display: 'inline', color: (formData.censorImages!==undefined || true ) ? 'white' : 'red'}}>
              Censor Images (Enabled=Censored. Please be careful uncensoring this!)
              </label>
            
              
          </div>
            
        </div>
    );
}

export default HallucinatorFields;
