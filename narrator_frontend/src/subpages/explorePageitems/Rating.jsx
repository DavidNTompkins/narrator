import React, { useState, useEffect } from 'react';
import { getFirestore, doc, onSnapshot, collection, query, getDocs, runTransaction } from 'firebase/firestore';
import Star from './Star';

//const db = getFirestore();

function Rating({ adventureId, userId, user }) {
    const [rating, setRating] = useState(0);
    const [userRating, setUserRating] = useState(null);
    const [avgRating, setAvgRating] = useState(0);
    const [numRatings, setNumRatings] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const adventureRef = doc(db, 'publishedAdventures', adventureId);
        const unsubscribeAdventure = onSnapshot(adventureRef, (doc) => {
            const data = doc.data();
            setAvgRating(data?.avgRating || 0);
            setNumRatings(data?.numRatings || 0);
        });

        let unsubscribeUserRating;
        if (userId) {
            const userRatingRef = doc(db, 'publishedAdventures', adventureId, 'ratings', userId);
            unsubscribeUserRating = onSnapshot(userRatingRef, (doc) => {
                setUserRating(doc.data()?.rating || null);
            });
        }

        return () => {
            unsubscribeAdventure();
            if (unsubscribeUserRating) unsubscribeUserRating();
        };
    }, [adventureId, userId]);

    const rate = async (index) => {
        if (!user) {
            alert("Please log in to rate.");
            return;
        }

        setIsLoading(true);
        const newRating = index + 1;

        const adventureRef = doc(db, 'publishedAdventures', adventureId);
        const ratingsRef = collection(db, 'publishedAdventures', adventureId, 'ratings');

        await runTransaction(db, async (transaction) => {
            const adventureDoc = await transaction.get(adventureRef);
            if (!adventureDoc.exists()) {
                throw new Error("Adventure document does not exist!");
            }

            // Retrieve all ratings to calculate new average and count
            const ratingsQuery = query(ratingsRef);
            const querySnapshot = await getDocs(ratingsQuery);
            let totalRating = newRating;
            let totalCount = 1;
            querySnapshot.forEach((doc) => {
                if (doc.id !== userId) {
                    totalRating += doc.data().rating;
                    totalCount += 1;
                }
            });

            const newAvgRating = totalRating / totalCount;
            const rankedRating = 6 + totalRating / (totalCount+2)
            transaction.update(adventureRef, { avgRating: newAvgRating, numRatings: totalCount, rankedRating:rankedRating });

            const userRatingRef = doc(db, 'publishedAdventures', adventureId, 'ratings', userId);
            transaction.set(userRatingRef, { rating: newRating }, { merge: true });
        });

        setRating(newRating);
        setIsLoading(false);
    };

    return (
        <div>
            {[...Array(5)].map((n, index) => {
                let fraction = 1;
                const currentRating = avgRating;

                if (index + 1 > Math.floor(currentRating) && index < Math.ceil(currentRating)) {
                    fraction = currentRating - Math.floor(currentRating);
                }

                return (
                    <Star 
                        key={index} 
                        selected={index < currentRating}
                        fraction={fraction}
                        userRated={index === (userRating - 1)}
                        onSelect={() => !isLoading && rate(index)}
                    />
                );
            })}
            <span style={{marginTop:'2px'}}>({numRatings})</span>
            {isLoading && <p>Submitting rating...</p>}
        </div>
    );
}

export default Rating;
