import React from 'react';

const ReminderBox = ({ formData, handleInputChange }) => {
    return (
        <div className='option-selector-div'>
          <p>Remind the AI before each message:</p>
            <textarea
                value={formData.reminderText}
                className='reminder-textbox'
                placeholder='Simple reminders work best!'
                onChange={e => handleInputChange('reminderText', e.target.value)}
              style={{width:'75%',marginTop:'0.4em'}}
            ></textarea>
          {false && <><br></br>
                <input 
                    type="checkbox" 
                    checked={formData.reminderActive}
                    onChange={e => handleInputChange('reminderActive', e.target.checked)}
                   id="customCheckbox"
                    style={{display:'inline', marginRight:'4px'}}
                />
                <label htmlFor="customCheckbox" style={{color:'white'}}>{formData.reminderActive ? 'Enabled' : 'Disabled'}</label>
          </> }
        </div>
    );
};

export default ReminderBox;
