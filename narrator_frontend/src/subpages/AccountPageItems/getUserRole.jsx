import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from "firebase/firestore";

function getUserRole(userId) {
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const db = getFirestore();
        console.log(userId);
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          if(userDoc.data().role){
          setUserRole(userDoc.data().role);
        }else{
          setUserRole("player");
          }
        }
      } catch (error) {
        console.error("Error fetching user role: ", error);
        setError(error);
      }
    };

    if (userId) {
      fetchUserRole();
    }
  }, [userId]);

  return { userRole, error };
}

export default getUserRole;
