import React, { useState } from 'react';
import './CreateCard.css'
import sayAWord from '../smallScripts/sayAWord.js'


const CreateCard = ({ formData, setFormData, onButtonClick, browser, mobile, setImageData, setAdditionalCharacters, userID }) => {
    // State to track player and sidekick inputs
    const [playerName, setPlayerName] = useState('');
    const [playerAppearance, setPlayerAppearance] = useState('');
    const [playerBackground, setPlayerBackground] = useState('');
    const [sidekickName, setSidekickName] = useState('');
    const [sidekickAppearance, setSidekickAppearance] = useState('');
    const [sidekickBackground, setSidekickBackground] = useState('');
    const [genre, setGenre] = useState('Adventure');


    const api_url = import.meta.env.VITE_API_URL || 'https://api.playnarrator.com/';
    const apiUrl = `${api_url}singleimage` //"https://api.playnarrator.com/singleimage";
    const genres = [
        "Adventure",
        "Sci-Fi",
        "Fantasy",
        "Fan-Fiction",
        "Mystery",
        "Crime",
        "Anime",
        "Action",
        "Comedy",
        "Horror",
        "Drama"];

    const storyhooks = [
        "The player has just found an ancient artifact with unknown powers.",
        "A legendary, lost city has been discovered.",
        "A new faction is gaining in power, upsetting the established order.",
        "An old prophecy is starting to come true, hinting at great changes.",
        "Unexplained phenomena are occurring worldwide, defying scientific explanation.",
        "A series of mysterious disappearances are linked to an ancient curse.",
        "A rare celestial event is predicted to bring about significant change.",
        "A hidden realm has been revealed, previously invisible to the common eye.",
        "The player stumbles upon a conspiracy that threatens the world.",
        "A natural disaster uncovers secrets long buried.",
        "An ancient enemy thought defeated has returned.",
        "A powerful artifact has been stolen, and its absence endangers the world.",
        "The player is chosen by a mystical force for an unknown purpose.",
        "A sudden technological breakthrough alters society overnight.",
        "A dream shared by many people worldwide points to a hidden truth.",
        "A forgotten war resurfaces, threatening peace across lands.",
        "A mythical creature is sighted, proving legends true.",
        "The discovery of a new land offers untold opportunities and dangers.",
        "A mysterious illness spreads, its origin and cure unknown.",
        "The balance between parallel worlds is disturbed, leading to chaos.",
        "An experimental technology malfunctions, leading to unforeseen consequences.",
        "A long-forgotten diary is found, revealing secrets about historical events.",
        "A cryptic message is received from an unknown source, hinting at a hidden truth.",
        "An underground organization is uncovered, operating with unknown motives.",
        "A renowned explorer goes missing under mysterious circumstances.",
        "A series of coded messages are found in different locations worldwide.",
        "An accidental discovery challenges the established history of civilization.",
        "A strange weather phenomenon begins occurring globally, defying explanation.",
        "A race against time begins to prevent an environmental catastrophe.",
        "A whistleblower reveals a scandal that could change society.",
        "A valuable resource is discovered in a dangerous and inaccessible location.",
        "A breakthrough in communication allows contact with a distant, unknown civilization.",
        "An uncharted island appears, not matching any known maps.",
        "A sudden shift in global politics leads to a tense espionage situation.",
        "An enigmatic figure emerges, offering solutions to world crises but at a cost.",
        "A series of artifacts are discovered, each holding a piece of a larger puzzle.",
        "A revolutionary invention goes missing, sparking a global hunt.",
        "A remote village is found to have residents with unusual abilities.",
        "An ancient society is discovered to have been far more advanced than previously thought.",
    ]

    const locations = [
        "In a tavern",
        "On a dirt road in a thick forest",
        "In a bustling city square",
        "Atop a lonely mountain peak",
        "Inside a quiet library",
        "On a crowded train",
        "Underneath the starry sky in a desert",
        "In a small, cozy cottage",
        "Aboard a sailing ship in the middle of the ocean",
        "In the ruins of an ancient temple",
        "At a lively street market",
        "Within a mysterious, foggy forest",
        "On a bridge over a serene river",
        "In a hidden underground cave",
        "At a grand, opulent palace",
        "In a small village surrounded by rolling hills",
        "On the balcony of a high-rise building",
        "At a chaotic, energetic carnival",
        "Inside an old, abandoned factory",
        "On a snowy field at the edge of a forest",
        "In a bustling airport terminal",
        "At the heart of a maze-like garden"
    ]

    const updateImage = async (newText, apiUrl, style='enhance', userID, setImageIndex) => {
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newText, style, userID }),
            });
            if (!response.ok) throw new Error('Network response was not ok.');
    
            const result = await response.text();
            if (result === 'reject') {
                // Handle rejection case
                return;
            }
    
            const img = new Image();
            img.src = `data:image/png;base64,${result}`;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 512;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const resizedImage = canvas.toDataURL('image/png');
                const base64Image = resizedImage.split(',')[1];
                // Set image data for the specified index when ready
                setImageData(prevImages => {
                    let updatedImages = [...prevImages];
                    updatedImages[setImageIndex] = base64Image;
                    return updatedImages;
                });
            };
            img.onerror = (error) => {
                console.error(`Error loading image: ${error.message}`);
            };
        } catch (error) {
            console.error('Error fetching or processing image:', error);
        }
    };

    const handleButtonClick = (e, index, type) => {
        e.preventDefault();
        setImageData(['/image_assets/create/creating_char0.webp','/image_assets/create/creating_char1.webp'])
        const randomIndex = Math.floor(Math.random() * storyhooks.length);
        const randomIndex2 = Math.floor(Math.random() * locations.length);
    
        // Prepare the formData
        const newFormData = {
            ...formData,
            name1: playerName || "Pirate Dave",
            race1: playerBackground || "A cunning pirate, quick to action, known for his good looks.",
            class1: playerAppearance,
            background1: playerAppearance || "A fantasy portrait of a handsome pirate with brown hair",
            gametype: genre,
            storyhook: storyhooks[randomIndex],
            setting: locations[randomIndex2]
        };
    
        // Prepare the additionalCharacters data
        const newAdditionalCharacters = [{
            name: sidekickName || "Mr. Fluff",
            role: sidekickBackground || "A fluffy white cat, loyal and rambunctious. Known for his powerful meow.",
            background: sidekickAppearance,
            description: sidekickAppearance || "A hype vaporwave painting of a white fluffy cat, yelling",
            type: 'character',
            inactive: false,
        }];
       
        updateImage(playerAppearance || "A fantasy portrait of a handsome pirate with brown hair", apiUrl, genre=='Anime'? 'anime': 'enhance', userID, 0);
        updateImage(sidekickAppearance || "A hype vaporwave painting of a white fluffy cat, yelling", apiUrl, genre=='Anime'? 'anime': 'enhance', userID, 1);
        // Pass all the data to onButtonClick
        onButtonClick(e,index,type,newFormData,newAdditionalCharacters);
    };

    return (
        <div className="card">
        <div style={{ display: 'flex', alignItems: 'center' }}>
                <h2 className="create-card-header">
                    Quick Create
                </h2>
                <div style={{ marginLeft: '15px' }}>
                    <select value={genre} onChange={(e) => setGenre(e.target.value)} className="adventure-model-select">
                        <option value="">Select Genre</option>
                        {genres.map((g, index) => (
                            <option key={index} value={g}>{g}</option>
                        ))}
                    </select>
                </div>
            </div>
        
        <div className="create-card-section">
            <div className="create-card-input-group">
                <div>
                    <label className="create-card-label">Player Name</label>
                    <input className="create-card-input" type="text" placeholder='Name' onChange={(e) => setPlayerName(e.target.value)} />
                </div>
                <div>
                    <label className="create-card-label">Appearance</label>
                    <input className="create-card-input" type="text" placeholder='Appearance' onChange={(e) => setPlayerAppearance(e.target.value)} />
                </div>
            </div>

            <label className="create-card-label">Player Background</label>
            <input className="create-card-input" type="text" placeholder='What are they like?' onChange={(e) => setPlayerBackground(e.target.value)} />

            <hr></hr>

            <div className="create-card-input-group" style={{marginTop:'5px'}}>
                <div>
                    <label className="create-card-label">Sidekick Name</label>
                    <input className="create-card-input" type="text" placeholder='Name' onChange={(e) => setSidekickName(e.target.value)} />
                </div>
                <div>
                    <label className="create-card-label">Appearance</label>
                    <input className="create-card-input" type="text" placeholder='Appearance' onChange={(e) => setSidekickAppearance(e.target.value)} />
                </div>
            </div>

            <label className="create-card-label">Sidekick Background</label>
            <input className="create-card-input" type="text" placeholder='What are they like?' onChange={(e) => setSidekickBackground(e.target.value)} />
        </div>


            <div className="adventure-button-div">
                <button className="card-button" onClick={(e) => handleButtonClick(e, false, "create-text")} style={{marginTop:'3px'}}>
                    Play Text
                </button>
                {browser !== "safari" && !mobile &&(
                    <button className="card-button card-button2" onClick={(e) => {sayAWord('a'); handleButtonClick(e, false, "create-image")}} style={{marginTop:'3px'}}>
                        Play Image/Audio
                    </button>
                )}
            </div>
        </div>
    );
};

export default CreateCard;
