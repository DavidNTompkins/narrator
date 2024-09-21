import React from 'react';

function TrackerFields({ formData, setFormData,showValues=true }) {
    
    const handleKeyChange = (index, event) => {
        const newFields = [...formData.trackedFields];
        newFields[index].key = event.target.value;
        setFormData({ ...formData, trackedFields: newFields });
    };

    const handleValueChange = (index, event) => {
        const newFields = [...formData.trackedFields];
        newFields[index].value = event.target.value;
        setFormData({ ...formData, trackedFields: newFields });
    };

    const handleAddPair = () => {
      if(!formData.trackedFields){
        setFormData({ ...formData, trackedFields: [{key:'',value:''}]});
      } else{
        
      
        const newFields = [...formData.trackedFields, { key: '', value: '' }];
        setFormData({ ...formData, trackedFields: newFields });
      }
    };

    const handleRemovePair = (index) => {
        const newFields = [...formData.trackedFields];
        newFields.splice(index, 1);
        setFormData({ ...formData, trackedFields: newFields });
    };

    return (
        <div className='option-selector-div'>
          <p>Ask AI To track stats:</p> 
            {(formData.trackedFields || []).map((pair, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0px',maxWidth:'95%',margin:'auto' }}>
                  <button className="rule-option-button" type='button' onClick={() => handleRemovePair(index)}>-</button>
                    <input
                        type="text"
                        placeholder="attribute"
                        value={pair.key}
                        onChange={event => handleKeyChange(index, event)}
                        style={{ marginRight: '4px', width: showValues ? null : '80%' }}
                    />{showValues && <>:
                    <input
                        type="text"
                        placeholder="starting value"
                        value={pair.value}
                        onChange={event => handleValueChange(index, event)}
                        style={{ marginRight: '10px',marginLeft:'4px' }}
                    /></>}
                    
                </div>
            ))}
            <button className="rule-option-button" type='button' onClick={handleAddPair}>+ Add Tracked Field</button>
        </div>
    );
}

export default TrackerFields;
