import React, { useRef } from 'react';
import JSZip from 'jszip';

const FileUploadComponent = ({ onAdventureLoaded }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        
        // Load adventure data
        const adventureDataFile = contents.file('adventure_data.json');
        if (!adventureDataFile) {
          throw new Error('Invalid adventure file: missing adventure_data.json');
        }
        const adventureDataText = await adventureDataFile.async('text');
        const adventureData = JSON.parse(adventureDataText);
        
        // Load images
        const imagePromises = [];
        let imageIndex = 1;
        while (true) {
          const imageName = `image_${imageIndex}.jpg`;
          const imageFile = contents.file(imageName);
          if (!imageFile) break;
          
          imagePromises.push(
            imageFile.async('blob').then(blob => URL.createObjectURL(blob))
          );
          imageIndex++;
        }
        
        const images = await Promise.all(imagePromises);
        
        // Update adventureData with loaded image URLs
        adventureData.images = images;
        console.log(images);
        
        onAdventureLoaded(adventureData);
      } catch (error) {
        console.error('Error loading adventure:', error);
        alert('Error loading adventure. Please make sure you selected a valid adventure file.');
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".zip"
        style={{ display: 'none' }}
      />
      <button class="startButton" style={{marginBottom:"10px",boxShadow:"4px 2px 1px gold"}} onClick={handleButtonClick}>Upload Saved Game</button>
    </div>
  );
};

export default FileUploadComponent;