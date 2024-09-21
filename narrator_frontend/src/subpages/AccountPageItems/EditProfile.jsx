import React, { useState } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

function EditProfile({ userProfile, userId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [referralCode,setReferralCode] = useState(userProfile.referralCode);

  const handleUpdate = async () => {
    const db = getFirestore();
    try {
      await updateDoc(doc(db, 'users', userId), {
        name,
      });
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  

  return (
    <div>
      <hr></hr>
      <h2 onClick={() => setIsEditing(!isEditing)}>
        {'Edit Profile '}
        <span style={{display: 'inline-block', transition: 'transform 0.3s', transform: `rotate(${isEditing ? 90 : 0}deg)`}}>&#9654;</span>
      </h2>
      {isEditing && (
        <div>
          Your Username: <input type="text" value={name} style={{width:'50%',textAlign:'left'}} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <br></br>

          <button onClick={handleUpdate}>Update</button>
        </div>
      )}
    </div>
  );
}

export default EditProfile;
